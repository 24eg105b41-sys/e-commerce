package com.shopsphere.repository;

import com.shopsphere.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlugAndActiveTrue(String slug);

    Optional<Product> findByIdAndActiveTrue(Long id);

    boolean existsBySku(String sku);

    boolean existsBySlug(String slug);

    long countByActiveTrue();

    long countByStockQuantityLessThanEqualAndActiveTrue(Integer threshold);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProducts(@Param("categoryId") Long categoryId,
                                @Param("minPrice") BigDecimal minPrice,
                                @Param("maxPrice") BigDecimal maxPrice,
                                @Param("keyword") String keyword,
                                Pageable pageable);

    List<Product> findTop8ByActiveTrueOrderByAverageRatingDescCreatedAtDesc();

    List<Product> findTop4ByCategoryIdAndActiveTrueAndIdNot(Long categoryId, Long id);

    List<Product> findTop5ByActiveTrueAndStockQuantityLessThanEqualOrderByStockQuantityAsc(Integer threshold);
}
