package com.shopsphere.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AiChatResponse {

    private Long sessionId;
    private String answer;
    private List<ProductDto> recommendedProducts;
    private List<String> policyCitations;
    private LocalDateTime timestamp;

    public AiChatResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public AiChatResponse(Long sessionId, String answer, List<ProductDto> recommendedProducts, List<String> policyCitations) {
        this.sessionId = sessionId;
        this.answer = answer;
        this.recommendedProducts = recommendedProducts;
        this.policyCitations = policyCitations;
        this.timestamp = LocalDateTime.now();
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public List<ProductDto> getRecommendedProducts() {
        return recommendedProducts;
    }

    public void setRecommendedProducts(List<ProductDto> recommendedProducts) {
        this.recommendedProducts = recommendedProducts;
    }

    public List<String> getPolicyCitations() {
        return policyCitations;
    }

    public void setPolicyCitations(List<String> policyCitations) {
        this.policyCitations = policyCitations;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
