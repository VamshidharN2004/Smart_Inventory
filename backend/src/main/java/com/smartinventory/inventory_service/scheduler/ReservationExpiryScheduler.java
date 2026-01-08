package com.smartinventory.inventory_service.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.smartinventory.inventory_service.model.Reservation;
import com.smartinventory.inventory_service.model.ReservationStatus;
import com.smartinventory.inventory_service.repository.ReservationRepository;
import com.smartinventory.inventory_service.service.InventoryService;

@Component
public class ReservationExpiryScheduler {

    private final ReservationRepository reservationRepository;
    private final InventoryService inventoryService;

    public ReservationExpiryScheduler(
            ReservationRepository reservationRepository,
            InventoryService inventoryService) {
        this.reservationRepository = reservationRepository;
        this.inventoryService = inventoryService;
    }

    @Scheduled(fixedRate = 60000) // every 1 min
    @Transactional
    public void expireReservations() {

        List<Reservation> expired = reservationRepository.findByStatusAndExpiresAtBefore(
                ReservationStatus.IN_PROCESS,
                LocalDateTime.now());

        for (Reservation r : expired) {
            inventoryService.restoreAvailableQuantity(
                    r.getSku(),
                    r.getQuantity());
            r.setStatus(ReservationStatus.EXPIRED);
            reservationRepository.save(r);
        }
    }
}
