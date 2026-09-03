package com.mira.api.product;

import com.mira.api.category.Category;
import com.mira.api.category.CategoryRepository;
import com.mira.api.cart.CartItemRepository;
import com.mira.api.common.ConflictException;
import com.mira.api.common.InvalidRequestException;
import com.mira.api.common.ResourceNotFoundException;
import com.mira.api.order.OrderItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static java.util.Objects.requireNonNullElse;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,
                          CartItemRepository cartItemRepository, OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public ProductPageResponse findAll(Long categoryId, String categoryCode, String filter,
                                       String sortValue, int limit, int offset) {
        if (limit < 1 || limit > 100) throw new InvalidRequestException("limit 1 ile 100 arasında olmalıdır");
        if (offset < 0) throw new InvalidRequestException("offset negatif olamaz");

        Specification<Product> specification = (root, query, builder) -> builder.conjunction();
        if (categoryId != null) {
            specification = specification.and((root, query, builder) ->
                    builder.equal(root.get("category").get("id"), categoryId));
        }
        if (categoryCode != null && !categoryCode.isBlank()) {
            specification = specification.and((root, query, builder) ->
                    builder.equal(builder.lower(root.get("category").get("code")), categoryCode.trim().toLowerCase()));
        }
        String cleanedFilter = filter == null ? "" : filter.trim().toLowerCase();
        if (!cleanedFilter.isBlank()) {
            String pattern = "%" + cleanedFilter + "%";
            specification = specification.and((root, query, builder) -> builder.or(
                    builder.like(builder.lower(root.get("name")), pattern),
                    builder.like(builder.lower(root.get("description")), pattern)
            ));
        }

        Page<Product> page = productRepository.findAll(
                specification,
                PageRequest.of(offset / limit, limit, parseSort(sortValue))
        );
        return new ProductPageResponse(page.getContent().stream().map(ProductResponse::from).toList(), page.getTotalElements());
    }

    public ProductResponse findById(Long id) { return ProductResponse.from(getProduct(id)); }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Category category = getCategory(request.categoryId());
        Product product = new Product(request.name().trim(), request.description(), request.price(), request.stock(), category);
        applyCatalogFields(product, request);
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getProduct(id);
        product.setName(request.name().trim());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setCategory(getCategory(request.categoryId()));
        applyCatalogFields(product, request);
        return ProductResponse.from(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = getProduct(id);
        if (cartItemRepository.existsByProductId(id) || orderItemRepository.existsByProductId(id)) {
            throw new ConflictException("Sepet veya siparişlerde kullanılan ürün silinemez");
        }
        productRepository.delete(product);
    }

    private Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + id));
    }

    private Category getCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + id));
    }

    private void applyCatalogFields(Product product, ProductRequest request) {
        product.setStoreId(requireNonNullElse(request.storeId(), 1));
        product.setRating(requireNonNullElse(request.rating(), new java.math.BigDecimal("4.50")));
        product.setSellCount(requireNonNullElse(request.sellCount(), 0));
        product.setImages(requireNonNullElse(request.images(), java.util.List.of()));
        product.setSizes(requireNonNullElse(request.sizes(), java.util.List.of()));
        if (request.colors() != null) {
            product.setColors(request.colors());
        } else if (product.getColors().isEmpty()) {
            product.setColors(defaultColors(product.getCategory().getCode()));
        }
        if (request.colorImages() != null) {
            product.setColorImages(request.colorImages());
        }
    }

    private java.util.List<String> defaultColors(String categoryCode) {
        return switch (categoryCode) {
            case "men" -> java.util.List.of("#22252a", "#816d5d", "#52604f");
            case "accessories" -> java.util.List.of("#d1b36d", "#151515", "#bbc0c4");
            default -> java.util.List.of("#c9ad8b", "#202124", "#ded6cb");
        };
    }

    private Sort parseSort(String value) {
        if (value == null || value.isBlank()) return Sort.by(Sort.Direction.DESC, "id");
        String[] parts = value.split(":", 2);
        if (parts.length != 2 || !(parts[0].equals("price") || parts[0].equals("rating"))
                || !(parts[1].equals("asc") || parts[1].equals("desc"))) {
            throw new InvalidRequestException("sort price:asc, price:desc, rating:asc veya rating:desc olmalıdır");
        }
        return Sort.by(Sort.Direction.fromString(parts[1]), parts[0]);
    }

}
