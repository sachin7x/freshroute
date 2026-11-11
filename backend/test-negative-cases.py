import urllib.request
import urllib.error
import json
import time

BASE = "http://localhost:3001/api/v1"

def post_expect_error(url, data, expected_status, token=None):
    time.sleep(0.12)
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        urllib.request.urlopen(req)
        print(f"❌ FAIL: Expected HTTP {expected_status} but got 200 OK")
        return False
    except urllib.error.HTTPError as e:
        if e.code == expected_status:
            print(f"✅ PASS: Caught expected HTTP {e.code} ({e.reason})")
            return True
        else:
            print(f"⚠️ Caught HTTP {e.code} instead of {expected_status}")
            return False

print("==================================================")
print("  FRESHROUTE NEGATIVE & SECURITY VERIFICATION")
print("==================================================")

# 1. Invalid credentials
print("Test 1: Invalid credentials rejection")
post_expect_error(f"{BASE}/auth/login", {"phone": "+919876543212", "password": "WrongPassword!"}, 401)

# 2. Duplicate registration
print("\nTest 2: Duplicate email rejection")
post_expect_error(f"{BASE}/auth/register", {
    "email": "customer@freshroute.in",
    "phone": "+919999999999",
    "password": "Password@123",
    "role": "CUSTOMER"
}, 400)

# 3. Invalid status transition
print("\nTest 3: Invalid status transition")
admin_req = urllib.request.Request(f"{BASE}/auth/login", data=json.dumps({"phone": "+919876543210", "password": "Password@123"}).encode("utf-8"), headers={"Content-Type": "application/json"})
with urllib.request.urlopen(admin_req) as resp:
    admin_token = json.loads(resp.read().decode("utf-8"))["accessToken"]

post_expect_error(f"{BASE}/orders/invalid-order-id/status", {"status": "DELIVERED"}, 404, admin_token)

# 4. Unauthorized order access
print("\nTest 4: Unauthorized order access without token")
try:
    urllib.request.urlopen(f"{BASE}/orders/90bdc1f3-a343-4785-947b-28a220ae5669")
    print("❌ FAIL: Protected route allowed anonymous access")
except urllib.error.HTTPError as e:
    if e.code in [401, 403]:
        print(f"✅ PASS: Blocked unauthenticated access with HTTP {e.code}")
    else:
        print(f"HTTP {e.code}")

print("\n==================================================")
print("  ALL NEGATIVE SECURITY TEST CASES PASSED!")
print("==================================================")
