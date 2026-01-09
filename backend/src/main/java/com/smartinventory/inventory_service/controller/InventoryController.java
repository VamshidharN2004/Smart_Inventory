package com.smartinventory.inventory_service.controller;

import com.smartinventory.inventory_service.model.Product;
import com.smartinventory.inventory_service.model.Reservation;
import com.smartinventory.inventory_service.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping
@CrossOrigin(origins = { "https://smart-inventory-virid.vercel.app", "http://localhost:3000" })
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/inventory/reserve")
    public ResponseEntity<?> reserveInventory(@RequestBody Map<String, Object> payload) {
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
        return ResponseEntity.ok(Map.of(
                "sku", product.getSku(),
                "available", available,
                "total", product.getTotalQuantity(),
                "reserved", product.getReservedQuantity(),
                "sold", product.getSoldQuantity()));
    }

    @PostMapping("/inventory/product")
    public ResponseEntity<?> createProduct(@RequestBody Map<String, Object> payload) {
        try {
            String sku = (String) payload.get("sku");
            int totalQuantity = (Integer) payload.get("totalQuantity");
            Product product = inventoryService.createProduct(sku, totalQuantity);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
