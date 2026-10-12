package com.shopsphere.controller;

import com.shopsphere.dto.*;
import com.shopsphere.service.AdminService;
import com.shopsphere.service.CategoryService;
import com.shopsphere.service.OrderService;
import com.shopsphere.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administrator Operations", description = "Endpoints restricted to campus system administrators")
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;

    public AdminController(AdminService adminService,
                           ProductService productService,
                           CategoryService categoryService,
                           OrderService orderService) {
        this.adminService = adminService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.orderService = orderService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get aggregated analytics, revenue, and charts for admin dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    // Product Management
    @PostMapping("/products")
    @Operation(summary = "Create a new product in the catalog")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", productService.createProduct(request)));
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update an existing product")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully",
                productService.updateProduct(id, request)));
    }

    @PatchMapping("/products/{id}/status")
    @Operation(summary = "Toggle active/inactive status of a product (soft delete/reactivate)")
    public ResponseEntity<ApiResponse<ProductDto>> toggleProductStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Product status toggled",
                productService.toggleProductStatus(id)));
    }

    // Category Management
    @GetMapping("/categories")
    @Operation(summary = "Get all categories (including inactive)")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllCategories()));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create a new category")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@RequestBody CategoryDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully",
                        categoryService.createCategory(request.getName(), request.getDescription(), request.getImageUrl())));
    }

    // Order Management
    @GetMapping("/orders")
    @Operation(summary = "Get all customer orders with pagination")
    public ResponseEntity<ApiResponse<Page<OrderDto>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders(pageable)));
    }

    @PatchMapping("/orders/{id}/status")
    @Operation(summary = "Update order status following lifecycle rules")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Order status updated",
                orderService.updateOrderStatus(id, request.getStatus())));
    }
}
