package com.mira.api.order;

public enum OrderStatus {
    PREPARING("Hazırlanıyor"),
    SHIPPED("Kargoya verildi"),
    DELIVERED("Teslim edildi"),
    CANCELLED("İptal edildi");

    private final String label;

    OrderStatus(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
