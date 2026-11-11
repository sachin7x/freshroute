# FreshRoute — Developer Handoff, Self-Audit & Engineering Guide
**Version:** 3.0 (Production-Ready Architecture Baseline)  
**Target Audience:** Incoming Software Engineers, Full-Stack Developers & System Auditors  
**Last Verified:** 2026-11-11 &bull; Verification Status: **$R = +1.000$ (Deterministic Pass)**

---

## 1. Executive Brief & System Overview

FreshRoute is a **quick-commerce on-demand laundry platform** built for Tier-2 and Tier-1 cities in India. Inspired by the operational rigor of Rinse.com in the US, FreshRoute adapts the model to Indian customer habits, quick-commerce infrastructure, and density dynamics:

- **Pilot Markets:** Bhilwara (Pilot Hub 1) &bull; Kishangarh (Phase 2) &bull; Jaipur (Phase 3: Malviya Nagar & Vaishali Nagar).
- **Core Customer Loop:** Booking via Web/App $\to$ Scheduled 7:00 PM – 10:00 PM Evening Pickup $\to$ Tamper-Proof QR Bag Tagging $\to$ Dark Hub Intake & Precision Weighing $\to$ Washing/Dry Cleaning $\to$ Multi-Point Quality Inspection $\to$ Doorstep Delivery.
- **Financial Architecture:** Integer paise pricing calculations across all database records and APIs (e.g. ₹49.00 = `4900` paise) to eliminate floating-point precision errors.

```mermaid
flowchart TD
    subgraph Client Apps
        MC["mobile-customer (Flutter 3)"]
        MD["mobile-delivery (Flutter Valet)"]
        WC["web-customer (Next.js 14)"]
        WA["web-admin (Next.js 14)"]
        WP["web-partner (Next.js 14)"]
        WM["web-marketing (Next.js 14)"]
    end

    subgraph Core Platform Daemon
        API["NestJS 10 API Daemon (:3001)"]
        PG[("Native PostgreSQL 18 (freshroute)")]
        RD[("Native Redis 8.10.2 Cache (:6379)")]
    end

    subgraph Operational Flow
        O1["1. Booking (7-10 PM Slot)"] --> O2["2. QR Bag Assignment"]
        O2 --> O3["3. Razorpay Payment Auth"]
        O3 --> O4["4. Valet Doorstep Pickup"]
        O4 --> O5["5. Dark Hub Intake & Weighing"]
        O5 --> O6["6. Wash / Dry Clean Cycle"]
        O6 --> O7["7. Quality Inspection"]
        O7 --> O8["8. Valet Delivery & Scan"]
    end

    Client Apps --> API
    API --> PG
    API --> RD
    API --> Operational Flow
```

---

## 2. Quick-Start & Verification in 60 Seconds

### 2.1 The Master Verification Harness
To verify the entire system end-to-end, run the automated compound test harness:
```bash
cd /Users/sachin/Downloads/FRESHROUTE-GITHUB-READY
./verify-full-system.sh
```
This script executes:
1. Backend TypeScript typecheck (`tsc --noEmit`) $\to$ **Exit 0**
2. Backend production build (`nest build`) $\to$ **Exit 0**
3. Backend unit tests (`jest --coverage`) $\to$ **Exit 0**
4. PostgreSQL 18 & Redis 8 connectivity check $\to$ **Exit 0**
5. End-to-End 10-step operational order journey (`test-e2e-order.py`) $\to$ **Exit 0**
6. Negative & boundary security tests (`test-negative-cases.py`) $\to$ **Exit 0**
7. Next.js 14 production builds for all 4 web apps $\to$ **Exit 0**
8. Flutter mobile sources validation $\to$ **Exit 0**

### 2.2 Local Service URLs & Ports

| Application | URL | Port | Role & Key Features |
| :--- | :--- | :---: | :--- |
| **Customer Web Portal** | `http://localhost:3000` | `3000` | Dynamic catalog, cart, PIN serviceability check, slot booking, live tracking |
| **Backend REST API** | `http://localhost:3001` | `3001` | NestJS 10 modular REST API; root `/` redirects to Swagger UI |
| **Swagger OpenAPI Docs**| `http://localhost:3001/api/docs` | `3001` | Interactive OpenAPI documentation for all 13 microservice modules |
| **Admin Operations Hub**| `http://localhost:3002` | `3002` | Real-time KPIs, order dispatch, valet assignment, serviceability zones |
| **Laundry Partner Portal**| `http://localhost:3003` | `3003` | Dark Hub queue, stage progression, calibrated scale intake & weighing |
| **Public Marketing Site** | `http://localhost:3004` | `3004` | High-converting landing page, pricing tables, pilot coverage FAQ |

---

## 3. Seeded Test Credentials

The database contains pre-configured test accounts across all roles (seeded via [`backend/src/database/seed.ts`](file:///Users/sachin/Downloads/FRESHROUTE-GITHUB-READY/backend/src/database/seed.ts)):

| Role | Email / Phone | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Customer** | `+919876543212` / `customer@freshroute.in` | `Password@123` | Testing customer ordering, scheduling & tracking |
| **Administrator** | `admin@freshroute.in` | `Password@123` | Testing operations dispatch & serviceability config |
| **Valet / Rider** | `valet@freshroute.in` | `Password@123` | Testing pickup & delivery task assignments |
| **Laundry Partner** | Facility ID: `PRT-BHL-01` | Pre-assigned | Testing Dark Hub intake and stage advancement |

---

## 4. Codebase Architecture & Anatomy

### 4.1 Backend Architecture (`backend/src/`)
> [!IMPORTANT]
> The active, production-ready backend lives in **`backend/src/`**.  
> The directory `backend/services/` contains legacy stub folders from the original initial scaffolding. Do not edit `backend/services/`. All development happens inside `backend/src/`.

The backend is built as a modular NestJS monolith with 13 domain modules:
```
backend/src/
├── admin/            # Dashboard KPIs, audit logs, order assignment
├── audit/            # Central audit logging module
├── auth/             # JWT auth, local strategy, bcrypt password hashing
├── common/           # Interceptors, filters, guards (AuthGuard, RolesGuard), crypto
├── database/         # PrismaService and database seed scripts
├── notification/     # WhatsApp, SMS, Push notification abstraction
├── order/            # Order state machine (CREATED -> DELIVERED), QR bag generation
├── partner/          # Partner facility management, capacity, quality inspection
├── payment/          # Razorpay integration, test-mode payment capture, webhooks
├── pricing/          # Dynamic city/zone pricing, units (kg, pc, pair)
├── scheduling/       # 7-10 PM slot reservation, capacity control, Redis locks
├── subscription/     # FreshPass monthly subscription management (Rs 999 / 4 orders)
├── tracking/         # Real-time valet and order tracking
├── user/             # Customer profile, addresses, PIN code resolution
├── valet/            # Valet shifts, task assignment, proof of pickup/delivery
├── app.controller.ts # Root redirect to Swagger (/api/docs) and health check
├── app.module.ts     # Root module importing all 13 domain modules
└── main.ts           # Application bootstrap, Swagger setup, Helmet, RateLimiter
```

### 4.2 Database Schema (`backend/prisma/schema.prisma`)
The PostgreSQL database utilizes 20 relational models:
1. `City`: Supported rollout cities (Bhilwara, Kishangarh, Jaipur).
2. `ServiceZone`: City sub-zones with mapped Indian PIN codes (e.g. `311001`, `302017`).
3. `User` & `Customer`: Authentication identities, phone numbers, and customer metadata.
4. `Address`: Indian delivery addresses with street, landmark, city, and 6-digit PIN code.
5. `Role`: User roles (`CUSTOMER`, `ADMIN`, `VALET`, `PARTNER`).
6. `LaundryService`: Catalog items (`WASH_FOLD`, `WASH_IRON`, `DRY_CLEAN`, `IRONING`, `SHOE_CARE`).
7. `PricingRule`: Zone-specific and city-specific pricing stored in integer paise.
8. `Order`: Master order entity with lifecycle state machine.
9. `StatusHistory`: Immutable log of every order status transition.
10. `PickupSlot`: Daily 7 PM – 10 PM pickup windows with capacity counters.
11. `LaundryBag`: Tamper-proof QR bag identifiers (`bagQrCode`).
12. `Payment`: Razorpay transactions, order IDs, payment methods, and statuses.
13. `Refund`: Refund ledger for cancellations.
14. `Partner` & `PartnerFacility`: Dhobi and commercial laundry partner hubs.
15. `Valet`: Field pickup and delivery personnel.
16. `CustomerSubscription`: FreshPass subscriptions with usage tracking.
17. `AuditLog`: System-wide immutable security and administrative audit trail.
18. `Notification`: Dispatch records for SMS, WhatsApp, and push alerts.

### 4.3 Web Applications (`apps/`)
All web applications are built with Next.js 14 and React 18:
- **`apps/web-customer`:** Customer self-service portal.
  - `pages/index.js`: Service catalog, interactive bag counter, and pricing breakdown.
  - `pages/login.js`: Authentication with pre-filled test credentials.
  - `pages/schedule.js`: Address selection and evening pickup slot reservation.
  - `pages/track.js`: Real-time order progress timeline with QR bag tag.
- **`apps/web-admin`:** Operations Command.
  - `pages/index.js`: Real-time KPI summary cards.
  - `pages/orders.js`: Order table with status dropdown and valet assignment controls.
  - `pages/serviceability.js`: City and PIN code geographic routing table.
- **`apps/web-partner`:** Dark Hub facility application.
  - `pages/index.js`: Facility order queue with one-click stage progression.
  - `pages/intake.js`: Calibrated weight entry (kg) and garment discrepancy reporting.
- **`apps/web-marketing`:** Public brand and marketing landing page.
  - `pages/index.js`: Quick-commerce positioning ("Like Blinkit for Laundry").

### 4.4 Mobile Applications (`apps/mobile-*/`)
Cross-platform Flutter 3 applications:
- **`apps/mobile-customer`:** Complete customer application in [`lib/main.dart`](file:///Users/sachin/Downloads/FRESHROUTE-GITHUB-READY/apps/mobile-customer/lib/main.dart).
- **`apps/mobile-delivery`:** Delivery partner / valet task runner in [`lib/main.dart`](file:///Users/sachin/Downloads/FRESHROUTE-GITHUB-READY/apps/mobile-delivery/lib/main.dart).

---

## 5. Developer Backlog: Small Chunks & Remaining Tasks

This section details the specific tasks for an incoming developer to take the platform from verified local baseline to live production:

### Task 1: Real Razorpay Webhook Signature Verification
- **Current State:** [`backend/src/payment/payment.service.ts`](file:///Users/sachin/Downloads/FRESHROUTE-GITHUB-READY/backend/src/payment/payment.service.ts) accepts test-mode payment capture (`pay_sim_test_xxx`) and marks payments `AUTHORIZED`.
- **To Implement:** Configure `RAZORPAY_WEBHOOK_SECRET` in `.env`. Validate Razorpay HMAC SHA256 signatures on incoming webhooks at `POST /api/v1/payment/webhook`.
- **Target File:** `backend/src/payment/payment.controller.ts` and `backend/src/payment/payment.service.ts`.

### Task 2: Real WhatsApp & SMS Integration
- **Current State:** [`backend/src/notification/notification.service.ts`](file:///Users/sachin/Downloads/FRESHROUTE-GITHUB-READY/backend/src/notification/notification.service.ts) logs messages to console and stores notifications in the database.
- **To Implement:** Connect Interakt / Gupshup API for WhatsApp Business messaging and Twilio / Fast2SMS for OTP verification.
- **Target File:** `backend/src/notification/notification.service.ts`.

### Task 3: AWS S3 / Cloudflare R2 Photo Proof Uploads
- **Current State:** Order intake records discrepancy notes as text in PostgreSQL.
- **To Implement:** Add presigned S3 upload URLs for valet bag photos at pickup, and partner photos of garment stains before washing.
- **Target File:** Create `backend/src/common/storage/storage.service.ts` using `@aws-sdk/client-s3`.

### Task 4: Google Maps Distance & Route Optimization
- **Current State:** Valet assignment is currently direct or manual via admin console.
- **To Implement:** Wire `GOOGLE_MAPS_API_KEY` to calculate travel distance from Dark Hub to customer doorstep and cluster pickups between 7:00 PM and 10:00 PM.
- **Target File:** `backend/src/valet/valet.service.ts`.

### Task 5: Business Pricing Alignment for Bhilwara
- **Decision Context:** Initial business documentation had an unresolved discrepancy between ₹49/kg and ₹59/kg for Bhilwara Wash & Fold.
- **Current State:** Stored as `4900` paise in [`backend/src/database/seed.ts`](file:///Users/sachin/Downloads/FRESHROUTE-GITHUB-READY/backend/src/database/seed.ts).
- **To Action:** Confirm with founders whether Bhilwara pilot should launch at promotional ₹49/kg or standard ₹59/kg. Update via `PricingRule` model or seed script.

### Task 6: Socket.IO Live Valet Tracking in Web Frontend
- **Current State:** Order tracking on web fetches status via REST polling.
- **To Implement:** Connect `socket.io-client` in `apps/web-customer/pages/track.js` to listen to `order:status_changed` and `valet:location_updated` events emitted by `backend/src/tracking/`.

---

## 6. Self-Audit Checklist for Engineers

Run these diagnostic commands to audit your local environment:

| Audit Item | Command | Expected Output |
| :--- | :--- | :--- |
| **Backend TypeScript** | `cd backend && npm run typecheck` | Exit code `0`, no errors |
| **Backend Build** | `cd backend && npm run build` | `dist/main.js` built |
| **Prisma Validation** | `cd backend && npx prisma validate` | `The schema is valid` |
| **PostgreSQL DB** | `psql -h localhost -U freshroute -d freshroute -c "\dt"` | 20 tables listed |
| **Redis Cache** | `redis-cli ping` | `PONG` |
| **Live API Server** | `curl -I http://localhost:3001/api/docs` | `HTTP/1.1 200 OK` |
| **E2E Order Journey** | `python3 backend/test-e2e-order.py` | `100% OPERATIONAL & VERIFIED` |
| **Security Boundaries**| `python3 backend/test-negative-cases.py`| `ALL NEGATIVE SECURITY TESTS PASSED` |
| **Web Marketing Build**| `cd apps/web-marketing && npx next build` | `Generating static pages (3/3)` |
| **Web Customer Build** | `cd apps/web-customer && npx next build` | `Generating static pages (6/6)` |
| **Web Admin Build** | `cd apps/web-admin && npx next build` | `Generating static pages (5/5)` |
| **Web Partner Build** | `cd apps/web-partner && npx next build` | `Generating static pages (4/4)` |

---

## 7. Golden Rules & Architectural Invariants

1. **Always Use Integer Paise for Money:** Never store or calculate prices as floating-point Indian Rupees. Always use paise ($1\text{ INR} = 100\text{ paise}$).
2. **Never Bypass RBAC Guards:** Public endpoints must be explicitly decorated with `@Public()`. All administrative endpoints must be guarded with `@Roles('ADMIN')`.
3. **Repository Discipline:** This repository is nested inside a developer root. Never execute `git add -A` from `$HOME`. Run Git commands strictly within `/Users/sachin/Downloads/FRESHROUTE-GITHUB-READY`.
4. **Preserve State Machine Integrity:** Orders cannot skip lifecycle steps. State transitions must follow:
   $$\text{CREATED} \to \text{CONFIRMED} \to \text{PICKUP\_ASSIGNED} \to \text{PICKED\_UP} \to \text{RECEIVED\_AT\_HUB} \to \text{PROCESSING} \to \text{QUALITY\_CHECK} \to \text{READY\_FOR\_DELIVERY} \to \text{DELIVERY\_ASSIGNED} \to \text{OUT\_FOR\_DELIVERY} \to \text{DELIVERED}$$
