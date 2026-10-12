package com.shopsphere.service;

import com.shopsphere.dto.ProductCreateRequest;
import com.shopsphere.dto.ProductDto;
import com.shopsphere.entity.Category;
import com.shopsphere.entity.Product;
import com.shopsphere.exception.ConflictException;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    private Category sampleCategory;
    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleCategory = new Category("Engineering Books", "engineering-books", "Core CSE Textbooks", "books.jpg");
        sampleCategory.setId(1L);

        sampleProduct = new Product(
                sampleCategory, "Introduction to Algorithms (CLRS)", "clrs-algorithms",
                "Algorithms textbook", "MIT Press", "BK-CLRS", new BigDecimal("1850.00"), 20, "clrs.jpg"
        );
        sampleProduct.setId(10L);
    }

    @Test
    @DisplayName("Should successfully search products with keyword and pagination")
    void testSearchProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(sampleProduct), pageable, 1);

        when(productRepository.searchProducts(null, BigDecimal.ZERO, new BigDecimal("2000.00"), "algorithms", pageable))
                .thenReturn(page);

        Page<ProductDto> result = productService.searchProducts(null, BigDecimal.ZERO, new BigDecimal("2000.00"), "algorithms", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Introduction to Algorithms (CLRS)", result.getContent().get(0).getName());
    }

    @Test
    @DisplayName("Should reject product creation if SKU already exists in catalog")
    void testCreateProductDuplicateSkuRejection() {
        ProductCreateRequest request = new ProductCreateRequest();
        request.setSku("BK-CLRS");
        request.setName("New Book");
        request.setCategoryId(1L);
        request.setPrice(new BigDecimal("999.00"));
        request.setStockQuantity(10);
        request.setBrand("MIT");
        request.setDescription("Desc");

        when(productRepository.existsBySku("BK-CLRS")).thenReturn(true);

        assertThrows(ConflictException.class, () -> productService.createProduct(request));
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should toggle product active status between active and soft-deleted")
    void testToggleProductStatus() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        assertTrue(sampleProduct.isActive());
        ProductDto toggled = productService.toggleProductStatus(10L);
        assertFalse(toggled.isActive());
    }
}
