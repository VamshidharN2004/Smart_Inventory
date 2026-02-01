package com.smartinventory.inventory_service.model;

public class CheckoutItemDto {
    private String sku;
    private int quantity;

    // Constructors
    public CheckoutItemDto() {
    }

    public CheckoutItemDto(String sku, int quantity) {
        this.sku = sku;
        this.quantity = quantity;
    }

    // Getters and Setters

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
