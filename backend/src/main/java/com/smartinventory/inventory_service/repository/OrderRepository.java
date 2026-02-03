package com.smartinventory.inventory_service.repository;

import com.smartinventory.inventory_service.model.ShopOrder;
import com.smartinventory.inventory_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<ShopOrder, String> {

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "items", "items.product" })
    List<ShopOrder> findByUserOrderByOrderDateDesc(User user);

    List<ShopOrder> findByStatusAndExpiresAtBefore(com.smartinventory.inventory_service.model.OrderStatus status,
            java.time.LocalDateTime now);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "items", "items.product" })
    List<ShopOrder> findAllByOrderByOrderDateDesc();
}
