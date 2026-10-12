package com.shopsphere.controller;

import com.shopsphere.dto.AddToCartRequest;
import com.shopsphere.dto.ApiResponse;
import com.shopsphere.dto.CartSummaryDto;
import com.shopsphere.dto.UpdateCartRequest;
import com.shopsphere.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart", description = "Endpoints for persistent server-side shopping cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get current user's shopping cart with recalculated totals")
    public ResponseEntity<ApiResponse<CartSummaryDto>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart(userDetails.getUsername())));
    }

    @PostMapping("/items")
    @Operation(summary = "Add an item to the shopping cart")
    public ResponseEntity<ApiResponse<CartSummaryDto>> addItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Item added to cart",
                cartService.addItemToCart(userDetails.getUsername(), request)));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update item quantity in cart")
    public ResponseEntity<ApiResponse<CartSummaryDto>> updateItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cart updated",
                cartService.updateItemQuantity(userDetails.getUsername(), itemId, request)));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove an item from cart")
    public ResponseEntity<ApiResponse<CartSummaryDto>> removeItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart",
                cartService.removeItem(userDetails.getUsername(), itemId)));
    }

    @DeleteMapping
    @Operation(summary = "Clear all items from cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully", null));
    }
}
