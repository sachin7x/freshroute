import 'package:flutter/material.dart';

void main() {
  runApp(const FreshRouteCustomerApp());
}

class FreshRouteCustomerApp extends StatelessWidget {
  const FreshRouteCustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FreshRoute',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0D3826),
          primary: const Color(0xFF0D3826),
          secondary: const Color(0xFF16A34A),
          background: const Color(0xFFF8FAF8),
        ),
        useMaterial3: true,
        fontFamily: 'Roboto',
      ),
      home: const SplashScreen(),
    );
  }
}

// -----------------------------------------------------------------
// Screen 1: Splash & Onboarding matching image_20261031_174618 Panel 1
// -----------------------------------------------------------------
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            children: [
              const Spacer(flex: 1),
              // Brand Mark
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: const Color(0xFF0D3826),
                  borderRadius: BorderRadius.circular(16),
                ),
                alignment: Alignment.center,
                child: const Icon(Icons.eco, color: Color(0xFF34D399), size: 36),
              ),
              const SizedBox(height: 16),
              const Text(
                'FreshRoute',
                style: TextStyle(
                  fontSize: 34,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0D3826),
                  letterSpacing: -1,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Laundry Made Simple.\nPickup. Care. Deliver.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF527867),
                  height: 1.4,
                ),
              ),
              const Spacer(flex: 2),

              // Lifestyle graphic card (stack of clean towels)
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                alignment: Alignment.center,
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.dry_cleaning, size: 72, color: Color(0xFF0D3826)),
                    SizedBox(height: 12),
                    Text(
                      'Doorstep quick-commerce laundry',
                      style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF475569)),
                    ),
                  ],
                ),
              ),
              const Spacer(flex: 2),

              // Get Started CTA matching Panel 1
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const CustomerHomeScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0D3826),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Get Started', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                ),
              ),
              const SizedBox(height: 14),
              const Text(
                'Pick up, clean and deliver across India.',
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}

// -----------------------------------------------------------------
// Screen 2: Customer Home matching image_20261031_174618 Panel 2
// -----------------------------------------------------------------
class CustomerHomeScreen extends StatefulWidget {
  const CustomerHomeScreen({super.key});

  @override
  State<CustomerHomeScreen> createState() => _CustomerHomeScreenState();
}

class _CustomerHomeScreenState extends State<CustomerHomeScreen> {
  final List<Map<String, dynamic>> services = [
    {
      'title': 'Wash & Fold',
      'price': 'From ₹49/kg',
      'icon': Icons.local_laundry_service,
      'color': 0xFFEFF6FF,
      'unit': 'kg',
      'paise': 4900,
    },
    {
      'title': 'Dry Cleaning',
      'price': 'From ₹99/item',
      'icon': Icons.checkroom,
      'color': 0xFFF0FDF4,
      'unit': 'item',
      'paise': 9900,
    },
    {
      'title': 'Ironing',
      'price': 'From ₹25/item',
      'icon': Icons.iron,
      'color': 0xFFFEFCE8,
      'unit': 'item',
      'paise': 2500,
    },
    {
      'title': 'Shoe Care',
      'price': 'From ₹149/pair',
      'icon': Icons.roller_skating,
      'color': 0xFFF8FAFC,
      'unit': 'pair',
      'paise': 14900,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAF8),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Deliver to', style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
            const Row(
              children: [
                Icon(Icons.location_on, size: 16, color: Color(0xFF0D3826)),
                SizedBox(width: 4),
                Text('Jaipur, Rajasthan ▼', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF0D3826))),
              ],
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: CircleAvatar(
              backgroundColor: const Color(0xFFDCFCE7),
              child: const Text('A', style: TextStyle(color: Color(0xFF0D3826), fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Search Services Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: const TextField(
              decoration: InputDecoration(
                icon: Icon(Icons.search, color: Colors.grey),
                hintText: 'Search services...',
                border: InputBorder.none,
              ),
            ),
          ),
          const SizedBox(height: 20),

          // 4 Service Category 2x2 Grid matching Panel 2
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 14,
              mainAxisSpacing: 14,
              childAspectRatio: 1.1,
            ),
            itemCount: services.length,
            itemBuilder: (context, index) {
              final srv = services[index];
              return InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ServiceDetailScreen(service: srv),
                    ),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(srv['icon'] as IconData, size: 36, color: const Color(0xFF0D3826)),
                      const SizedBox(height: 8),
                      Text(srv['title'] as String, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                      const SizedBox(height: 4),
                      Text(srv['price'] as String, style: const TextStyle(color: Color(0xFF16A34A), fontWeight: FontWeight.bold, fontSize: 13)),
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 20),

          // First Order 20% OFF Banner matching Panel 2
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFDCFCE7),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFBBF7D0)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('FIRST ORDER', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF166534))),
                    SizedBox(height: 2),
                    Text('20% OFF', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Color(0xFF0D3826))),
                  ],
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const BookingAddressScreen(),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0D3826),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text('Book Now', style: TextStyle(fontWeight: FontWeight.w800)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// -----------------------------------------------------------------
// Screen 3: Service Detail Screen matching Panel 3 & 4
// -----------------------------------------------------------------
class ServiceDetailScreen extends StatelessWidget {
  final Map<String, dynamic> service;

  const ServiceDetailScreen({super.key, required this.service});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAF8),
      appBar: AppBar(backgroundColor: Colors.white, elevation: 0.5),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(service['title'] as String, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFF0D3826))),
            const SizedBox(height: 4),
            const Text('Everyday clothes, professionally cleaned', style: TextStyle(fontSize: 14, color: Color(0xFF64748B))),
            const SizedBox(height: 16),
            Text(service['price'] as String, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Color(0xFF16A34A))),
            const SizedBox(height: 24),
            _buildFeature('Premium detergent'),
            _buildFeature('Hygienic cleaning'),
            _buildFeature('Fresh fragrance'),
            _buildFeature('Folded & packed'),
            _buildFeature('48–72 hours delivery'),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const BookingAddressScreen()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0D3826),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('Add to Basket', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeature(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          const Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 18),
          const SizedBox(width: 10),
          Text(text, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF334155))),
        ],
      ),
    );
  }
}

// -----------------------------------------------------------------
// Screen 4 & 5: Booking & Address Stepper matching Panel 4 & 5
// -----------------------------------------------------------------
class BookingAddressScreen extends StatelessWidget {
  const BookingAddressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAF8),
      appBar: AppBar(
        title: const Text('Schedule Pickup', style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0D3826))),
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Address Card matching Panel 4
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Home Address', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      Text('Change', style: TextStyle(color: Color(0xFF16A34A), fontWeight: FontWeight.bold, fontSize: 12)),
                    ],
                  ),
                  SizedBox(height: 6),
                  Text('B-12, Malviya Nagar\nJaipur - 302017', style: TextStyle(fontSize: 13, color: Color(0xFF475569))),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Date Selection
            const Text('Preferred Pickup Date', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
            const SizedBox(height: 10),
            Row(
              children: [
                _buildDateChip('Tue Oct 29', true),
                const SizedBox(width: 10),
                _buildDateChip('Wed Oct 31', false),
              ],
            ),
            const SizedBox(height: 20),

            // Cart Summary
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Wash & Fold (5 kg est.)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                      Text('₹245', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Steam Ironing (3 items)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                      Text('₹87', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const Spacer(),

            // Continue CTA
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const OrderConfirmedScreen()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0D3826),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('Continue to Pay ₹332', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDateChip(String date, bool selected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        color: selected ? const Color(0xFF0D3826) : Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: selected ? const Color(0xFF0D3826) : const Color(0xFFCBD5E1)),
      ),
      child: Text(
        date,
        style: TextStyle(
          color: selected ? Colors.white : const Color(0xFF0F172A),
          fontWeight: FontWeight.bold,
          fontSize: 13,
        ),
      ),
    );
  }
}

// -----------------------------------------------------------------
// Screen 6: Order Confirmed & UPI Payment matching Panel 6
// -----------------------------------------------------------------
class OrderConfirmedScreen extends StatelessWidget {
  const OrderConfirmedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAF8),
      appBar: AppBar(
        title: const Text('Order #FR123456', style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0D3826))),
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFDCFCE7),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFBBF7D0)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 28),
                  SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Order Confirmed', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF0D3826))),
                      Text('Expected Delivery: Tue, Oct 29, 6–8 PM', style: TextStyle(fontSize: 12, color: Color(0xFF166534), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('UPI Recommended', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
            const SizedBox(height: 12),
            _buildPaymentTile('Google Pay', '🟢'),
            _buildPaymentTile('PhonePe', '🟣'),
            _buildPaymentTile('Paytm', '🔵'),
            _buildPaymentTile('Cash on Delivery', '💵'),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Payment ₹332 authorized via Razorpay')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0D3826),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('Pay ₹332', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentTile(String name, String icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Text(icon, style: const TextStyle(fontSize: 18)),
          const SizedBox(width: 12),
          Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const Spacer(),
          const Icon(Icons.chevron_right, color: Colors.grey),
        ],
      ),
    );
  }
}
