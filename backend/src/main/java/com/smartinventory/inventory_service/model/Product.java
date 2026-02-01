package com.smartinventory.inventory_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
    @Id
    private String sku;

    private int totalQuantity;
    private int reservedQuantity;
    private int soldQuantity;

    private String imageUrl;
    private Double price;
    private String unit; // Kilogram, Liter, Piece, etc.

    // No-Args Constructor
    public Product() {
    }

    // All-Args Constructor
    public Product(String sku, int totalQuantity, int reservedQuantity, int soldQuantity, String imageUrl, Double price,
            String unit) {
        this.sku = sku;
        this.totalQuantity = totalQuantity;
        this.reservedQuantity = reservedQuantity;
        this.soldQuantity = soldQuantity;
        this.imageUrl = imageUrl;
        this.price = price;
        this.unit = unit;
    }

    // Getters and Setters

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(int totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public int getReservedQuantity() {
        return reservedQuantity;
    }

    public void setReservedQuantity(int reservedQuantity) {
        this.reservedQuantity = reservedQuantity;
    }

    public int getSoldQuantity() {
        return soldQuantity;
    }

    public void setSoldQuantity(int soldQuantity) {
        this.soldQuantity = soldQuantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
