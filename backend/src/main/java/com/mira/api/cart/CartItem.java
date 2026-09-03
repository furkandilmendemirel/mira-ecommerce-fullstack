package com.mira.api.cart;

import com.mira.api.product.Product;
import com.mira.api.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "selected_size", length = 20)
    private String selectedSize;

    @Column(name = "selected_color", length = 20)
    private String selectedColor;

    protected CartItem() {
    }

    public CartItem(User user, Product product, Integer quantity, String selectedSize, String selectedColor) {
        this.user = user;
        this.product = product;
        this.quantity = quantity;
        this.selectedSize = selectedSize;
        this.selectedColor = selectedColor;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Product getProduct() { return product; }
    public Integer getQuantity() { return quantity; }
    public String getSelectedSize() { return selectedSize; }
    public String getSelectedColor() { return selectedColor; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setSelectedSize(String selectedSize) { this.selectedSize = selectedSize; }
    public void setSelectedColor(String selectedColor) { this.selectedColor = selectedColor; }
}
