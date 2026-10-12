package com.shopsphere.service;

import com.shopsphere.dto.CheckoutRequest;
import com.shopsphere.dto.OrderDto;
import com.shopsphere.entity.*;
import com.shopsphere.enums.OrderStatus;
import com.shopsphere.enums.PaymentMethod;
import com.shopsphere.enums.PaymentStatus;
import com.shopsphere.enums.Role;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.repository.*;
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
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderService orderService;

    private User sampleUser;
    private Address sampleAddress;
    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Arun Kumar", "arun@campus.edu", "pwd", Role.ROLE_CUSTOMER);
        sampleUser.setId(1L);

        sampleAddress = new Address(sampleUser, "Arun Kumar", "9876543210", "Hostel 4, Room 212", "Chennai", "TN", "600025", true);
        sampleAddress.setId(5L);

        Category category = new Category("Electronics", "electronics", "Desc", "img.jpg");
        sampleProduct = new Product(category, "Laptop Stand", "laptop-stand", "Aluminum", "Portronics", "ST-01",
                new BigDecimal("800.00"), 10, "stand.jpg");
        sampleProduct.setId(20L);
    }

    @Test
    @DisplayName("Should successfully execute checkout, deduct inventory, and clear cart")
    void testSuccessfulCheckout() {
        CheckoutRequest request = new CheckoutRequest(5L, PaymentMethod.CAMPUS_PAY_SIMULATED);

        when(userRepository.findByEmail("arun@campus.edu")).thenReturn(Optional.of(sampleUser));
        when(addressRepository.findByIdAndUserId(5L, 1L)).thenReturn(Optional.of(sampleAddress));

        CartItem cartItem = new CartItem(sampleUser, sampleProduct, 2);
        when(cartItemRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(cartItem));

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(101L);
            return o;
        });

        OrderDto order = orderService.checkout("arun@campus.edu", request);

        assertNotNull(order);
        assertEquals(8, sampleProduct.getStockQuantity()); // 10 - 2 = 8
        verify(productRepository).save(sampleProduct);
        verify(cartItemRepository).deleteByUserId(1L);
        assertEquals(OrderStatus.CONFIRMED.name(), order.getOrderStatus());
        assertEquals(PaymentStatus.COMPLETED.name(), order.getPaymentStatus());
    }

    @Test
    @DisplayName("Should reject checkout if shopping cart is empty")
    void testCheckoutEmptyCart() {
        CheckoutRequest request = new CheckoutRequest(5L, PaymentMethod.CAMPUS_PAY_SIMULATED);

        when(userRepository.findByEmail("arun@campus.edu")).thenReturn(Optional.of(sampleUser));
        when(addressRepository.findByIdAndUserId(5L, 1L)).thenReturn(Optional.of(sampleAddress));
        when(cartItemRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(Collections.emptyList());

        assertThrows(BadRequestException.class, () -> orderService.checkout("arun@campus.edu", request));
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should cancel eligible order and restore product stock")
    void testCancelOrderRestoresStock() {
        Order order = new Order();
        order.setId(101L);
        order.setUser(sampleUser);
        order.setOrderStatus(OrderStatus.CONFIRMED);
        order.setPaymentStatus(PaymentStatus.COMPLETED);

        OrderItem orderItem = new OrderItem(order, sampleProduct, "Laptop Stand", "ST-01",
                new BigDecimal("800.00"), 2, new BigDecimal("1600.00"));
        order.addOrderItem(orderItem);

        when(userRepository.findByEmail("arun@campus.edu")).thenReturn(Optional.of(sampleUser));
        when(orderRepository.findByIdAndUserId(101L, 1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        OrderDto cancelled = orderService.cancelOrder("arun@campus.edu", 101L);

        assertEquals(OrderStatus.CANCELLED.name(), cancelled.getOrderStatus());
        assertEquals(12, sampleProduct.getStockQuantity()); // 10 + 2 restored = 12
        verify(productRepository).save(sampleProduct);
    }
}
