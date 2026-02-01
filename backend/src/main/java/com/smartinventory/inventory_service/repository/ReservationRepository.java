package com.smartinventory.inventory_service.repository;

import com.smartinventory.inventory_service.model.Reservation;
import com.smartinventory.inventory_service.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, String> {
        List<Reservation> findByStatusAndExpiresAtBefore(ReservationStatus status, LocalDateTime now);

        void deleteBySku(String sku);
}
