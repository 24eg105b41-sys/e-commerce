package com.shopsphere.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * WishlistItem entity for student saved products.
 * Prevents duplicate wishlist entries per user and product.
 */
@Entity
@Table(name = "wishlist_items",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_user_product_wishlist", columnNames = {"user_id", "product_id"})
        },
        indexes = {
                @Index(name = "idx_wishlist_user", columnList = "user_id")
        })
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public WishlistItem() {
    }

    public WishlistItem(User user, Product product) {
        this.user = user;
        this.product = product;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
