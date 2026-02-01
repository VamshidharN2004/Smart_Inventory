package com.smartinventory.inventory_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @lombok.ToString.Exclude
    private ShopOrder order;

    @ManyToOne
    @JoinColumn(name = "sku", nullable = false)
    private Product product;

    private Integer quantity;
    private Double price;
}
