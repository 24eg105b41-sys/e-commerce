package com.shopsphere.service;

import com.shopsphere.dto.CategoryDto;
import com.shopsphere.entity.Category;
import com.shopsphere.exception.ConflictException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CategoryRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing product categories with Caffeine cache support.
 */
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Cacheable(value = "categories")
    @Transactional(readOnly = true)
    public List<CategoryDto> getActiveCategories() {
        return categoryRepository.findAllByActiveTrue().stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return CategoryDto.fromEntity(category);
    }

    @CacheEvict(value = "categories", allEntries = true)
    @Transactional
    public CategoryDto createCategory(String name, String description, String imageUrl) {
        String slug = generateSlug(name);
        if (categoryRepository.existsBySlug(slug)) {
            throw new ConflictException("Category with similar name already exists");
        }

        Category category = new Category(name.trim(), slug, description, imageUrl);
        Category saved = categoryRepository.save(category);
        return CategoryDto.fromEntity(saved);
    }

    @CacheEvict(value = "categories", allEntries = true)
    @Transactional
    public CategoryDto updateCategory(Long id, String name, String description, String imageUrl, Boolean active) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (name != null && !name.isBlank()) {
            category.setName(name.trim());
            category.setSlug(generateSlug(name));
        }
        if (description != null) category.setDescription(description);
        if (imageUrl != null) category.setImageUrl(imageUrl);
        if (active != null) category.setActive(active);

        return CategoryDto.fromEntity(categoryRepository.save(category));
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }
}
