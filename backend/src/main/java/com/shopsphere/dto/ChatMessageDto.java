package com.shopsphere.dto;

import com.shopsphere.entity.ChatMessage;
import java.time.LocalDateTime;

public class ChatMessageDto {

    private Long id;
    private String sender;
    private String message;
    private LocalDateTime createdAt;

    public ChatMessageDto() {
    }

    public static ChatMessageDto fromEntity(ChatMessage m) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(m.getId());
        dto.setSender(m.getSender());
        dto.setMessage(m.getMessage());
        dto.setCreatedAt(m.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
