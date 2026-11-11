import 'package:flutter/material.dart';

void main() {
  runApp(const FreshRouteDeliveryApp());
}

class FreshRouteDeliveryApp extends StatelessWidget {
  const FreshRouteDeliveryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FreshRoute Delivery Partner',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0D3826),
          primary: const Color(0xFF16A34A),
          background: const Color(0xFFF8FAF8),
        ),
        useMaterial3: true,
        fontFamily: 'Roboto',
      ),
      home: const DeliveryPartnerRouteScreen(),
    );
  }
}

class RouteTask {
  final String orderId;
  final String customer;
  final String area;
  final String time;
  final bool isNavigateFilled;

  const RouteTask({
    required this.orderId,
    required this.customer,
    required this.area,
    required this.time,
    this.isNavigateFilled = false,
  });
}

class DeliveryPartnerRouteScreen extends StatefulWidget {
  const DeliveryPartnerRouteScreen({super.key});

  @override
  State<DeliveryPartnerRouteScreen> createState() => _DeliveryPartnerRouteScreenState();
}

class _DeliveryPartnerRouteScreenState extends State<DeliveryPartnerRouteScreen> {
  int activeTab = 0; // 0: Pickup (3), 1: Delivery (2)

  final List<RouteTask> pickups = const [
    RouteTask(
      orderId: 'FR123456',
      customer: 'Priya S.',
      area: 'Malviya Nagar',
      time: '10:00 AM - 12:00 PM',
      isNavigateFilled: true,
    ),
    RouteTask(
      orderId: 'FR123457',
      customer: 'Rohan K.',
      area: 'Saket',
      time: '11:30 AM - 1:30 PM',
      isNavigateFilled: false,
    ),
    RouteTask(
      orderId: 'FR123458',
      customer: 'Anita M.',
      area: 'Hauz Khas',
      time: '09:30 AM - 11:30 AM',
      isNavigateFilled: false,
    ),
  ];

  final List<RouteTask> deliveries = const [
    RouteTask(
      orderId: 'FR123459',
      customer: 'Vikram S.',
      area: 'Vaishali Nagar',
      time: '02:00 PM - 04:00 PM',
      isNavigateFilled: true,
    ),
    RouteTask(
      orderId: 'FR123460',
      customer: 'Deepak J.',
      area: 'C-Scheme',
      time: '04:30 PM - 06:30 PM',
      isNavigateFilled: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final currentTasks = activeTab == 0 ? pickups : deliveries;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAF8),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        title: const Column(
          children: [
            Text(
              'My Route',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 26,
                color: Color(0xFF0F172A),
                letterSpacing: -0.5,
              ),
            ),
            SizedBox(height: 2),
            Text(
              'Delivery Partner App',
              style: TextStyle(
                fontSize: 13,
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          children: [
            const SizedBox(height: 16),
            // Two Tabs matching image_20261031_174545: Pickup (3) & Delivery (2)
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => activeTab = 0),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: activeTab == 0 ? const Color(0xFF16A34A) : const Color(0xFFE2E8F0),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        'Pickup (3)',
                        style: TextStyle(
                          color: activeTab == 0 ? Colors.white : const Color(0xFF475569),
                          fontWeight: FontWeight.w800,
                          fontSize: 15,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => activeTab = 1),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: activeTab == 1 ? const Color(0xFF16A34A) : const Color(0xFFE2E8F0),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        'Delivery (2)',
                        style: TextStyle(
                          color: activeTab == 1 ? Colors.white : const Color(0xFF475569),
                          fontWeight: FontWeight.w800,
                          fontSize: 15,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Task Cards List matching image_20261031_174545
            Expanded(
              child: ListView.separated(
                itemCount: currentTasks.length,
                separatorBuilder: (_, __) => const SizedBox(height: 14),
                itemBuilder: (context, index) {
                  final task = currentTasks[index];
                  return Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.02),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // Green Delivery Box Icon in Circular Tint
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCFCE7),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          alignment: Alignment.center,
                          child: const Icon(Icons.inventory_2, color: Color(0xFF16A34A), size: 22),
                        ),
                        const SizedBox(width: 14),

                        // Order Info
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                task.orderId,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${task.customer} • ${task.area}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  const Icon(Icons.access_time, size: 14, color: Color(0xFF94A3B8)),
                                  const SizedBox(width: 4),
                                  Text(
                                    task.time,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Color(0xFF94A3B8),
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),

                        // Navigate Button
                        task.isNavigateFilled
                            ? ElevatedButton.icon(
                                onPressed: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Opening Google Maps navigation to ${task.area}')),
                                  );
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF16A34A),
                                  foregroundColor: Colors.white,
                                  elevation: 0,
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                ),
                                icon: const Icon(Icons.turn_right, size: 16),
                                label: const Text('Navigate', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              )
                            : OutlinedButton(
                                onPressed: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Opening Google Maps navigation to ${task.area}')),
                                  );
                                },
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: const Color(0xFF16A34A),
                                  side: const BorderSide(color: Color(0xFF16A34A), width: 1.5),
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                ),
                                child: const Text('Navigate', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
