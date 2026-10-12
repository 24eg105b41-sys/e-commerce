package com.shopsphere.dto;

import com.shopsphere.entity.CartItem;
import java.math.BigDecimal;

public class CartItemDto {

    private Long id;
    private Long productId;
    private String productName;
    private String productSlug;
    private String productSku;
    private String imageUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal lineTotal;
    private Integer stockAvailable;
    private boolean inStock;

    public CartItemDto() {
    }

    public static CartItemDto fromEntity(CartItem item) {
        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductSlug(item.getProduct().getSlug());
        dto.setProductSku(item.getProduct().getSku());
        dto.setImageUrl(item.getProduct().getImageUrl());
        dto.setUnitPrice(item.getProduct().getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setLineTotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        dto.setStockAvailable(item.getProduct().getStockQuantity());
        dto.setInStock(item.getProduct().getStockQuantity() >= item.getQuantity() && item.getProduct().isActive());
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

    public String getProductSku() {
        return productSku;
    }

    public void setProductSku(String productSku) {
        this.productSku = productSku;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getLineTotal() {
        return lineTotal;
    }

    public void setLineTotal(BigDecimal lineTotal) {
        this.lineTotal = lineTotal;
    }

    public Integer getStockAvailable() {
        return stockAvailable;
    }

    public void setStockAvailable(Integer stockAvailable) {
        this.stockAvailable = stockAvailable;
    }

    public boolean isInStock() {
        return inStock;
    }

    public void setInStock(boolean inStock) {
        this.inStock = inStock;
    }
}
