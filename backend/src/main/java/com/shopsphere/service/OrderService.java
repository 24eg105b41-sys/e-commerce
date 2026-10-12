package com.shopsphere.service;

import com.shopsphere.dto.CheckoutRequest;
import com.shopsphere.dto.OrderDto;
import com.shopsphere.entity.*;
import com.shopsphere.enums.OrderStatus;
import com.shopsphere.enums.PaymentMethod;
import com.shopsphere.enums.PaymentStatus;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service managing transactional checkout, inventory deduction, order lifecycle,
 * and simulated student campus payment processing.
 */
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CartItemRepository cartItemRepository,
                        ProductRepository productRepository,
                        AddressRepository addressRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    /**
     * Executes atomic checkout: validates cart, re-checks stock, deducts inventory,
     * computes backend totals, creates order with snapshot items, and clears cart.
     */
    @Transactional
    public OrderDto checkout(String userEmail, CheckoutRequest request) {
        User user = getUserByEmail(userEmail);

        // 1. Fetch and validate delivery address
        Address address = addressRepository.findByIdAndUserId(request.getAddressId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Selected delivery address not found"));

        // 2. Fetch customer cart items
        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your shopping cart is empty. Please add products before checking out.");
        }

        // 3. Verify stock availability and recalculate line totals directly from active product records
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (!product.isActive()) {
                throw new BadRequestException("Product '" + product.getName() + "' is no longer active in our catalog");
            }
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for '" + product.getName() +
                        "'. Requested: " + item.getQuantity() + ", Available: " + product.getStockQuantity());
            }

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(lineTotal);
        }

        // 4. Calculate backend shipping fee (Free delivery for orders >= ₹499)
        BigDecimal shippingFee = (subtotal.compareTo(new BigDecimal("499.00")) >= 0)
                ? BigDecimal.ZERO : new BigDecimal("40.00");
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(shippingFee).subtract(discountAmount);

        // 5. Build order with immutable address snapshot
        String orderNumber = "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) +
                "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setRecipientName(address.getRecipientName());
        order.setPhone(address.getPhone());
        order.setAddressLine(address.getAddressLine());
        order.setCity(address.getCity());
        order.setState(address.getState());
        order.setPostalCode(address.getPostalCode());
        order.setSubtotal(subtotal);
        order.setShippingFee(shippingFee);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(totalAmount);
        order.setOrderStatus(OrderStatus.PLACED);

        PaymentMethod method = request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CAMPUS_PAY_SIMULATED;
        order.setPaymentMethod(method);
        // Simulated educational payment auto-completes simulated campus wallet / UPI
        if (method == PaymentMethod.CAMPUS_PAY_SIMULATED || method == PaymentMethod.UPI_SIMULATED) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
            order.setOrderStatus(OrderStatus.CONFIRMED);
        } else {
            order.setPaymentStatus(PaymentStatus.PENDING);
        }

        // 6. Deduct inventory atomically and generate order items with historical snapshots
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    product.getName(),
                    product.getSku(),
                    product.getPrice(),
                    item.getQuantity(),
                    lineTotal
            );
            order.addOrderItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // 7. Clear purchased cart items
        cartItemRepository.deleteByUserId(user.getId());

        return OrderDto.fromEntity(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getCustomerOrders(String userEmail) {
        User user = getUserByEmail(userEmail);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(String userEmail, Long orderId) {
        User user = getUserByEmail(userEmail);
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found or does not belong to you"));
        return OrderDto.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderByOrderNumber(String userEmail, String orderNumber) {
        User user = getUserByEmail(userEmail);
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found or unauthorized");
        }
        return OrderDto.fromEntity(order);
    }

    /**
     * Cancels an eligible order and restores inventory safely.
     */
    @Transactional
    public OrderDto cancelOrder(String userEmail, Long orderId) {
        User user = getUserByEmail(userEmail);
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getOrderStatus().canTransitionTo(OrderStatus.CANCELLED)) {
            throw new BadRequestException("Order cannot be cancelled in its current status: " + order.getOrderStatus());
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        if (order.getPaymentStatus() == PaymentStatus.COMPLETED) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        // Restock inventory
        for (OrderItem item : order.getOrderItems()) {
            if (item.getProduct() != null) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }

        return OrderDto.fromEntity(orderRepository.save(order));
    }

    // Admin methods
    @Transactional(readOnly = true)
    public Page<OrderDto> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(OrderDto::fromEntity);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getOrderStatus().canTransitionTo(newStatus)) {
            throw new BadRequestException("Invalid status transition from " + order.getOrderStatus() + " to " + newStatus);
        }

        order.setOrderStatus(newStatus);
        if (newStatus == OrderStatus.DELIVERED && order.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
        }

        return OrderDto.fromEntity(orderRepository.save(order));
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
