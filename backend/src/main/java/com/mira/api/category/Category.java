package com.mira.api.category;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(unique = true, length = 80)
    private String code;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(length = 1)
    private String gender;

    protected Category() {
    }

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Category(String name, String description, String code, String imageUrl,
                    BigDecimal rating, String gender) {
        this.name = name;
        this.description = description;
        this.code = code;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.gender = gender;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCode() { return code; }
    public String getImageUrl() { return imageUrl; }
    public BigDecimal getRating() { return rating; }
    public String getGender() { return gender; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setCode(String code) { this.code = code; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public void setGender(String gender) { this.gender = gender; }
}
