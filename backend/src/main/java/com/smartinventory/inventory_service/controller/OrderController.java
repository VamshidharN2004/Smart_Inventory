package com.smartinventory.inventory_service.controller;

import com.smartinventory.inventory_service.model.CheckoutItemDto;
import com.smartinventory.inventory_service.model.ShopOrder;
import com.smartinventory.inventory_service.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = { "https://smart-inventory-virid.vercel.app", "http://localhost:3000", "http://localhost:5173" })
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody List<CheckoutItemDto> items, Authentication authentication) {
        System.out.println(
                "ORDERS CHECKOUT CALLED. Auth: " + (authentication != null ? authentication.getName() : "NULL"));
        if (authentication == null)
            return ResponseEntity.status(401).body("Authentication required");

        try {
            ShopOrder order = orderService.createOrder(authentication.getName(), items);
            System.out.println("ORDER CREATED: " + order.getId());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            System.out.println("CHECKOUT ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Checkout failed: " + e.getMessage());
        }
    }

    @PostMapping("/confirm/{orderId}")
    public ResponseEntity<?> confirmOrder(@PathVariable String orderId) {
        System.out.println("CONFIRM ORDER CALLED: " + orderId);
        try {
            ShopOrder order = orderService.confirmOrder(orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            System.out.println("CONFIRM ERROR: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/cancel/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable String orderId) {
        try {
            orderService.cancelOrder(orderId);
            return ResponseEntity.ok(Map.of("message", "Order cancelled"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(Authentication authentication) {
        System.out
                .println("GET MY ORDERS CALLED. Auth: " + (authentication != null ? authentication.getName() : "NULL"));
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Session expired or invalid."));
        }
        try {
            return ResponseEntity.ok(orderService.getOrdersByUser(authentication.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to fetch orders: " + e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable String orderId) {
        System.out.println("GET ORDER DETAILS CALLED FOR: " + orderId);
        try {
            ShopOrder order = orderService.getOrder(orderId);
            if (order == null) {
                System.out.println("ORDER NOT FOUND: " + orderId);
                return ResponseEntity.notFound().build();
            }
            System.out.println("ORDER FOUND. Returning details.");
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            System.out.println("GET ORDER ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Error: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders() {
        try {
            return ResponseEntity.ok(orderService.getAllOrders());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
