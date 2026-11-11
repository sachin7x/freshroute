
# FreshRoute Architecture - Rinse.com for India

## Rinse.com Original (US)
- Schedule via Text/App
- Valet Pickup 8pm-10pm 7 days (W-2 salaried, not gig)
- Partner Cleaning / Central Hub
- 3-4 day turnaround

## FreshRoute India Adaptation
- Schedule via App + WhatsApp (70% Tier 2 uses WhatsApp)
- Pickup 7pm-10pm 7 days (2 hours earlier than US - India dinner time)
- Dark Laundry Hub + Partner Dhobis 70/30 revenue share
- 24-48hr delivery (faster than Rinse)
- QR Bag Tag FR123456 - PICK/CLEAN/DELIVER icons

## 10 Microservices
1. Auth Service - OTP, JWT
2. Order Lifecycle - FR123456 state machine
3. Scheduling - 60-min slot booking, Redis lock
4. Valet Dispatch - Assign nearest valet, Google Maps
5. Pricing - Per KG India (Rs59-89) vs per lb US
6. Payments - Razorpay split payout
7. Notifications - FCM + WhatsApp + SMS
8. Tracking - Socket.io live valet tracking
9. Partner Management - Payouts, Quality Check
10. Admin - Dashboard 1248/842/156/34

## Quick Commerce
Dark Hub = Small godown 2 washers covers 5km like Blinkit dark store
60-min pickup slot booking via Redis
Real-time tracking like Blinkit rider map
Photo proof before/after via S3
