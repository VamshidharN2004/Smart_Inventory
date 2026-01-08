package com.smartinventory.inventory_service.service;

import com.smartinventory.inventory_service.model.Product;
import com.smartinventory.inventory_service.model.Reservation;
import com.smartinventory.inventory_service.model.ReservationStatus;
import com.smartinventory.inventory_service.repository.ProductRepository;
import com.smartinventory.inventory_service.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class InventoryService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Transactional
    public Reservation reserveInventory(String sku, int quantity) {
        // Lock product row to prevent concurrent overselling
        Product product = productRepository.findBySkuWithLock(sku)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int available = product.getTotalQuantity() - product.getReservedQuantity();
        if (available < quantity) {
            throw new RuntimeException("Insufficient inventory");
        }

        // Reserve inventory
        product.setReservedQuantity(product.getReservedQuantity() + quantity);
        productRepository.save(product);

        // Create reservation with unique 8-char alphanumeric ID
        Reservation reservation = new Reservation();
        reservation.setId(java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase());
        reservation.setSku(sku);
        reservation.setQuantity(quantity);
        reservation.setReservedAt(LocalDateTime.now());
        reservation.setExpiresAt(LocalDateTime.now().plusMinutes(5)); // 5 min expiry
        reservation.setStatus(ReservationStatus.IN_PROCESS);

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation confirmCheckout(String reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.IN_PROCESS) {
            throw new RuntimeException("Reservation is not in IN_PROCESS state");
        }

        if (LocalDateTime.now().isAfter(reservation.getExpiresAt())) {
            // Already expired logic might be handled by scheduler, but check here too
            cancelCheckout(reservationId); // Or just fail
            throw new RuntimeException("Reservation expired");
        }

        // Confirm: Deduct from total and reserved, increment sold
        Product product = productRepository.findBySkuWithLock(reservation.getSku())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setTotalQuantity(product.getTotalQuantity() - reservation.getQuantity());
        product.setReservedQuantity(product.getReservedQuantity() - reservation.getQuantity());
        product.setSoldQuantity(product.getSoldQuantity() + reservation.getQuantity());
        productRepository.save(product);

        reservation.setStatus(ReservationStatus.CONFIRMED);
        return reservationRepository.save(reservation);
    }

    @Transactional
    public void cancelCheckout(String reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() == ReservationStatus.CANCELLED
                || reservation.getStatus() == ReservationStatus.EXPIRED) {
            return;
        }

        Product product = productRepository.findBySkuWithLock(reservation.getSku())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            // If already confirmed, restoring means adding back to total quantity.
            // also decrement sold quantity since it's returned
            product.setTotalQuantity(product.getTotalQuantity() + reservation.getQuantity());
            product.setSoldQuantity(product.getSoldQuantity() - reservation.getQuantity());
            productRepository.save(product);
        } else {
            // If just reserved (now IN_PROCESS) (not confirmed), release the hold.
            product.setReservedQuantity(product.getReservedQuantity() - reservation.getQuantity());
            productRepository.save(product);
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    @Transactional
    public void restoreAvailableQuantity(String sku, int quantity) {
        Product product = productRepository.findBySkuWithLock(sku)
                .orElseThrow(() -> new RuntimeException("Product not found: " + sku));

        product.setReservedQuantity(product.getReservedQuantity() - quantity);
        productRepository.save(product);
    }

    public Product getProduct(String sku) {
        return productRepository.findById(sku).orElse(null);
    }

    // Seed data helper
    @Transactional
    public Product createProduct(String sku, int quantity) {
        Product p = new Product(sku, quantity, 0, 0);
        return productRepository.save(p);
    }

}
