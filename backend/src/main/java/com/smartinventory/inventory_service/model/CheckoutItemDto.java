package com.smartinventory.inventory_service.model;

import lombok.Data;

@Data
public class CheckoutItemDto {
    private String sku;
    private int quantity;
}
