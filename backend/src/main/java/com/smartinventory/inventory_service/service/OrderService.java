package com.smartinventory.inventory_service.service;

import com.smartinventory.inventory_service.model.*;
import com.smartinventory.inventory_service.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private String generateOrderCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        java.util.Random rnd = new java.util.Random();
        while (code.length() < 8) {
            int index = (int) (rnd.nextFloat() * chars.length());
            code.append(chars.charAt(index));
        }
        return code.toString();
    }

    @Transactional
    public ShopOrder createOrder(String username, List<CheckoutItemDto> items) {
        System.out.println("SERVICE createOrder FOR: " + username + " with items: " + items.size());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ShopOrder order = new ShopOrder();
        order.setId(generateOrderCode());
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());

        // Set to PENDING and set Expiry
        order.setStatus(OrderStatus.PENDING);
        order.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        order.setItems(new ArrayList<>());

        double totalAmount = 0;

        for (CheckoutItemDto item : items) {
            System.out.println("Processing item: " + item.getSku() + " qty: " + item.getQuantity());
            Product product = productRepository.findBySkuWithLock(item.getSku())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getSku()));

            if (product.getTotalQuantity() - product.getReservedQuantity() < item.getQuantity()) {
                System.out.println("INSUFFICIENT STOCK for: " + item.getSku());
                throw new RuntimeException("Insufficient stock for: " + item.getSku());
            }

            // Reserve stock (Do NOT deduct total yet)
            product.setReservedQuantity(product.getReservedQuantity() + item.getQuantity());
            productRepository.save(product);

            // Create Order Item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());

            Double price = product.getPrice() != null ? product.getPrice() : 0.0;
            orderItem.setPrice(price);

            order.getItems().add(orderItem);
            totalAmount += price * item.getQuantity();
        }

        order.setTotalAmount(totalAmount);
        ShopOrder saved = orderRepository.save(order);
        System.out.println("SAVED ORDER: " + saved.getId());
        return saved;
    }

    @Transactional
    public List<ShopOrder> getOrdersByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    @Transactional
    public ShopOrder confirmOrder(String orderId) {
        System.out.println("SERVICE confirmOrder: " + orderId);
        ShopOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Order is not in PENDING state");
        }
        if (order.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Order has expired");
        }

        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findBySkuWithLock(item.getProduct().getSku())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Commit transaction: Release reservation, Deduct total, Increase sold
            product.setReservedQuantity(product.getReservedQuantity() - item.getQuantity());
            product.setTotalQuantity(product.getTotalQuantity() - item.getQuantity());
            product.setSoldQuantity(product.getSoldQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.COMPLETED);
        return orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(String orderId) {
        System.out.println("SERVICE cancelOrder: " + orderId);
        ShopOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.PENDING) {
            for (OrderItem item : order.getItems()) {
                Product product = productRepository.findBySkuWithLock(item.getProduct().getSku())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                // Release reservation
                product.setReservedQuantity(product.getReservedQuantity() - item.getQuantity());
                productRepository.save(product);
            }
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        }
    }

    public ShopOrder getOrder(String orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    public List<ShopOrder> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }
}
