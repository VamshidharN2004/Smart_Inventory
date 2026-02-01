package com.smartinventory.inventory_service.controller;

import com.smartinventory.inventory_service.model.Product;
import com.smartinventory.inventory_service.model.Reservation;
import com.smartinventory.inventory_service.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = { "https://smart-inventory-virid.vercel.app", "http://localhost:3000", "http://localhost:5173" })
@RequestMapping
@CrossOrigin(origins = { "https://smart-inventory-virid.vercel.app", "http://localhost:3000", "http://localhost:5173" })
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/inventory/reserve")
    public ResponseEntity<?> reserveInventory(@RequestBody Map<String, Object> payload) {
        System.out.println("OLD INVENTORY RESERVE CALLED: " + payload);
        try {
            String sku = (String) payload.get("sku");
            int quantity = (Integer) payload.get("quantity");
            Reservation reservation = inventoryService.reserveInventory(sku, quantity);
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/checkout/confirm")
    public ResponseEntity<?> confirmCheckout(@RequestBody Map<String, Object> payload) {
        try {
            String reservationId = (String) payload.get("reservationId");

            Reservation reservation = inventoryService.confirmCheckout(reservationId);
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/checkout/cancel")
    public ResponseEntity<?> cancelCheckout(@RequestBody Map<String, Object> payload) {
        try {
            String reservationId = (String) payload.get("reservationId");

            inventoryService.cancelCheckout(reservationId);
            return ResponseEntity.ok(Map.of("message", "Cancelled"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/inventory/{sku}")
    public ResponseEntity<?> getInventory(@PathVariable String sku) {
        Product product = inventoryService.getProduct(sku);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        int available = product.getTotalQuantity() - product.getReservedQuantity();

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("sku", product.getSku());
        response.put("available", available);
        response.put("total", product.getTotalQuantity());
        response.put("reserved", product.getReservedQuantity());
        response.put("sold", product.getSoldQuantity());
        // New fields
        response.put("imageUrl", product.getImageUrl());
        response.put("price", product.getPrice());
        response.put("unit", product.getUnit());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/inventory/products")
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(inventoryService.getAllProducts());
    }

    @PostMapping("/inventory/product")
    public ResponseEntity<?> createProduct(@RequestBody Map<String, Object> payload) {
        try {
            String sku = (String) payload.get("sku");
            int totalQuantity = (Integer) payload.get("totalQuantity");

            // Handle optional new fields
            String imageUrl = (String) payload.getOrDefault("imageUrl", "");
            Double price = payload.containsKey("price") ? Double.valueOf(payload.get("price").toString()) : 0.0;
            String unit = (String) payload.getOrDefault("unit", "Piece");

            Product product = inventoryService.createProduct(sku, totalQuantity, imageUrl, price, unit);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/inventory/product/{sku}")
    public ResponseEntity<?> deleteProduct(@PathVariable String sku) {
        try {
            inventoryService.deleteProduct(sku);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/inventory/product/{sku}")
    public ResponseEntity<?> updateProduct(@PathVariable String sku, @RequestBody Map<String, Object> payload) {
        try {
            int totalQuantity = (Integer) payload.get("totalQuantity");
            String imageUrl = (String) payload.getOrDefault("imageUrl", "");
            Double price = payload.containsKey("price") ? Double.valueOf(payload.get("price").toString()) : null;
            String unit = (String) payload.getOrDefault("unit", "");

            Product product = inventoryService.updateProduct(sku, totalQuantity, imageUrl, price, unit);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
