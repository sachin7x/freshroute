import React, { useState } from 'react';
import Head from 'next/head';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('Oct 20 - Oct 26, 2024');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignValetOrder, setAssignValetOrder] = useState(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Order #FR123459 pickup delayed by 10 mins (Malviya Nagar)', time: '5m ago', unread: true },
    { id: 2, text: 'Hub BHL-01 reached 85% processing capacity threshold', time: '22m ago', unread: true },
    { id: 3, text: 'Razorpay UPI payment captured ₹480 for #FR123457', time: '1h ago', unread: true },
  ]);

  // Inventory state with live restock
  const [inventory, setInventory] = useState([
    { name: 'Canvas QR-Tagged Bags', count: 450, unit: 'bags', min: 100, status: 'Healthy' },
    { name: 'Recycled Polybags (5kg)', count: 1250, unit: 'bags', min: 300, status: 'Healthy' },
    { name: 'Eco-Enzyme Liquid Detergent', count: 85, unit: 'Litres', min: 20, status: 'Healthy' },
    { name: 'Garment Wire Hangers', count: 620, unit: 'pcs', min: 150, status: 'Healthy' },
  ]);

  const restock = (index, delta) => {
    setInventory((prev) =>
      prev.map((item, i) => (i === index ? { ...item, count: item.count + delta } : item))
    );
    showToast(`✓ Added +${delta} to ${inventory[index].name}`);
  };

  const navItems = [
    { label: 'Dashboard', icon: '🏠' },
    { label: 'Orders', icon: '📋' },
    { label: 'Customers', icon: '👥' },
    { label: 'Laundries', icon: '🧺' },
    { label: 'Delivery Partners', icon: '🛵' },
    { label: 'Inventory', icon: '📦' },
    { label: 'Payments', icon: '💳' },
    { label: 'Reports', icon: '📊' },
    { label: 'Settings', icon: '⚙️' },
  ];

  const [orders, setOrders] = useState([
    { id: 'FR123456', customer: 'Priya Sharma', phone: '+91 98290 11223', address: 'B-14 Shastri Nagar, Bhilwara', service: 'Wash & Fold', status: 'Picked Up', amount: '₹332', created: '10:00 AM', statusType: 'mint', valet: 'Ramesh Kumar', qr: 'FRDYO9I8' },
    { id: 'FR123457', customer: 'Rohan Kapoor', phone: '+91 98290 44556', address: '42 Malviya Nagar, Jaipur', service: 'Dry Cleaning', status: 'In Processing', amount: '₹480', created: '09:25 AM', statusType: 'peach', valet: 'Suresh Singh', qr: 'FR88L1N2' },
    { id: 'FR123458', customer: 'Neha Mehta', phone: '+91 94140 77889', address: 'Flat 302 Marble Enclave, Kishangarh', service: 'Wash & Iron', status: 'Completed', amount: '₹245', created: '08:45 AM', statusType: 'mint', valet: 'Vikram Patel', qr: 'FR90K2M1' },
    { id: 'FR123459', customer: 'Amit Tiwari', phone: '+91 98280 22334', address: '12 Vaishali Nagar, Jaipur', service: 'Wash & Fold', status: 'Pending Pickup', amount: '₹410', created: '08:10 AM', statusType: 'peach', valet: 'Unassigned', qr: 'FR12A3B4' },
    { id: 'FR123460', customer: 'Kavita Joshi', phone: '+91 94141 55667', address: '78 Textile Market, Bhilwara', service: 'Shoe Care', status: 'Pending Pickup', amount: '₹298', created: '07:30 AM', statusType: 'peach', valet: 'Unassigned', qr: 'FR55C9D0' },
  ]);

  const [customers, setCustomers] = useState([
    { name: 'Priya Sharma', phone: '+91 98290 11223', city: 'Bhilwara', orders: 14, spent: '₹4,890', plan: 'FreshPass Pro' },
    { name: 'Rohan Kapoor', phone: '+91 98290 44556', city: 'Jaipur', orders: 8, spent: '₹3,420', plan: 'Standard' },
    { name: 'Neha Mehta', phone: '+91 94140 77889', city: 'Kishangarh', orders: 5, spent: '₹1,650', plan: 'FreshPass Pro' },
    { name: 'Amit Tiwari', phone: '+91 98280 22334', city: 'Jaipur', orders: 21, spent: '₹7,110', plan: 'FreshPass Pro' },
    { name: 'Kavita Joshi', phone: '+91 94141 55667', city: 'Bhilwara', orders: 3, spent: '₹890', plan: 'Standard' },
  ]);

  const [valets, setValets] = useState([
    { name: 'Ramesh Kumar', phone: '+91 98290 99881', zone: 'Bhilwara North', vehicle: 'EV Scooter (Activa)', activeTasks: 2, status: 'On Route' },
    { name: 'Suresh Singh', phone: '+91 94140 33221', zone: 'Jaipur Malviya Nagar', vehicle: 'Hero Electric', activeTasks: 3, status: 'On Route' },
    { name: 'Vikram Patel', phone: '+91 98280 44552', zone: 'Kishangarh', vehicle: 'Bajaj Chetak', activeTasks: 1, status: 'Available' },
  ]);

  const [settings, setSettings] = useState({
    bhilwaraActive: true,
    jaipurActive: true,
    kishangarhActive: true,
    primeSlot: '7:00 PM - 10:00 PM',
    basePriceBhilwara: '49',
    basePriceJaipur: '79',
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAssignValet = (orderId, valetName) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, valet: valetName, status: 'Pickup Assigned', statusType: 'mint' }
          : o
      )
    );
    setAssignValetOrder(null);
    showToast(`✓ Assigned ${valetName} to Order #${orderId}`);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const statusType = ['Completed', 'Picked Up', 'Delivered'].includes(newStatus) ? 'mint' : 'peach';
          return { ...o, status: newStatus, statusType };
        }
        return o;
      })
    );
    showToast(`Order #${orderId} status updated to ${newStatus}`);
  };

  // Filter orders by search & status
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.service.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  // Filter customers by search
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f8fafc', color: '#0f172a' }}>
      <Head>
        <title>FreshRoute | Ops Command Center</title>
      </Head>

      {/* Floating Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', background: '#0d3826', color: '#fff', padding: '10px 22px', borderRadius: '24px', fontSize: '13px', fontWeight: '800', zIndex: 1000, boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Sidebar matching UI Kit */}
      <aside style={{ width: '250px', background: '#0d3826', color: '#ecfdf5', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', paddingLeft: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px' }}>🌿</span>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>FreshRoute</div>
            <div style={{ fontSize: '11px', color: '#a7f3d0', fontWeight: '600' }}>Admin Command</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveTab(item.label);
                setSearch('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === item.label ? '#19563c' : 'transparent',
                color: activeTab === item.label ? '#ffffff' : '#a7f3d0',
                fontWeight: activeTab === item.label ? '800' : '600',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s'
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Portal Links */}
        <div style={{ borderTop: '1px solid #19563c', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href="http://localhost:3000"
            style={{ display: 'block', padding: '8px 12px', borderRadius: '8px', color: '#a7f3d0', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}
          >
            ↗ Customer App (:3000)
          </a>
          <a
            href="http://localhost:3003"
            style={{ display: 'block', padding: '8px 12px', borderRadius: '8px', color: '#a7f3d0', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}
          >
            ↗ Partner Portal (:3003)
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '28px 36px', overflowY: 'auto' }}>
        {/* Top Header Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
              {activeTab}
            </h1>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              All Dark Hubs Active &bull; Rajasthan Operations (Bhilwara, Jaipur, Kishangarh)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '9px', color: '#94a3b8', fontSize: '14px' }}>🔍</span>
              <input
                type="text"
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '9px 14px 9px 36px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '13px',
                  width: '240px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', position: 'relative' }}
              >
                🔔
                {notifications.some(n => n.unread) && (
                  <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div style={{ position: 'absolute', right: 0, top: '46px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', width: '340px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', fontSize: '14px' }}>Live System Alerts</span>
                    <button
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                        showToast('All alerts marked as read');
                      }}
                      style={{ background: 'none', border: 'none', color: '#0d3826', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc', background: n.unread ? '#f0fdf4' : '#fff' }}>
                        <div style={{ fontSize: '13px', color: '#334155', fontWeight: n.unread ? '700' : '400' }}>{n.text}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Menu */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#fff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '10px' }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0d3826', fontSize: '12px' }}>
                  AD
                </div>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#334155' }}>Admin ▼</span>
              </div>

              {isProfileOpen && (
                <div style={{ position: 'absolute', right: 0, top: '44px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', width: '220px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden', padding: '12px' }}>
                  <div style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>Sachin Sharma</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>Super Administrator</div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setActiveTab('Settings');
                      }}
                      style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer', padding: '4px 0' }}
                    >
                      ⚙️ System Settings
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        showToast('Admin session reset to default');
                      }}
                      style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', color: '#ef4444', fontWeight: '700', cursor: 'pointer', padding: '4px 0' }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'Dashboard' && (
          <div>
            {/* 4 KPI Cards Grid */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div
                onClick={() => setStatusFilter('All')}
                style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '22px', position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', cursor: 'pointer' }}
              >
                <div style={{ position: 'absolute', right: '20px', top: '20px', width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🛍️
                </div>
                <div style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>1,248</div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '14px' }}>Total Orders</div>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                  ↑ +12%
                </span>
              </div>

              <div
                onClick={() => setStatusFilter('Completed')}
                style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '22px', position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', cursor: 'pointer' }}
              >
                <div style={{ position: 'absolute', right: '20px', top: '20px', width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  ✓
                </div>
                <div style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>842</div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '14px' }}>Completed</div>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                  ↑ +18%
                </span>
              </div>

              <div
                onClick={() => setStatusFilter('In Processing')}
                style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '22px', position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', cursor: 'pointer' }}
              >
                <div style={{ position: 'absolute', right: '20px', top: '20px', width: '38px', height: '38px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🕒
                </div>
                <div style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>156</div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '14px' }}>In Processing</div>
                <span style={{ background: '#ffedd5', color: '#c2410c', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                  ↑ +5%
                </span>
              </div>

              <div
                onClick={() => setStatusFilter('Pending Pickup')}
                style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '22px', position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', cursor: 'pointer' }}
              >
                <div style={{ position: 'absolute', right: '20px', top: '20px', width: '38px', height: '38px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🚚
                </div>
                <div style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>34</div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '14px' }}>Pending Pickup</div>
                <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                  ↓ -8%
                </span>
              </div>
            </section>

            {/* Orders Table */}
            <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Live Orders</h2>
                  
                  {/* Status Pills */}
                  <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}>
                    {['All', 'Pending Pickup', 'Picked Up', 'In Processing', 'Completed'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        style={{
                          border: 'none',
                          padding: '5px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          background: statusFilter === s ? '#0d3826' : 'transparent',
                          color: statusFilter === s ? '#ffffff' : '#64748b'
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsDateOpen(!isDateOpen)}
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <span>📅</span>
                    <span>{dateRange}</span>
                    <span>▼</span>
                  </button>

                  {isDateOpen && (
                    <div style={{ position: 'absolute', right: 0, top: '42px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, width: '180px', overflow: 'hidden' }}>
                      {['Today', 'Yesterday', 'Oct 20 - Oct 26, 2024', 'This Month', 'All Time'].map((d) => (
                        <div
                          key={d}
                          onClick={() => {
                            setDateRange(d);
                            setIsDateOpen(false);
                            showToast(`Filter set to: ${d}`);
                          }}
                          style={{ padding: '9px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', color: '#334155' }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px' }}>
                    <th style={{ padding: '14px 12px' }}># Order</th>
                    <th style={{ padding: '14px 12px' }}>Customer</th>
                    <th style={{ padding: '14px 12px' }}>Service</th>
                    <th style={{ padding: '14px 12px' }}>Valet</th>
                    <th style={{ padding: '14px 12px' }}>Status</th>
                    <th style={{ padding: '14px 12px' }}>Amount</th>
                    <th style={{ padding: '14px 12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                        No orders match filter "{statusFilter}"
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 12px', fontWeight: '800', color: '#0f172a' }}>{ord.id}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ fontWeight: '700', color: '#334155' }}>{ord.customer}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{ord.phone}</div>
                        </td>
                        <td style={{ padding: '14px 12px', color: '#475569' }}>{ord.service}</td>
                        <td style={{ padding: '14px 12px' }}>
                          {ord.valet === 'Unassigned' ? (
                            <button
                              onClick={() => setAssignValetOrder(ord)}
                              style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                            >
                              + Assign Valet
                            </button>
                          ) : (
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0d3826' }}>
                              🛵 {ord.valet}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '800',
                              border: '1px solid #cbd5e1',
                              background: ord.statusType === 'mint' ? '#dcfce7' : '#ffedd5',
                              color: ord.statusType === 'mint' ? '#166534' : '#c2410c',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Pending Pickup">Pending Pickup</option>
                            <option value="Pickup Assigned">Pickup Assigned</option>
                            <option value="Picked Up">Picked Up</option>
                            <option value="In Processing">In Processing</option>
                            <option value="Quality Check">Quality Check</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: '800', color: '#0d3826' }}>{ord.amount}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}
                          >
                            👁️ View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* TAB 2: ORDERS (FULL EXPANDED) */}
        {activeTab === 'Orders' && (
          <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Order Dispatch Ledger</h2>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Complete lifecycle tracking for all service areas</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setIsNewOrderOpen(true)}
                  style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
                >
                  + New Phone Order
                </button>
                <button
                  onClick={() => {
                    const csv = "Order,Customer,Phone,Address,Service,Valet,Status,Amount\n" + orders.map(o => `${o.id},${o.customer},${o.phone},"${o.address}",${o.service},${o.valet},${o.status},${o.amount}`).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'freshroute_all_orders.csv';
                    a.click();
                    showToast('📥 Exported freshroute_all_orders.csv');
                  }}
                  style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  📥 Export CSV
                </button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px' }}>
                  <th style={{ padding: '12px' }}>Order ID</th>
                  <th style={{ padding: '12px' }}>QR Tag</th>
                  <th style={{ padding: '12px' }}>Customer</th>
                  <th style={{ padding: '12px' }}>Service</th>
                  <th style={{ padding: '12px' }}>Valet</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: '800' }}>{o.id}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#0d3826', fontWeight: '700' }}>{o.qr}</td>
                    <td style={{ padding: '12px' }}>{o.customer} ({o.phone})</td>
                    <td style={{ padding: '12px' }}>{o.service}</td>
                    <td style={{ padding: '12px' }}>{o.valet}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', background: '#dcfce7', color: '#166534' }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: '800', color: '#0d3826' }}>{o.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* TAB 3: CUSTOMERS */}
        {activeTab === 'Customers' && (
          <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Customer Directory</h2>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{filteredCustomers.length} verified accounts in Rajasthan</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px' }}>
                  <th style={{ padding: '12px' }}>Customer Name</th>
                  <th style={{ padding: '12px' }}>Phone</th>
                  <th style={{ padding: '12px' }}>City</th>
                  <th style={{ padding: '12px' }}>Total Orders</th>
                  <th style={{ padding: '12px' }}>Lifetime GMV</th>
                  <th style={{ padding: '12px' }}>Membership</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: '800', color: '#0f172a' }}>{c.name}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{c.phone}</td>
                    <td style={{ padding: '14px 12px', fontWeight: '600' }}>{c.city}</td>
                    <td style={{ padding: '14px 12px', fontWeight: '700' }}>{c.orders} orders</td>
                    <td style={{ padding: '14px 12px', fontWeight: '800', color: '#0d3826' }}>{c.spent}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', background: c.plan.includes('Pro') ? '#fef3c7' : '#f1f5f9', color: c.plan.includes('Pro') ? '#b45309' : '#475569' }}>
                        {c.plan}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <button
                        onClick={() => showToast(`💬 WhatsApp reminder dispatched to ${c.name}`)}
                        style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        💬 WhatsApp
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* TAB 4: LAUNDRIES (DARK HUBS) */}
        {activeTab === 'Laundries' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontWeight: '900', fontSize: '18px', color: '#0d3826' }}>Hub BHL-01</span>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>OPERATIONAL</span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>Bhilwara Central Facility</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>RIICO Phase 2, Industrial Area</div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  <span>Capacity Utilization</span>
                  <span style={{ color: '#c2410c' }}>85% (425 / 500 kg)</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ background: '#f59e0b', width: '85%', height: '100%' }}></div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '16px' }}>
                4 Commercial Washers &bull; 2 Steam Boilers
              </div>
              <button
                onClick={() => showToast('Capacity for Hub BHL-01 expanded to 600 kg')}
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                Adjust Capacity Load
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontWeight: '900', fontSize: '18px', color: '#0d3826' }}>Hub JPR-01</span>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>OPERATIONAL</span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>Jaipur South SuperHub</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Malviya Nagar & Vaishali Coverage</div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  <span>Capacity Utilization</span>
                  <span style={{ color: '#166534' }}>62% (310 / 500 kg)</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ background: '#16a34a', width: '62%', height: '100%' }}></div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '16px' }}>
                6 Washers &bull; 4 Steam Press Stations
              </div>
              <button
                onClick={() => showToast('Capacity for Hub JPR-01 expanded')}
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                Adjust Capacity Load
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontWeight: '900', fontSize: '18px', color: '#0d3826' }}>Hub KSG-01</span>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>OPERATIONAL</span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>Kishangarh Satellite Hub</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Marble City Express Zone</div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                  <span>Capacity Utilization</span>
                  <span style={{ color: '#166534' }}>30% (150 / 500 kg)</span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ background: '#16a34a', width: '30%', height: '100%' }}></div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '16px' }}>
                2 Commercial Washers &bull; 1 Tumbler
              </div>
              <button
                onClick={() => showToast('Capacity for Hub KSG-01 checked')}
                style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                Adjust Capacity Load
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: DELIVERY PARTNERS (VALETS) */}
        {activeTab === 'Delivery Partners' && (
          <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Delivery Valet Fleet</h2>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Active evening doorstep shift: 7 PM – 10 PM</div>
              </div>
              <button
                onClick={() => showToast('Valet onboarding link copied')}
                style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                + Onboard New Valet
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px' }}>
                  <th style={{ padding: '12px' }}>Valet Name</th>
                  <th style={{ padding: '12px' }}>Phone</th>
                  <th style={{ padding: '12px' }}>Zone</th>
                  <th style={{ padding: '12px' }}>Vehicle</th>
                  <th style={{ padding: '12px' }}>Assigned Pickups</th>
                  <th style={{ padding: '12px' }}>Shift Status</th>
                  <th style={{ padding: '12px' }}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {valets.map((v, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 12px', fontWeight: '800', color: '#0f172a' }}>{v.name}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{v.phone}</td>
                    <td style={{ padding: '14px 12px', fontWeight: '600' }}>{v.zone}</td>
                    <td style={{ padding: '14px 12px', color: '#475569' }}>{v.vehicle}</td>
                    <td style={{ padding: '14px 12px', fontWeight: '800', color: '#0d3826' }}>{v.activeTasks} active</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', background: v.status === 'On Route' ? '#dcfce7' : '#fef3c7', color: v.status === 'On Route' ? '#166534' : '#b45309' }}>
                        {v.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <a
                        href={`tel:${v.phone.replace(/[^0-9+]/g, '')}`}
                        style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', color: '#0d3826', textDecoration: 'none' }}
                      >
                        📞 Call Valet
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* TAB 6: INVENTORY */}
        {activeTab === 'Inventory' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {inventory.map((item, idx) => (
              <div key={idx} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{item.name}</h3>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#0d3826', marginBottom: '4px' }}>
                  {item.count} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>{item.unit}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                  Minimum Reorder Safety Threshold: {item.min} {item.unit}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => restock(idx, 50)}
                    style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    + Restock 50 Units
                  </button>
                  <button
                    onClick={() => restock(idx, 200)}
                    style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    + Restock 200 Units
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 7: PAYMENTS */}
        {activeTab === 'Payments' && (
          <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Razorpay & UPI Settlements</h2>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Direct merchant settlement into ICICI Bank current account</div>
              </div>
              <button
                onClick={() => {
                  const report = "Razorpay Transaction Settlement Report\nDate: " + new Date().toISOString() + "\nTotal Captured: ₹1,48,250.00\nGateway Fees: ₹2,965.00\nNet Remitted: ₹1,45,285.00\nStatus: SETTLED";
                  const blob = new Blob([report], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'settlement_report_oct26.txt';
                  a.click();
                  showToast('📥 Downloaded settlement_report_oct26.txt');
                }}
                style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
              >
                📥 Download Settlement Report
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px' }}>Transaction ID</th>
                  <th style={{ padding: '12px' }}>Order ID</th>
                  <th style={{ padding: '12px' }}>Customer</th>
                  <th style={{ padding: '12px' }}>Payment Method</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>Gateway Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>pay_FR901234</td>
                  <td style={{ padding: '12px', fontWeight: '700' }}>FR123456</td>
                  <td style={{ padding: '12px' }}>Priya Sharma</td>
                  <td style={{ padding: '12px' }}>UPI (Google Pay)</td>
                  <td style={{ padding: '12px', fontWeight: '800', color: '#0d3826' }}>₹332.00</td>
                  <td style={{ padding: '12px' }}><span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '10px', fontWeight: '800', fontSize: '11px' }}>CAPTURED</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>pay_FR901235</td>
                  <td style={{ padding: '12px', fontWeight: '700' }}>FR123457</td>
                  <td style={{ padding: '12px' }}>Rohan Kapoor</td>
                  <td style={{ padding: '12px' }}>UPI (PhonePe)</td>
                  <td style={{ padding: '12px', fontWeight: '800', color: '#0d3826' }}>₹480.00</td>
                  <td style={{ padding: '12px' }}><span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '10px', fontWeight: '800', fontSize: '11px' }}>CAPTURED</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontFamily: 'monospace' }}>pay_FR901236</td>
                  <td style={{ padding: '12px', fontWeight: '700' }}>FR123458</td>
                  <td style={{ padding: '12px' }}>Neha Mehta</td>
                  <td style={{ padding: '12px' }}>Credit Card (HDFC)</td>
                  <td style={{ padding: '12px', fontWeight: '800', color: '#0d3826' }}>₹245.00</td>
                  <td style={{ padding: '12px' }}><span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '10px', fontWeight: '800', fontSize: '11px' }}>CAPTURED</span></td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {/* TAB 8: REPORTS */}
        {activeTab === 'Reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>GROSS REVENUE (GMV)</div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#0d3826', marginTop: '4px' }}>₹1,48,250</div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', marginTop: '6px' }}>↑ +24% MoM</div>
              </div>
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>AVG TURNAROUND SLA</div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>28.4 hrs</div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', marginTop: '6px' }}>Target &lt; 48 hrs</div>
              </div>
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>CUSTOMER CSAT</div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>4.88 / 5.0</div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', marginTop: '6px' }}>Based on 642 reviews</div>
              </div>
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>REPEAT COHORT RATE</div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>64.2%</div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', marginTop: '6px' }}>Top quintile benchmark</div>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Executive Audit & Compliance Summary</h3>
                <button
                  onClick={() => {
                    const report = "FreshRoute Operations & Financial Audit Summary\nPeriod: FY 2026-27 (Rajasthan Pilot)\n\nGMV: ₹1,48,250\nCompleted Orders: 842\nRepeat Rate: 64.2%\nTurnaround SLA: 28.4 hours\nStatus: VERIFIED & COMPLIANT";
                    const blob = new Blob([report], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'freshroute_executive_audit.txt';
                    a.click();
                    showToast('📄 Downloaded freshroute_executive_audit.txt');
                  }}
                  style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
                >
                  📄 Export Executive Audit (.txt)
                </button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                Full operational metrics adhere strictly to the integer-paise financial schema and 20-model Prisma data layer. Dark Hubs in Bhilwara, Jaipur, and Kishangarh are operating with zero SLA breaches for the current weekly cycle.
              </p>
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS */}
        {activeTab === 'Settings' && (
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', maxWidth: '640px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>
              Platform Operating Parameters
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              Configure active geographic rollout zones and serviceability thresholds.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>Bhilwara Pilot Market</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>PINs 311001, 311002 (Dark Hub BHL-01)</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.bhilwaraActive}
                    onChange={(e) => setSettings({ ...settings, bhilwaraActive: e.target.checked })}
                    style={{ width: '20px', height: '20px', accentColor: '#0d3826' }}
                  />
                </label>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>Jaipur Expansion Market</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>PINs 302017 (Malviya), 302021 (Vaishali)</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.jaipurActive}
                    onChange={(e) => setSettings({ ...settings, jaipurActive: e.target.checked })}
                    style={{ width: '20px', height: '20px', accentColor: '#0d3826' }}
                  />
                </label>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>Kishangarh Expansion Market</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>PINs 305801, 305802 (Dark Hub KSG-01)</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.kishangarhActive}
                    onChange={(e) => setSettings({ ...settings, kishangarhActive: e.target.checked })}
                    style={{ width: '20px', height: '20px', accentColor: '#0d3826' }}
                  />
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Default Doorstep Pickup Window
                </label>
                <input
                  type="text"
                  value={settings.primeSlot}
                  onChange={(e) => setSettings({ ...settings, primeSlot: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px' }}
                />
              </div>

              <button
                onClick={() => showToast('✓ System operating parameters saved')}
                style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', marginTop: '8px' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0d3826' }}>Order #{selectedOrder.id}</h3>
                <button onClick={() => setSelectedOrder(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>QR Bag Code:</span>
                  <span style={{ fontSize: '13px', fontWeight: '900', fontFamily: 'monospace', color: '#0d3826' }}>{selectedOrder.qr}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Customer:</span>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>{selectedOrder.customer} ({selectedOrder.phone})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Address:</span>
                  <span style={{ fontSize: '12px', color: '#334155', maxWidth: '240px', textAlign: 'right' }}>{selectedOrder.address}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Service:</span>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>{selectedOrder.service}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Assigned Valet:</span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#0d3826' }}>{selectedOrder.valet}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Total Paid:</span>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: '#0d3826' }}>{selectedOrder.amount}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                style={{ width: '100%', background: '#0d3826', color: '#fff', border: 'none', padding: '11px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
              >
                Close Details
              </button>
            </div>
          </div>
        )}

        {/* ASSIGN VALET MODAL */}
        {assignValetOrder && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0d3826' }}>Assign Valet to #{assignValetOrder.id}</h3>
                <button onClick={() => setAssignValetOrder(null)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>

              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Select an active valet for doorstep pickup in {assignValetOrder.address}.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {valets.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => handleAssignValet(assignValetOrder.id, v.name)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#fff', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>🛵 {v.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{v.zone} &bull; {v.activeTasks} active tasks</div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#0d3826' }}>Select →</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setAssignValetOrder(null)}
                style={{ width: '100%', background: '#f1f5f9', color: '#334155', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* NEW PHONE ORDER MODAL */}
        {isNewOrderOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0d3826' }}>Create Phone Order</h3>
                <button onClick={() => setIsNewOrderOpen(false)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newOrd = {
                    id: 'FR' + Math.floor(100000 + Math.random() * 900000),
                    customer: e.target.customerName.value,
                    phone: e.target.phone.value,
                    address: e.target.address.value,
                    service: e.target.service.value,
                    status: 'Pending Pickup',
                    amount: '₹' + e.target.amount.value,
                    created: 'Just now',
                    statusType: 'peach',
                    valet: 'Unassigned',
                    qr: 'FR' + Math.random().toString(36).substring(2, 8).toUpperCase()
                  };
                  setOrders([newOrd, ...orders]);
                  setIsNewOrderOpen(false);
                  showToast(`✓ Created Order #${newOrd.id} for ${newOrd.customer}`);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Customer Name</label>
                  <input name="customerName" defaultValue="Deepak Soni" required style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Phone Number</label>
                  <input name="phone" defaultValue="+91 94140 88990" required style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Address</label>
                  <input name="address" defaultValue="Near City Mall, Bhilwara" required style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Service</label>
                    <select name="service" style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff' }}>
                      <option value="Wash & Fold">Wash & Fold</option>
                      <option value="Wash & Iron">Wash & Iron</option>
                      <option value="Dry Cleaning">Dry Cleaning</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Amount (₹)</label>
                    <input name="amount" type="number" defaultValue="350" required style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', marginTop: '8px' }}
                >
                  Create & Dispatch
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
