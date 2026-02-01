# 🛒 Smart Inventory Reservation System

> A high-concurrency, real-time inventory management system designed to handle flash sales and prevent overselling.

![Status](https://img.shields.io/badge/Status-Live-success)
![Frontend](https://img.shields.io/badge/Frontend-React_Vite-blue)
![Backend](https://img.shields.io/badge/Backend-Spring_Boot-green)
![Database](https://img.shields.io/badge/Database-MySQL-orange)

## 🚀 Live Demo
- **Frontend (Vercel):** [https://smart-inventory-virid.vercel.app](https://smart-inventory-virid.vercel.app)
- **Backend API (Railway):** [https://smartinventory-production-4f19.up.railway.app/inventory/IPHONE15](https://smartinventory-production-4f19.up.railway.app/inventory/IPHONE15)

---

## 🎯 Key Features
*   **Prevent Overselling:** Uses **Pessimistic Locking** (`SELECT ... FOR UPDATE`) to strictly serialize stock deductions.
*   **Time-Limited Reservations:** Users can hold items for 5 minutes. If checkout isn't verified, stock is automatically released.
*   **Real-Time Feedback:** Instant API responses for stock availability.
*   **Cloud Native:** Fully Dockerized and deployed on Railway (Backend/DB) and Vercel (Frontend).
*   **Full Stack Integration:** Secure CORS configuration allowing split-host deployment.

## 🛠️ Tech Stack
*   **Backend:** Java 17, Spring Boot 3, Spring Data JPA
*   **Database:** MySQL 8.0 (Managed on Railway)
*   **Frontend:** React 18, Vite, CSS Modules
*   **DevOps:** Docker, Railway, Vercel

## 📖 Documentation
For a deep dive into the architecture (Controller/Service layer logic, Database Schema, and Workflows), please read the [Technical Documentation](./PROJECT_DOCUMENTATION.md).

## ⚡ Quick Start (Local)

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔗 APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/inventory/{sku}` | Check stock availability |
| `POST` | `/inventory/reserve` | Hold an item (returns Reservation ID) |
| `POST` | `/checkout/confirm` | Finalize purchase |
| `POST` | `/checkout/cancel` | Cancel reservation manually |

---
*Built with ❤️ by [N.Vamshidhar]*
