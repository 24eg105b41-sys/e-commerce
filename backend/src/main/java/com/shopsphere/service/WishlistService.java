package com.shopsphere.service;

import com.shopsphere.dto.WishlistDto;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.User;
import com.shopsphere.entity.WishlistItem;
import com.shopsphere.exception.ConflictException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistItemRepository wishlistRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<WishlistDto> getWishlist(String userEmail) {
        User user = getUserByEmail(userEmail);
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(WishlistDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public WishlistDto addToWishlist(String userEmail, Long productId) {
        User user = getUserByEmail(userEmail);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            throw new ConflictException("Product is already in your wishlist");
        }

        WishlistItem item = new WishlistItem(user, product);
        return WishlistDto.fromEntity(wishlistRepository.save(item));
    }

    @Transactional
    public void removeFromWishlist(String userEmail, Long productId) {
        User user = getUserByEmail(userEmail);
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
