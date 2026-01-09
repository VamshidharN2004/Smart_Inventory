# Smart Inventory System - Technical Documentation

## 1. Project Overview
The **Smart Inventory Reservation System** is a real-time, high-concurrency inventory management backend designed to prevent overselling during high-traffic events (like flash sales). It allows users to "hold" items for a limited time (e.g., 5 minutes) before purchasing, ensuring fairness.

## 2. Architecture Layers (Backend)
The application follows the standard **Spring Boot Layered Architecture**:

### A. Controller Layer (The "Receptionist")
**File:** `InventoryController.java`
*   **Role:** Handles incoming HTTP requests from the Frontend (React). It validates input and passes commands to the Service layer.
*   **Key Endpoints:**
    *   `GET /inventory/{sku}`: Checks current stock availability.
    *   `POST /inventory/reserve`: Requests to hold an item.
    *   `POST /checkout/confirm`: Finalizes the purchase.
    *   `POST /inventory/product`: (Admin) Creates new inventory items.
    *   `GET /inventory/product`: (Admin) Seeds initial data.

### B. Service Layer (The "Brain")
**File:** `InventoryService.java`
*   **Role:** Contains all business logic and transaction management. This is where the magic happens.
*   **Key Logic:**
    *   **Reservation:** Generates a unique 8-char ID, sets a 5-minute expiry timer, and saves the reservation record.
    *   **Concurrency Handling:** Uses **Pessimistic Locking** (`findBySkuWithLock`) to ensure that if two people click "Buy" at the exact same millisecond, they are processed one by one, preventing stock from going negative.
    *   **Expiration:** Calculates `LocalDateTime.now().plusMinutes(5)` to strictly enforce time limits.

### C. Repository Layer (The "Storage Manager")
**Files:** `ProductRepository.java`, `ReservationRepository.java`
*   **Role:** Talks directly to the MySQL Database.
*   **Technology:** Spring Data JPA.
*   **Special Feature:**
    *   `@Lock(LockModeType.PESSIMISTIC_WRITE)`: This specific line in `ProductRepository` is what makes the system "Thread-Safe" and capable of handling high traffic without errors.

### D. Model Layer (The "Data Structure")
**Files:** `Product.java`, `Reservation.java`
*   **Product:** Stores `sku` (ID), `totalQuantity`, `reservedQuantity`, `soldQuantity`.
    *   *Logic:* `Available = Total - Reserved`.
*   **Reservation:** Stores `id`, `sku`, `quantity`, `status` (IN_PROCESS, CONFIRMED, CANCELLED), and `expiresAt` timestamp.

### E. Configuration & Background Tasks
*   **`WebConfig.java`**: Enables **CORS** (Cross-Origin Resource Sharing) so your Vercel Frontend can talk to your Railway Backend securely.
*   **`ReservationExpiryScheduler.java`**: A background job that runs **every minute**. It checks for "IN_PROCESS" reservations that have passed their `expiresAt` time and cancels them, releasing the stock back to the pool.

---

## 3. Database Design (MySQL)

### Table: `product`
| Column | Type | Description |
| :--- | :--- | :--- |
| `sku` | VARCHAR (PK) | Unique Product ID (e.g., "IPHONE15") |
| `total_quantity` | INT | Total physical stock in warehouse |
| `reserved_quantity` | INT | Amount currently held in user carts |
| `sold_quantity` | INT | Amount successfully purchased |

### Table: `reservation`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR (PK) | Unique Reservation Token |
| `sku` | VARCHAR | Which product is being held |
| `status` | ENUM | `IN_PROCESS`, `CONFIRMED`, `CANCELLED`, `EXPIRED` |
| `expires_at` | DATETIME | When the reservation dies |

---

## 4. Key Workflows

### 1. The Reservation Flow
1.  User clicks "Check Available" -> Backend calculates `Total - Reserved`.
2.  User clicks "Reserve" -> Backend **Locks** the Product row.
3.  Backend checks if there is enough stock (`Available >= Requested`).
4.  If yes: `ReservedQuantity` increases.
5.  A new `Reservation` record is created with a timestamp 5 minutes in the future.

### 2. The Confirmation Flow
1.  User clicks "Confirm Checkout".
2.  Backend finds the Reservation.
3.  Checks: Is it expired? Is it already used?
4.  If Valid:
    *   `ReservedQuantity` decreases (release the hold).
    *   `TotalQuantity` decreases (stock leaves warehouse).
    *   `SoldQuantity` increases (money made).

### 3. The Expiry Flow (Automatic)
1.  User walks away from computer.
2.  Scheduler runs (e.g., at 10:05 PM).
3.  Finds Reservation expiring at 10:04 PM.
4.  Sets status to `EXPIRED`.
5.  Decreases `ReservedQuantity` (Stock becomes available for next customer).

---

## 5. Deployment Architecture
*   **Frontend**: Hosted on **Vercel** (Global CDN for fast UI loading).
*   **Backend**: Hosted on **Railway** (Dockerized Spring Boot container).
*   **Database**: Managed **MySQL** on Railway (Private network connection with Backend).
