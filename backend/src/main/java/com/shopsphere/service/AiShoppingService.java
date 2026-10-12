package com.shopsphere.service;

import com.shopsphere.dto.AiChatRequest;
import com.shopsphere.dto.AiChatResponse;
import com.shopsphere.dto.ChatMessageDto;
import com.shopsphere.dto.ChatSessionDto;
import com.shopsphere.dto.ProductDto;
import com.shopsphere.entity.ChatMessage;
import com.shopsphere.entity.ChatSession;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.User;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.ChatMessageRepository;
import com.shopsphere.repository.ChatSessionRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * AI Shopping Assistant service with catalog grounding and policy RAG integration.
 * Prevents hallucinations by strictly grounding all product recommendations in verified MySQL catalog records.
 */
@Service
public class AiShoppingService {

    private static final Logger log = LoggerFactory.getLogger(AiShoppingService.class);

    private final ProductRepository productRepository;
    private final ChatSessionRepository sessionRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final CampusKnowledgeBaseService knowledgeBaseService;

    @Value("${app.ai.provider:local}")
    private String aiProvider;

    @Value("${app.ai.api-key:}")
    private String apiKey;

    public AiShoppingService(ProductRepository productRepository,
                             ChatSessionRepository sessionRepository,
                             ChatMessageRepository messageRepository,
                             UserRepository userRepository,
                             CampusKnowledgeBaseService knowledgeBaseService) {
        this.productRepository = productRepository;
        this.sessionRepository = sessionRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.knowledgeBaseService = knowledgeBaseService;
    }

    /**
     * Processes customer inquiry with natural language catalog matching and policy Q&A.
     */
    @Transactional
    public AiChatResponse chat(String userEmail, AiChatRequest request) {
        User user = getUserByEmail(userEmail);

        // 1. Resolve or create chat session
        ChatSession session;
        if (request.getSessionId() != null) {
            session = sessionRepository.findByIdAndUserId(request.getSessionId(), user.getId())
                    .orElseGet(() -> createNewSession(user, request.getMessage()));
        } else {
            session = createNewSession(user, request.getMessage());
        }

        // 2. Persist customer query message
        ChatMessage userMessage = new ChatMessage(session, "USER", request.getMessage());
        session.addMessage(userMessage);

        // 3. Grounding & RAG Retrieval: Extract query intent, budget, and search real catalog
        List<Product> matchedProducts = retrieveGroundedProducts(request.getMessage());
        List<CampusKnowledgeBaseService.PolicyDocument> matchedPolicies =
                knowledgeBaseService.findRelevantPolicies(request.getMessage());

        // 4. Synthesize grounded answer
        String responseText = generateGroundedResponse(request.getMessage(), matchedProducts, matchedPolicies);

        // 5. Persist assistant reply message
        ChatMessage assistantMessage = new ChatMessage(session, "ASSISTANT", responseText);
        session.addMessage(assistantMessage);
        sessionRepository.save(session);

        // 6. Format verified products and policy citations
        List<ProductDto> productDtos = matchedProducts.stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());

        List<String> citations = matchedPolicies.stream()
                .map(CampusKnowledgeBaseService.PolicyDocument::citation)
                .collect(Collectors.toList());

        return new AiChatResponse(session.getId(), responseText, productDtos, citations);
    }

    @Transactional(readOnly = true)
    public List<ChatSessionDto> getUserSessions(String userEmail) {
        User user = getUserByEmail(userEmail);
        return sessionRepository.findByUserIdOrderByUpdatedAtDesc(user.getId()).stream()
                .map(ChatSessionDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDto> getSessionMessages(String userEmail, Long sessionId) {
        User user = getUserByEmail(userEmail);
        ChatSession session = sessionRepository.findByIdAndUserId(sessionId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat session not found"));

        return messageRepository.findBySessionIdOrderByCreatedAtAsc(session.getId()).stream()
                .map(ChatMessageDto::fromEntity)
                .collect(Collectors.toList());
    }

    private ChatSession createNewSession(User user, String initialMessage) {
        String title = initialMessage.length() > 40 ? initialMessage.substring(0, 37) + "..." : initialMessage;
        ChatSession session = new ChatSession(user, title);
        return sessionRepository.save(session);
    }

    /**
     * Extracts keywords and numerical budget constraints to retrieve authentic catalog items from MySQL.
     */
    private List<Product> retrieveGroundedProducts(String query) {
        String lower = query.toLowerCase();

        // Extract budget constraint if present (e.g., "under 60000", "below 1000", "< 2000")
        BigDecimal maxBudget = extractBudget(lower);

        // Determine target category or search term
        String searchTerm = "";
        if (lower.contains("laptop") || lower.contains("computer") || lower.contains("macbook") || lower.contains("programming machine")) {
            searchTerm = "laptop";
        } else if (lower.contains("keyboard") || lower.contains("typing") || lower.contains("mechanical")) {
            searchTerm = "keyboard";
        } else if (lower.contains("mouse") || lower.contains("scrolling")) {
            searchTerm = "mouse";
        } else if (lower.contains("headphone") || lower.contains("audio") || lower.contains("earbud") || lower.contains("sound")) {
            searchTerm = "headphone";
        } else if (lower.contains("book") || lower.contains("algorithm") || lower.contains("textbook") || lower.contains("networking") || lower.contains("os")) {
            searchTerm = "book";
        } else if (lower.contains("calculator") || lower.contains("power bank") || lower.contains("drive") || lower.contains("device")) {
            searchTerm = "calculator";
        } else if (lower.contains("pen") || lower.contains("notebook") || lower.contains("stationery")) {
            searchTerm = "notebook";
        }

        List<Product> products = productRepository.searchProducts(
                null, BigDecimal.ZERO, maxBudget != null ? maxBudget : new BigDecimal("999999.00"),
                searchTerm.isBlank() ? null : searchTerm, PageRequest.of(0, 4)
        ).getContent();

        // If no products matched the keyword query, fall back to top rated featured products
        if (products.isEmpty() && maxBudget == null) {
            products = productRepository.findTop8ByActiveTrueOrderByAverageRatingDescCreatedAtDesc().stream()
                    .limit(3)
                    .collect(Collectors.toList());
        }

        return products;
    }

    private BigDecimal extractBudget(String text) {
        Pattern pattern = Pattern.compile("(under|below|budget|within|less than|max)\\s*(?:rs\\.?|inr|₹)?\\s*(\\d{2,6})", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            try {
                return new BigDecimal(matcher.group(2));
            } catch (Exception ignored) {}
        }
        return null;
    }

    /**
     * Synthesizes an intelligent, professional, student-focused response using grounded catalog data.
     */
    private String generateGroundedResponse(String userQuery, List<Product> products,
                                            List<CampusKnowledgeBaseService.PolicyDocument> policies) {
        StringBuilder sb = new StringBuilder();

        if (products.isEmpty() && policies.isEmpty()) {
            return "I searched our campus catalog for \"" + userQuery +
                    "\", but could not find an exact match in stock right now. You can check our categories (Laptops, Accessories, Books, Audio) or adjust your price filter!";
        }

        if (!products.isEmpty()) {
            sb.append("Here are verified campus store recommendations matching your requirements:\n\n");
            for (Product p : products) {
                sb.append("• **").append(p.getName()).append("** (₹").append(p.getPrice())
                        .append("): ").append(p.getBrand()).append(" — ")
                        .append(p.getStockQuantity() > 0 ? "In Stock (" + p.getStockQuantity() + " units available)" : "Currently Out of Stock")
                        .append(".\n");
            }
            sb.append("\nAll listed products are available directly on ShopSphere Campus with student delivery.\n");
        }

        if (!policies.isEmpty()) {
            sb.append("\n**Campus Store Guidelines:**\n");
            for (CampusKnowledgeBaseService.PolicyDocument doc : policies) {
                sb.append("• ").append(doc.section()).append(": ").append(doc.content()).append("\n");
            }
        }

        return sb.toString();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User account not found"));
    }
}
