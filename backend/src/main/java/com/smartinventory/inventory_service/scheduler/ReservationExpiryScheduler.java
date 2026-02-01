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
    private final com.smartinventory.inventory_service.repository.OrderRepository orderRepository;
    private final com.smartinventory.inventory_service.repository.ProductRepository productRepository; // Needed for
                                                                                                       // direct updates

    public ReservationExpiryScheduler(
            ReservationRepository reservationRepository,
            InventoryService inventoryService,
            com.smartinventory.inventory_service.repository.OrderRepository orderRepository,
            com.smartinventory.inventory_service.repository.ProductRepository productRepository) {
        this.reservationRepository = reservationRepository;
        this.inventoryService = inventoryService;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Scheduled(fixedRate = 60000) // every 1 min
    @Transactional
    public void expireReservations() {

        // 1. Expire standalone Reservations
        List<Reservation> expiredReservations = reservationRepository.findByStatusAndExpiresAtBefore(
                ReservationStatus.IN_PROCESS,
                LocalDateTime.now());

        for (Reservation r : expiredReservations) {
            inventoryService.restoreAvailableQuantity(
                    r.getSku(),
                    r.getQuantity());
            r.setStatus(ReservationStatus.EXPIRED);
            reservationRepository.save(r);
        }

        // 2. Expire PENDING ShopOrders
        List<com.smartinventory.inventory_service.model.ShopOrder> expiredOrders = orderRepository
                .findByStatusAndExpiresAtBefore(
                        com.smartinventory.inventory_service.model.OrderStatus.PENDING,
                        LocalDateTime.now());

        for (com.smartinventory.inventory_service.model.ShopOrder order : expiredOrders) {
            System.out.println("Expiring Order: " + order.getId());
            for (com.smartinventory.inventory_service.model.OrderItem item : order.getItems()) {
                // Restore stock
                inventoryService.restoreAvailableQuantity(
                        item.getProduct().getSku(),
                        item.getQuantity());
            }
            order.setStatus(com.smartinventory.inventory_service.model.OrderStatus.EXPIRED);
            orderRepository.save(order);
        }
    }
}
