package com.smartinventory.inventory_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    private String id;

    private String sku;
    private int quantity;
    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    // No-Args Constructor
    public Reservation() {
    }

    // All-Args Constructor
    public Reservation(String id, String sku, int quantity, LocalDateTime reservedAt, LocalDateTime expiresAt,
            ReservationStatus status) {
        this.id = id;
        this.sku = sku;
        this.quantity = quantity;
        this.reservedAt = reservedAt;
        this.expiresAt = expiresAt;
        this.status = status;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public LocalDateTime getReservedAt() {
        return reservedAt;
    }

    public void setReservedAt(LocalDateTime reservedAt) {
        this.reservedAt = reservedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
}
