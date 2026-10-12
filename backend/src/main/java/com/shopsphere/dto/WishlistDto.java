package com.shopsphere.dto;

import com.shopsphere.entity.WishlistItem;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WishlistDto {

    private Long id;
    private Long productId;
    private String productName;
    private String productSlug;
    private String brand;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private LocalDateTime addedAt;

    public WishlistDto() {
    }

    public static WishlistDto fromEntity(WishlistItem item) {
        WishlistDto dto = new WishlistDto();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductSlug(item.getProduct().getSlug());
        dto.setBrand(item.getProduct().getBrand());
        dto.setPrice(item.getProduct().getPrice());
        dto.setStockQuantity(item.getProduct().getStockQuantity());
        dto.setImageUrl(item.getProduct().getImageUrl());
        dto.setAddedAt(item.getCreatedAt());
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

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductSlug() {
        return productSlug;
    }

    public void setProductSlug(String productSlug) {
        this.productSlug = productSlug;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }
}
