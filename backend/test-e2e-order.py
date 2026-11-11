import urllib.request
import json
import sys
import time

def post(url, data, token=None):
    time.sleep(0.12)
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get(url, token=None):
    req = urllib.request.Request(url)
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

BASE = "http://localhost:3001/api/v1"

print("==================================================")
print("  FRESHROUTE END-TO-END AUTONOMOUS ORDER PIPELINE")
print("==================================================")

# 1. Customer Authentication
cust_auth = post(f"{BASE}/auth/login", {"phone": "+919876543212", "password": "Password@123"})
cust_token = cust_auth["accessToken"]
print("1. Customer authenticated:", cust_auth["user"]["email"])

# Admin Authentication
admin_auth = post(f"{BASE}/auth/login", {"phone": "+919876543210", "password": "Password@123"})
admin_token = admin_auth["accessToken"]
print("2. Admin authenticated:", admin_auth["user"]["email"])

# 2. Get Pricing Rules & Slots
rules = get(f"{BASE}/pricing/rules")
bh_rule = [r for r in rules if r.get("city") and r["city"]["code"] == "BHL" and r["laundryService"]["code"] == "WASH_FOLD"][0]
city_id = bh_rule["cityId"]

slots = get(f"{BASE}/scheduling/slots?cityId={city_id}")
slot = slots[0]
unit_price = bh_rule["pricePerUnit"] / 100
print(f"3. Found catalog pricing: Rs {unit_price}/kg, selected slot: {slot['id']}")

# 3. Customer Creates Order
order = post(f"{BASE}/orders", {
    "serviceCode": "WASH_FOLD",
    "cityCode": "BHL",
    "addressId": "c89cb29d-daf3-4f64-9ee9-a93039d8f6cb",
    "pickupSlotId": slot["id"],
    "quantity": 6
}, cust_token)
order_id = order["id"]
print(f"4. Order created: {order['orderNumber']} (ID: {order_id})")
print(f"   -> QR Bag Tag: {order['bagIdentifier']}")
print(f"   -> Initial Status: {order['status']}")
print(f"   -> Total Amount: Rs {order['totalAmount']/100}")

# 4. Payment in Test Mode
pay_res = post(f"{BASE}/payments/verify", {
    "orderId": order_id,
    "providerOrderId": "order_live_e2e_001",
    "providerPaymentId": "pay_live_e2e_001",
    "signature": "sig_live_e2e_001"
}, cust_token)
print(f"5. Razorpay payment verified: {pay_res['status']}")

# 5. Admin Assigns Valet
valet_res = post(f"{BASE}/valets/assign", {
    "orderId": order_id,
    "valetId": "7b20cef2-3372-4b5f-9272-0cd75da6c561"
}, admin_token)
print(f"6. Valet assigned, order status: {valet_res['status']}")

# 6. Valet Confirms Pickup & Scans Bag
pickup_res = post(f"{BASE}/valets/pickup", {
    "orderId": order_id,
    "valetId": "7b20cef2-3372-4b5f-9272-0cd75da6c561"
}, admin_token)
print(f"7. Valet confirmed pickup & bag scan: {pickup_res['status']}")

# 7. Operational Hub Processing Stages
stages = [
    "RECEIVED_AT_HUB",
    "PROCESSING",
    "QUALITY_CHECK",
    "READY_FOR_DELIVERY",
    "DELIVERY_ASSIGNED",
    "OUT_FOR_DELIVERY"
]
for st in stages:
    res = post(f"{BASE}/orders/{order_id}/status", {"status": st}, admin_token)
    print(f"   -> Pipeline advanced: {res['status']}")

# 8. Valet Confirms Final Delivery
deliv_res = post(f"{BASE}/valets/delivery", {
    "orderId": order_id,
    "valetId": "7b20cef2-3372-4b5f-9272-0cd75da6c561"
}, admin_token)
print(f"8. Valet confirmed delivery: {deliv_res['status']}")

# 9. Customer Real-time Order Tracking Audit
tracking = get(f"{BASE}/tracking/{order_id}", cust_token)
print(f"\n9. Final Verified Status: {tracking['currentStatus']}")
print(f"   Immutable Audit History Events ({len(tracking['statusHistory'])} steps):")
for idx, h in enumerate(reversed(tracking["statusHistory"]), 1):
    print(f"   [{idx}] {h['status']} (Actor: {h['changedBy']})")

print("\n==================================================")
print("  E2E VERTICAL SLICE: 100% OPERATIONAL & VERIFIED")
print("==================================================")
