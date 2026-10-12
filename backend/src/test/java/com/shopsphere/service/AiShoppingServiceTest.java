package com.shopsphere.service;

import com.shopsphere.dto.AiChatRequest;
import com.shopsphere.dto.AiChatResponse;
import com.shopsphere.entity.*;
import com.shopsphere.enums.Role;
import com.shopsphere.repository.ChatMessageRepository;
import com.shopsphere.repository.ChatSessionRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiShoppingServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ChatSessionRepository sessionRepository;

    @Mock
    private ChatMessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CampusKnowledgeBaseService knowledgeBaseService;

    @InjectMocks
    private AiShoppingService aiShoppingService;

    private User sampleUser;
    private Product sampleLaptop;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Arun Kumar", "arun@campus.edu", "hashed", Role.ROLE_CUSTOMER);
        sampleUser.setId(1L);

        Category category = new Category("Laptops", "laptops", "Desc", "img.jpg");
        sampleLaptop = new Product(
                category, "ThinkPad E14", "thinkpad-e14", "Java Development Laptop",
                "Lenovo", "LP-LEN", new BigDecimal("58990.00"), 10, "laptop.jpg"
        );
        sampleLaptop.setId(10L);
    }

    @Test
    @DisplayName("Should extract laptop intent and budget, returning real catalog products")
    void testGroundedCatalogRecommendation() {
        AiChatRequest request = new AiChatRequest(null, "I need a laptop for Java under 60000");

        when(userRepository.findByEmail("arun@campus.edu")).thenReturn(Optional.of(sampleUser));
        when(sessionRepository.save(any(ChatSession.class))).thenAnswer(i -> {
            ChatSession s = i.getArgument(0);
            s.setId(100L);
            return s;
        });

        when(productRepository.searchProducts(isNull(), eq(BigDecimal.ZERO), eq(new BigDecimal("60000")), eq("laptop"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(sampleLaptop)));

        when(knowledgeBaseService.findRelevantPolicies(anyString())).thenReturn(Collections.emptyList());

        AiChatResponse response = aiShoppingService.chat("arun@campus.edu", request);

        assertNotNull(response);
        assertEquals(100L, response.getSessionId());
        assertEquals(1, response.getRecommendedProducts().size());
        assertEquals("ThinkPad E14", response.getRecommendedProducts().get(0).getName());
        assertTrue(response.getAnswer().contains("ThinkPad E14"));
    }
}
