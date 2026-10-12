package com.shopsphere.controller;

import com.shopsphere.dto.*;
import com.shopsphere.service.AiShoppingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Shopping Assistant", description = "Endpoints for grounded AI product recommendations and policy Q&A")
public class AiController {

    private final AiShoppingService aiShoppingService;

    public AiController(AiShoppingService aiShoppingService) {
        this.aiShoppingService = aiShoppingService;
    }

    @PostMapping("/chat")
    @Operation(summary = "Ask the AI assistant for natural language product advice and policy help")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = aiShoppingService.chat(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/sessions")
    @Operation(summary = "Get past chat sessions for current user")
    public ResponseEntity<ApiResponse<List<ChatSessionDto>>> getSessions(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(aiShoppingService.getUserSessions(userDetails.getUsername())));
    }

    @GetMapping("/sessions/{id}/messages")
    @Operation(summary = "Get message history for a specific chat session")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> getSessionMessages(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(aiShoppingService.getSessionMessages(userDetails.getUsername(), id)));
    }
}
