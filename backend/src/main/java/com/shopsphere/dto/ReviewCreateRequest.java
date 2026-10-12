package com.shopsphere.dto;

import jakarta.validation.constraints.*;

public class ReviewCreateRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5 stars")
    @Max(value = 5, message = "Rating must be between 1 and 5 stars")
    private Integer rating;

    @NotBlank(message = "Feedback comment is required")
    @Size(max = 1000, message = "Review comment cannot exceed 1000 characters")
    private String comment;

    public ReviewCreateRequest() {
    }

    public ReviewCreateRequest(Long productId, Integer rating, String comment) {
        this.productId = productId;
        this.rating = rating;
        this.comment = comment;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
