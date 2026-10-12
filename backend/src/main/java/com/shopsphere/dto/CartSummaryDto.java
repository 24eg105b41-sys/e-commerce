package com.shopsphere.dto;

import java.math.BigDecimal;
import java.util.List;

public class CartSummaryDto {

    private List<CartItemDto> items;
    private int totalItems;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;

    public CartSummaryDto() {
    }

    public CartSummaryDto(List<CartItemDto> items, int totalItems, BigDecimal subtotal,
                          BigDecimal shippingFee, BigDecimal discountAmount, BigDecimal totalAmount) {
        this.items = items;
        this.totalItems = totalItems;
        this.subtotal = subtotal;
        this.shippingFee = shippingFee;
        this.discountAmount = discountAmount;
        this.totalAmount = totalAmount;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
