package com.shopsphere.service;

import com.shopsphere.dto.AddToCartRequest;
import com.shopsphere.dto.CartItemDto;
import com.shopsphere.dto.CartSummaryDto;
import com.shopsphere.dto.UpdateCartRequest;
import com.shopsphere.entity.CartItem;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service managing persistent server-side shopping carts.
 * Always recalculates totals from active database records; never trusts client-supplied totals.
 */
@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public CartSummaryDto getCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<CartItem> items = cartItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        List<CartItemDto> itemDtos = items.stream()
                .map(CartItemDto::fromEntity)
                .collect(Collectors.toList());

        BigDecimal subtotal = itemDtos.stream()
                .map(CartItemDto::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Student campus free shipping on orders over ₹499
        BigDecimal shippingFee = (subtotal.compareTo(new BigDecimal("499.00")) >= 0 || subtotal.compareTo(BigDecimal.ZERO) == 0)
                ? BigDecimal.ZERO : new BigDecimal("40.00");

        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(shippingFee).subtract(discountAmount);

        int totalItems = items.stream().mapToInt(CartItem::getQuantity).sum();

        return new CartSummaryDto(itemDtos, totalItems, subtotal, shippingFee, discountAmount, totalAmount);
    }

    @Transactional
    public CartSummaryDto addItemToCart(String userEmail, AddToCartRequest request) {
        User user = getUserByEmail(userEmail);

        Product product = productRepository.findByIdAndActiveTrue(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found or is currently inactive"));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Requested quantity (" + request.getQuantity() +
                    ") exceeds available stock (" + product.getStockQuantity() + ")");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserIdAndProductId(user.getId(), product.getId());

        if (existingItemOpt.isPresent()) {
            CartItem existing = existingItemOpt.get();
            int newQuantity = existing.getQuantity() + request.getQuantity();
            if (product.getStockQuantity() < newQuantity) {
                throw new BadRequestException("Cannot add more. Total in cart (" + newQuantity +
                        ") would exceed available stock (" + product.getStockQuantity() + ")");
            }
            existing.setQuantity(newQuantity);
            cartItemRepository.save(existing);
        } else {
            CartItem newItem = new CartItem(user, product, request.getQuantity());
            cartItemRepository.save(newItem);
        }

        return getCart(userEmail);
    }

    @Transactional
    public CartSummaryDto updateItemQuantity(String userEmail, Long itemId, UpdateCartRequest request) {
        User user = getUserByEmail(userEmail);

        CartItem item = cartItemRepository.findByIdAndUserId(itemId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found or does not belong to user"));

        if (item.getProduct().getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Requested quantity (" + request.getQuantity() +
                    ") exceeds available stock (" + item.getProduct().getStockQuantity() + ")");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return getCart(userEmail);
    }

    @Transactional
    public CartSummaryDto removeItem(String userEmail, Long itemId) {
        User user = getUserByEmail(userEmail);

        CartItem item = cartItemRepository.findByIdAndUserId(itemId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found or does not belong to user"));

        cartItemRepository.delete(item);

        return getCart(userEmail);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = getUserByEmail(userEmail);
        cartItemRepository.deleteByUserId(user.getId());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User account not found"));
    }
}
