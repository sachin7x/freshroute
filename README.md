# 🌿 FreshRoute | On-Demand Laundry Commerce Platform 🇮🇳

> **Rinse.com re-imagined for India.** Scheduled evening valet pickups (7 PM – 10 PM), tamper-proof QR-tagged laundry bags, dark hub processing, and guaranteed 24–48 hour doorstep delivery across Rajasthan (Bhilwara, Kishangarh, Jaipur) and pan-India.

[![GitHub Release](https://img.shields.io/github/v/release/sachin7x/freshroute?color=16A34A&label=Release)](https://github.com/sachin7x/freshroute/releases/tag/v1.0.0)
[![UI Gallery](https://img.shields.io/badge/UI%20Screenshots-Download%20ZIP-0D3826)](https://github.com/sachin7x/freshroute/releases/tag/v1.0.0)
[![RLVR Gate](https://img.shields.io/badge/RLVR%20Verification-R%3D%2B1.000%20(Exit%200)-16A34A)](./verify-full-system.sh)

> 📦 **UI Screenshot Gallery:** Download the complete high-resolution UI and workflow screenshots ZIP directly from the [v1.0.0 GitHub Release](https://github.com/sachin7x/freshroute/releases/tag/v1.0.0).

---

## 📑 Table of Contents
1. [Overview & Operating Model](#-overview--operating-model)
2. [Project & Directory Structure](#-project--directory-structure)
3. [Port Allocation & Live Endpoints](#-port-allocation--live-endpoints)
4. [Prerequisites](#-prerequisites)
5. [Step-by-Step Local Setup](#-step-by-step-local-setup)
6. [Demo Accounts & Test Credentials](#-demo-accounts--test-credentials)
7. [Automated Verification Gate](#-automated-verification-gate)
8. [Production Deployment](#-production-deployment)
9. [Detailed Documentation Index](#-detailed-documentation-index)

---

## 🚀 Overview & Operating Model

FreshRoute adapts the successful American laundry subscription model (Rinse.com) to Indian market dynamics using quick-commerce operational efficiency:

- **Doorstep Pickup & Delivery:** Uniformed valets operate scheduled 7 PM – 10 PM pickup windows 7 days a week.
- **Physical QR Bag Tags:** Reusable canvas laundry bags tagged with tamper-proof QR codes (`FR123456`) scanned at pickup, hub intake, wash cycles, and delivery.
- **Hybrid Hub Fulfillment:** Decentralized dark fulfillment hubs (5 km radius) handle high-throughput wash & fold; specialized partner facilities handle delicate dry cleaning and shoe care.
- **Financial Precision:** All money values stored in **integer paise** (`pricePaise: 4900` = ₹49.00) with zero floating-point imprecision.
- **Customer Accessibility:** Native web & mobile apps with integrated WhatsApp-assisted ordering for Tier-2/Tier-3 city adoption.

---

## 📂 Project & Directory Structure

```text
FRESHROUTE-GITHUB-READY/
├── README.md                          # Master developer onboarding guide (this file)
├── verify-full-system.sh              # 8-phase automated verification harness (RLVR R=+1.000)
├── test-e2e-order.py                  # Live end-to-end customer order simulation script
├── test-negative-cases.py             # Security, auth, and boundary test scenarios
├── .env.example                       # Master environment template (5 keys needed)
├── .gitignore                         # Standard root git exclusion rules
│
├── backend/                           # NestJS 10 Enterprise API Server
│   ├── src/
│   │   ├── auth/                      # JWT & OTP authentication, bcrypt hashing
│   │   ├── order/                     # Order state machine & lifecycle management
│   │   ├── partner/                   # Laundry partner dark hub facility endpoints
│   │   ├── valet/                     # Doorstep pickup/delivery valet dispatch routes
│   │   ├── service/                   # Service catalog, pricing, & multi-city tariffs
│   │   ├── subscription/              # FreshPass membership & recurring billing
│   │   ├── database/                  # Prisma ORM client & database seeder
│   │   └── main.ts                    # Server bootstrap, Swagger docs, CORS config
│   ├── prisma/
│   │   └── schema.prisma              # 20 relational models (PostgreSQL 14+)
│   └── package.json                   # Backend dependencies & build scripts
│
├── apps/                              # Multi-App Frontend Monorepo (Next.js 14)
│   ├── web-customer/                  # Customer App (Catalog, Basket, Schedule, Tracking)
│   │   └── pages/                     # index.js, schedule.js, track.js, login.js
│   ├── web-admin/                     # Ops Command Center (Dispatch, Inventory, Hubs, Reports)
│   │   └── pages/                     # index.js (9 functional tabs), orders.js, serviceability.js
│   ├── web-partner/                   # Laundry Partner Portal (Intake Scale, Wash Stages, Payouts)
│   │   └── pages/                     # index.js (Live queue, Wash stations), intake.js
│   ├── web-marketing/                 # Public Landing Page (Brand, Tier comparison, FAQ)
│   │   └── pages/                     # index.js
│   ├── mobile-customer/               # Flutter Customer App (iOS & Android)
│   └── mobile-delivery/               # Flutter Valet Route & QR Scanner App
│
├── docs/                              # Comprehensive Architectural & Audit Documentation
│   ├── DEVELOPER_HANDOFF_AND_AUDIT_GUIDE.md  # Exhaustive developer handoff & backlog
│   ├── FRESHROUTE_PROJECT_SUMMARY.md         # Full product execution summary
│   ├── ARCHITECTURE.md                       # Full-stack architectural specifications
│   ├── QUICK-COMMERCE-PLAYBOOK.md            # Dark hub & valet dispatch operations
│   └── INDEX.md                              # Document registry
│
├── infra/                             # Infrastructure Configurations
│   └── docker/                        # docker-compose.yml for PostgreSQL 18 & Redis 8
└── ui-kit/                            # High-fidelity reference layouts & design tokens
```

---

## 🌐 Port Allocation & Live Endpoints

When running locally, FreshRoute binds each service to dedicated, non-overlapping ports:

| Service / Application | Local Port & URL | Primary Function |
| :--- | :--- | :--- |
| **Customer Web App** | [http://localhost:3000](http://localhost:3000) | Catalog browsing, basket, slot booking (7–10 PM), live order tracking |
| **Backend API & Swagger** | [http://localhost:3001](http://localhost:3001) | NestJS 10 REST API; root automatically redirects to Swagger `/api/docs` |
| **Admin Command Center** | [http://localhost:3002](http://localhost:3002) | Orders dispatch, valet assignment, inventory restock, financial reports |
| **Laundry Partner Portal** | [http://localhost:3003](http://localhost:3003) | Live dark hub queue, calibrated scale intake, wash cycle monitors |
| **Marketing Website** | [http://localhost:3004](http://localhost:3004) | Public landing page, pricing comparison, coverage checker, FAQ |

---

## 🛠️ Prerequisites

Before running the platform, ensure your local development machine has:

- **Node.js**: `v18.x` or `v20.x` (LTS recommended)
- **npm**: `v9.x` or higher
- **PostgreSQL**: `v14` or higher (Homebrew or Docker) running on port `5432`
- **Redis**: `v7.x` or `v8.x` running on port `6379`
- **Python**: `v3.9+` (used for running automated end-to-end test harnesses)

---

## 📦 Step-by-Step Local Setup

Follow these steps to set up and run FreshRoute from scratch:

### 1. Clone & Enter the Repository
```bash
git clone https://github.com/sachin7x/freshroute.git
cd freshroute
```

### 2. Configure Environment Variables
Copy the master environment template:
```bash
cp .env.example .env
cp .env.example backend/.env
```

### 3. Start Database & Cache
You can run PostgreSQL & Redis via Docker:
```bash
docker compose -f infra/docker/docker-compose.yml up -d
```
*Or verify native local services:*
```bash
# Verify Redis (returns PONG)
redis-cli ping

# Verify PostgreSQL connection
psql -h localhost -U freshroute -d freshroute -c "SELECT 1;"
```

### 4. Setup Backend & Seed Database
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run build
cd ..
```

### 5. Install Frontend Dependencies
```bash
cd apps/web-customer && npm install && cd ../..
cd apps/web-admin && npm install && cd ../..
cd apps/web-partner && npm install && cd ../..
cd apps/web-marketing && npm install && cd ../..
```

### 6. Build All Frontend Applications
```bash
cd apps/web-marketing && NODE_ENV=production npx next build && cd ../..
cd apps/web-customer && NODE_ENV=production npx next build && cd ../..
cd apps/web-admin && NODE_ENV=production npx next build && cd ../..
cd apps/web-partner && NODE_ENV=production npx next build && cd ../..
```

### 7. Run the Entire System
In separate terminal tabs (or as background daemons):
```bash
# Terminal 1: Backend API (:3001)
cd backend && node dist/main.js

# Terminal 2: Customer App (:3000)
cd apps/web-customer && npx next start -p 3000

# Terminal 3: Admin Command Center (:3002)
cd apps/web-admin && npx next start -p 3002

# Terminal 4: Partner Portal (:3003)
cd apps/web-partner && npx next start -p 3003

# Terminal 5: Marketing Website (:3004)
cd apps/web-marketing && npx next start -p 3004
```

---

## 🔑 Demo Accounts & Test Credentials

The database seeder (`npm run seed`) populates verified accounts for testing:

| Role | Username / Phone | Password | Portal URL |
| :--- | :--- | :--- | :--- |
| **Customer** | `+919876543212` | `Password@123` | [http://localhost:3000/login](http://localhost:3000/login) *(or click ⚡ One-Click Demo)* |
| **Ops Admin** | `admin@freshroute.in` | `Admin@12345` | [http://localhost:3002](http://localhost:3002) |
| **Hub Partner** | `partner.bhilwara@freshroute.in` | `Partner@123` | [http://localhost:3003](http://localhost:3003) |
| **Delivery Valet** | `valet.ramesh@freshroute.in` | `Valet@12345` | Available via mobile apps or Admin dispatch |

---

## 🧪 Automated Verification Gate

To verify the health and integrity of all modules, tests, builds, and negative security boundaries in a single command, execute:

```bash
./verify-full-system.sh
```

**The script executes 8 automated checks:**
1. Backend TypeScript Typecheck (`tsc --noEmit`)
2. Backend Production Build (`nest build`)
3. Unit Test Suite Execution (`jest --coverage`)
4. PostgreSQL 18 & Redis 8 Infrastructure Connectivity
5. Live E2E Operational Order Creation & Status Transitions (`test-e2e-order.py`)
6. Negative & Boundary Scenarios (Unauthorized access, duplicate phone, invalid status) (`test-negative-cases.py`)
7. All 4 Next.js 14 Frontend Production Builds
8. Flutter Mobile Application Source Tree Validation

---

## 🚢 Production Deployment

### 5 Required Production Keys
To deploy to production (AWS S3 + Vercel + Railway/Render), configure these 5 environment variables:
1. `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Razorpay Indian payments gateway
2. `GOOGLE_MAPS_API_KEY`: Geocoding & address distance calculation
3. `WHATSAPP_API_KEY`: Interakt / Gupshup WhatsApp Business API
4. `FCM_SERVER_KEY`: Firebase Cloud Messaging for rider & customer push notifications
5. `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`: S3 bucket in `ap-south-1` (Mumbai) for bag inspection photos

---

## 📚 Detailed Documentation Index

For deep dives into architecture, business economics, and developer backlogs:
- [👉 Developer Handoff & Audit Guide (`docs/DEVELOPER_HANDOFF_AND_AUDIT_GUIDE.md`)](./docs/DEVELOPER_HANDOFF_AND_AUDIT_GUIDE.md)
- [👉 Full Product Architecture (`docs/ARCHITECTURE.md`)](./docs/ARCHITECTURE.md)
- [👉 Quick Commerce Operations Playbook (`docs/QUICK-COMMERCE-PLAYBOOK.md`)](./docs/QUICK-COMMERCE-PLAYBOOK.md)
- [👉 Master Document Registry (`docs/INDEX.md`)](./docs/INDEX.md)

---

© 2026 FreshRoute Technologies Private Limited. All rights reserved.
