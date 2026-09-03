package com.mira.api.category;

import com.mira.api.common.ConflictException;
import com.mira.api.common.ResourceNotFoundException;
import com.mira.api.product.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static java.util.Objects.requireNonNullElse;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream().map(CategoryService::toResponse).toList();
    }

    public CategoryResponse findById(Long id) {
        return toResponse(getCategory(id));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        String name = request.name().trim();
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new ConflictException("Bu kategori adı zaten kullanılıyor: " + name);
        }
        Category category = new Category(name, request.description());
        applyCatalogFields(category, request);
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = getCategory(id);
        String name = request.name().trim();
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new ConflictException("Bu kategori adı zaten kullanılıyor: " + name);
        }
        category.setName(name);
        category.setDescription(request.description());
        applyCatalogFields(category, request);
        return toResponse(category);
    }

    @Transactional
    public void delete(Long id) {
        Category category = getCategory(id);
        if (productRepository.existsByCategoryId(id)) {
            throw new ConflictException("Ürün içeren bir kategori silinemez");
        }
        categoryRepository.delete(category);
    }

    private Category getCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + id));
    }

    private void applyCatalogFields(Category category, CategoryRequest request) {
        category.setCode(request.code());
        category.setImageUrl(request.img());
        category.setRating(request.rating());
        category.setGender(request.gender());
    }

    public static CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                requireNonNullElse(category.getCode(), "mira-" + category.getId()),
                category.getName(),
                requireNonNullElse(category.getImageUrl(), "https://placehold.co/900x1200?text=MIRA"),
                requireNonNullElse(category.getRating(), new java.math.BigDecimal("4.00")),
                requireNonNullElse(category.getGender(), "k")
        );
    }
}
