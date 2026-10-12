package com.shopsphere.service;

import com.shopsphere.dto.ReviewCreateRequest;
import com.shopsphere.dto.ReviewDto;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.Review;
import com.shopsphere.entity.User;
import com.shopsphere.exception.ConflictException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.ReviewRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(ReviewDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto addReview(String userEmail, ReviewCreateRequest request) {
        User user = getUserByEmail(userEmail);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (reviewRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            throw new ConflictException("You have already reviewed this product.");
        }

        Review review = new Review(user, product, request.getRating(), request.getComment().trim());
        Review saved = reviewRepository.save(review);

        // Recalculate average rating on product
        List<Object[]> summary = reviewRepository.getRatingSummary(product.getId());
        if (!summary.isEmpty() && summary.get(0)[0] != null) {
            Double avg = (Double) summary.get(0)[0];
            Long count = (Long) summary.get(0)[1];
            product.setAverageRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            product.setReviewCount(count.intValue());
            productRepository.save(product);
        }

        return ReviewDto.fromEntity(saved);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
