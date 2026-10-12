package com.shopsphere.controller;

import com.shopsphere.dto.ApiResponse;
import com.shopsphere.dto.CheckoutRequest;
import com.shopsphere.dto.OrderDto;
import com.shopsphere.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Endpoints for checkout, order history, and cancellation")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Checkout current shopping cart and create order")
    public ResponseEntity<ApiResponse<OrderDto>> checkout(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CheckoutRequest request) {
        OrderDto order = orderService.checkout(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping("/my")
    @Operation(summary = "Get list of orders placed by authenticated user")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getCustomerOrders(userDetails.getUsername())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by order ID (scoped to owner)")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(userDetails.getUsername(), id)));
    }

    @GetMapping("/number/{orderNumber}")
    @Operation(summary = "Get order details by order number")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderByNumber(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderByOrderNumber(userDetails.getUsername(), orderNumber)));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an eligible order")
    public ResponseEntity<ApiResponse<OrderDto>> cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully",
                orderService.cancelOrder(userDetails.getUsername(), id)));
    }
}
