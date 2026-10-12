package com.shopsphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AiChatRequest {

    private Long sessionId;

    @NotBlank(message = "Message query cannot be blank")
    @Size(max = 1000, message = "Message cannot exceed 1000 characters")
    private String message;

    public AiChatRequest() {
    }

    public AiChatRequest(Long sessionId, String message) {
        this.sessionId = sessionId;
        this.message = message;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
