package com.shopsphere.service;

import com.shopsphere.dto.ProductCreateRequest;
import com.shopsphere.dto.ProductDto;
import com.shopsphere.dto.ProductUpdateRequest;
import com.shopsphere.entity.Category;
import com.shopsphere.entity.Product;
import com.shopsphere.exception.ConflictException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ProductRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service orchestrating product catalog search, filtering, inventory management, and CRUD.
 */
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> searchProducts(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                           String keyword, Pageable pageable) {
        String cleanKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        return productRepository.searchProducts(categoryId, minPrice, maxPrice, cleanKeyword, pageable)
                .map(ProductDto::fromEntity);
    }

    @Cacheable(value = "productDetails", key = "#id")
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return ProductDto.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return ProductDto.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findTop8ByActiveTrueOrderByAverageRatingDescCreatedAtDesc().stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getRelatedProducts(Long id) {
        Product current = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productRepository.findTop4ByCategoryIdAndActiveTrueAndIdNot(current.getCategory().getId(), id).stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @CacheEvict(value = {"productDetails", "popularProducts"}, allEntries = true)
    @Transactional
    public ProductDto createProduct(ProductCreateRequest request) {
        if (productRepository.existsBySku(request.getSku().trim())) {
            throw new ConflictException("Product with SKU '" + request.getSku() + "' already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        String slug = generateSlug(request.getName());
        int counter = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = generateSlug(request.getName()) + "-" + counter++;
        }

        Product product = new Product(
                category,
                request.getName().trim(),
                slug,
                request.getDescription().trim(),
                request.getBrand().trim(),
                request.getSku().trim(),
                request.getPrice(),
                request.getStockQuantity(),
                request.getImageUrl()
        );

        return ProductDto.fromEntity(productRepository.save(product));
    }

    @CacheEvict(value = {"productDetails", "popularProducts"}, allEntries = true)
    @Transactional
    public ProductDto updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            product.setName(request.getName().trim());
        }
        if (request.getDescription() != null) product.setDescription(request.getDescription().trim());
        if (request.getBrand() != null) product.setBrand(request.getBrand().trim());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStockQuantity() != null) product.setStockQuantity(request.getStockQuantity());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getActive() != null) product.setActive(request.getActive());

        return ProductDto.fromEntity(productRepository.save(product));
    }

    @CacheEvict(value = {"productDetails", "popularProducts"}, allEntries = true)
    @Transactional
    public ProductDto toggleProductStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setActive(!product.isActive());
        return ProductDto.fromEntity(productRepository.save(product));
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }
}
