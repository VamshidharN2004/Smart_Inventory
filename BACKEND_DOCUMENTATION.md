# Backend Documentation: Smart Inventory Management System

This document provides a comprehensive overview of the backend architecture, implementation details, and design decisions for your Smart Inventory System project. This is designed to help you demonstrate your understanding during technical interviews.

---

## 1. Project Overview
A robust, high-performance inventory management system designed to handle real-time reservations, prevent overselling, and manage stock visibility across multiple lifecycle stages (Available, Reserved, Sold).

-   **Framework**: Spring Boot 3 (Java 17/21)
-   **Database**: MySQL 8.0
-   **ORM**: JPA / Hibernate
-   **Build Tool**: Maven

---

## 2. Architecture: Layered Implementation

The application follows a standard **Controller-Service-Repository** pattern.

### 2.1. Controller Layer (`InventoryController`)
**Responsibility**: Entry point for all HTTP requests. It handles input validation and response formatting but delegates all business logic to the Service.

-   **Endpoints**:
    -   `GET /inventory/{sku}`: Fetches current stock details (Total, Available, Reserved, Sold).
    -   `POST /inventory/reserve`: Accepts `{sku, quantity}`, validates, and initiates the reservation process.
    -   `POST /checkout/confirm`: Converts a temporary reservation into a permanent sale.
    -   `POST /checkout/cancel`: Cancels an active reservation and restores inventory.

### 2.2. Service Layer (`InventoryService`)
**Responsibility**: The core "brain" of the application. It enforces rules like "Available = Total - Reserved".

**Key Features:**
-   **Transactional Consistency**: All methods are marked with `@Transactional` to ensure that either all database changes happen, or none do.
-   **Concurrency Control**: Uses **PESSIMISTIC_WRITE** locking to prevent race conditions (e.g., two users reserving the last item simultaneously).
-   **Business Logic**:
    -   **Reserve**: Checks `(Total - Reserved) >= Requested`. If valid, increases `ReservedQty` and creates a `Reservation` record with `IN_PROCESS` status.
    -   **Confirm**: Decrements BOTH `TotalQty` and `ReservedQty`, increments `SoldQty`, and updates status to `CONFIRMED`.
    -   **Cancel**: Decrements `ReservedQty` (release hold) and updates status to `CANCELLED`. If checking out a confirmed order, it handles refunds by incrementing `TotalQty` and decrementing `SoldQty`.

### 2.3. Repository Layer
**Responsibility**: Direct database interaction using Spring Data JPA.

-   `ProductRepository`: Manages `Product` entity. Contains custom query `findBySkuWithLock` to enforce database row locking.
-   `ReservationRepository`: Manages `Reservation` entity.

---

## 3. Data Models

### 3.1. Product Entity
Represents the inventory state of a specific item.
-   `sku` (Primary Key): Stock Keeping Unit (e.g., "IPHONE15").
-   `totalQuantity`: Physical stock in warehouse.
-   `reservedQuantity`: Stock currently held in active user carts/reservations.
-   `soldQuantity`: *[New Feature]* Total units successfully sold.
-   **Derived Metric**: `Available Quantity = Total - Reserved`.

### 3.2. Reservation Entity
Tracks individual user transactions.
-   `id`: Unique alphanumeric identifier.
-   `sku`: Item reserved.
-   `quantity`: Amount reserved.
-   `expiresAt`: Timestamp when the reservation expires (5 minutes).
-   `status`: Enum (`IN_PROCESS`, `CONFIRMED`, `CANCELLED`, `EXPIRED`).

---

## 4. Advanced Features & "Magic"

### 4.1. The "Ghost" Reservation Cleanup (Scheduler)
To prevent inventory from being stuck forever if a user abandons their cart, we implemented a background scheduler.
-   **Class**: `ReservationExpiryScheduler`
-   **Logic**: Runs every minute → Finds `IN_PROCESS` reservations passed `expiresAt` → Calls logic to restore `ReservedQty` → Sets status to `EXPIRED`.
-   **Importance**: Ensures inventory doesn't leak over time due to abandoned sessions.

### 4.2. Handling Concurrent Traffic
The biggest challenge in inventory systems is "Race Conditions".
-   **Problem**: User A and User B check stock at same millisecond. Both see 1 item left. Both try to buy. Application might sell it twice (Overselling).
-   **Solution**: We used `LockModeType.PESSIMISTIC_WRITE` on the database read. This forces User B to "wait in line" until User A's transaction is completely finished.

## 5. Recent Improvements (Changlog)
-   **Sold Count Tracking**: Added visibility into confirmed sales to clarify where inventory goes after checkout.
-   **Real-time UX**: Stopped countdown timers immediately upon confirmation/cancellation.
-   **Disabled Auto-Seeding**: Removed the `CommandLineRunner` so the database persists state across restarts without resetting default data.
