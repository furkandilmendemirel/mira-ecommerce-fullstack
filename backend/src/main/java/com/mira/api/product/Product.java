package com.mira.api.product;

import com.mira.api.category.Category;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "store_id")
    private Integer storeId;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(name = "sell_count")
    private Integer sellCount;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "image_index")
    @Column(name = "image_url", nullable = false, length = 1000)
    private List<String> images = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "size_index")
    @Column(name = "size_value", nullable = false, length = 20)
    private List<String> sizes = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "color_index")
    @Column(name = "color_value", nullable = false, length = 20)
    private List<String> colors = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_color_images", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "color_value", length = 20)
    @Column(name = "image_url", nullable = false, length = 1000)
    private Map<String, String> colorImages = new LinkedHashMap<>();

    protected Product() {
    }

    public Product(String name, String description, BigDecimal price, Integer stock, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.storeId = 1;
        this.rating = new BigDecimal("4.50");
        this.sellCount = 0;
    }

    public Product(String name, String description, BigDecimal price, Integer stock,
                   Integer storeId, BigDecimal rating, Integer sellCount,
                   Category category, List<String> images) {
        this(name, description, price, stock, category);
        this.storeId = storeId;
        this.rating = rating;
        this.sellCount = sellCount;
        this.images.addAll(images);
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public Integer getStock() { return stock; }
    public Category getCategory() { return category; }
    public Integer getStoreId() { return storeId; }
    public BigDecimal getRating() { return rating; }
    public Integer getSellCount() { return sellCount; }
    public List<String> getImages() { return images; }
    public List<String> getSizes() { return sizes; }
    public List<String> getColors() { return colors; }
    public Map<String, String> getColorImages() { return colorImages; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setCategory(Category category) { this.category = category; }
    public void setStoreId(Integer storeId) { this.storeId = storeId; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public void setSellCount(Integer sellCount) { this.sellCount = sellCount; }
    public void setImages(List<String> images) {
        this.images.clear();
        if (images != null) this.images.addAll(images);
    }
    public void setSizes(List<String> sizes) {
        this.sizes.clear();
        if (sizes != null) {
            sizes.stream()
                    .map(String::trim)
                    .filter(value -> !value.isBlank())
                    .distinct()
                    .forEach(this.sizes::add);
        }
    }
    public void setColors(List<String> colors) {
        this.colors.clear();
        if (colors != null) {
            colors.stream()
                    .map(String::trim)
                    .filter(value -> !value.isBlank())
                    .map(String::toLowerCase)
                    .distinct()
                    .forEach(this.colors::add);
        }
    }
    public void setColorImages(Map<String, String> colorImages) {
        this.colorImages.clear();
        if (colorImages != null) {
            colorImages.forEach((color, imageUrl) -> {
                if (color != null && imageUrl != null && !color.isBlank() && !imageUrl.isBlank()) {
                    this.colorImages.put(color.trim().toLowerCase(), imageUrl.trim());
                }
            });
        }
    }
}
