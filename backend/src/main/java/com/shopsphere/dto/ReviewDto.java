package com.shopsphere.dto;

import com.shopsphere.entity.Review;
import java.time.LocalDateTime;

public class ReviewDto {

    private Long id;
    private Long productId;
    private String reviewerName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDto() {
    }

    public static ReviewDto fromEntity(Review r) {
        ReviewDto dto = new ReviewDto();
        dto.setId(r.getId());
        dto.setProductId(r.getProduct().getId());
        dto.setReviewerName(r.getUser().getFullName());
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
