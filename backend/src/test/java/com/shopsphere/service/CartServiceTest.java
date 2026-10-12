package com.shopsphere.service;

import com.shopsphere.dto.AddToCartRequest;
import com.shopsphere.dto.CartSummaryDto;
import com.shopsphere.entity.CartItem;
import com.shopsphere.entity.Category;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.User;
import com.shopsphere.enums.Role;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    private User sampleUser;
    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Arun Kumar", "arun@campus.edu", "hashed", Role.ROLE_CUSTOMER);
        sampleUser.setId(1L);

        Category category = new Category("Accessories", "accessories", "Desc", "img.jpg");
        category.setId(10L);

        sampleProduct = new Product(
                category, "Mechanical Keyboard", "mech-keyboard", "Cherry MX",
                "Keychron", "KB-001", new BigDecimal("2500.00"), 5, "keyboard.jpg"
        );
        sampleProduct.setId(100L);
    }

    @Test
    @DisplayName("Should successfully add item to cart and recalculate subtotal")
    void testAddToCartSuccess() {
        AddToCartRequest request = new AddToCartRequest(100L, 2);

        when(userRepository.findByEmail("arun@campus.edu")).thenReturn(Optional.of(sampleUser));
        when(productRepository.findByIdAndActiveTrue(100L)).thenReturn(Optional.of(sampleProduct));
        when(cartItemRepository.findByUserIdAndProductId(1L, 100L)).thenReturn(Optional.empty());

        CartItem savedItem = new CartItem(sampleUser, sampleProduct, 2);
        savedItem.setId(50L);

        when(cartItemRepository.save(any(CartItem.class))).thenReturn(savedItem);
        when(cartItemRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(savedItem));

        CartSummaryDto summary = cartService.addItemToCart("arun@campus.edu", request);

        assertNotNull(summary);
        assertEquals(1, summary.getItems().size());
        assertEquals(2, summary.getTotalItems());
        assertEquals(new BigDecimal("5000.00"), summary.getSubtotal());
        assertEquals(BigDecimal.ZERO, summary.getShippingFee()); // Free shipping > ₹499
    }

    @Test
    @DisplayName("Should reject adding item to cart when requested quantity exceeds available stock")
    void testAddToCartExceedsStock() {
        AddToCartRequest request = new AddToCartRequest(100L, 10); // only 5 in stock

        when(userRepository.findByEmail("arun@campus.edu")).thenReturn(Optional.of(sampleUser));
        when(productRepository.findByIdAndActiveTrue(100L)).thenReturn(Optional.of(sampleProduct));

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> cartService.addItemToCart("arun@campus.edu", request));

        assertTrue(ex.getMessage().contains("exceeds available stock"));
        verify(cartItemRepository, never()).save(any());
    }
}
