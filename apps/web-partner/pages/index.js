import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function PartnerPortal() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [stageFilter, setStageFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState('');
  const [dateRange, setDateRange] = useState('Oct 20 - Oct 26, 2024');
  const [isDateOpen, setIsDateOpen] = useState(false);

  const navItems = [
    { label: 'Overview', icon: '📊' },
    { label: 'Orders', icon: '📋' },
    { label: 'Processing', icon: '🧺' },
    { label: 'Quality Check', icon: '🔍' },
    { label: 'Payouts', icon: '💳' },
    { label: 'Profile', icon: '👤' },
  ];

  const initialOrders = [
    { id: 'FR123456', service: 'Wash & Fold', weight: '5.0 kg (14 pcs)', status: 'Assigned', badge: 'blue', customer: 'Priya Sharma', bagQr: 'FRDYO9I8', hub: 'BHL-01', notes: 'Whites separated. Low tumble dry.' },
    { id: 'FR123455', service: 'Dry Cleaning', weight: '3 items', status: 'In Processing', badge: 'sage', customer: 'Rohan Kapoor', bagQr: 'FR88L1N2', hub: 'BHL-01', notes: 'Blazer + 2 Silk Shirts. Gentle solvent.' },
    { id: 'FR123454', service: 'Wash & Iron', weight: '4.2 kg (12 pcs)', status: 'Quality Check', badge: 'purple', customer: 'Neha Mehta', bagQr: 'FR90K2M1', hub: 'BHL-01', notes: 'Crisp collar steam press required.' },
    { id: 'FR123453', service: 'Wash & Fold', weight: '3.8 kg (10 pcs)', status: 'Ready for Dispatch', badge: 'green', customer: 'Amit Tiwari', bagQr: 'FR12A3B4', hub: 'BHL-01', notes: 'Packed in biodegradable polybag.' },
  ];

  const [orders, setOrders] = useState(initialOrders);

  // Sync with localStorage so intake.js entries show up
  useEffect(() => {
    try {
      const stored = localStorage.getItem('freshroute_partner_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge avoiding duplicate IDs
          const existingIds = new Set(parsed.map(o => o.id));
          const merged = [...parsed, ...initialOrders.filter(o => !existingIds.has(o.id))];
          setOrders(merged);
          return;
        }
      }
      localStorage.setItem('freshroute_partner_orders', JSON.stringify(initialOrders));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const saveOrders = (newOrders) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('freshroute_partner_orders', JSON.stringify(newOrders));
    } catch (e) {}
  };

  const advanceStatus = (id) => {
    const updated = orders.map((o) => {
      if (o.id === id) {
        if (o.status === 'Assigned') {
          showToast(`Order #${id} moved to In Processing`);
          return { ...o, status: 'In Processing', badge: 'sage' };
        }
        if (o.status === 'In Processing') {
          showToast(`Order #${id} moved to Quality Check`);
          return { ...o, status: 'Quality Check', badge: 'purple' };
        }
        if (o.status === 'Quality Check') {
          showToast(`Order #${id} marked Ready for Dispatch!`);
          return { ...o, status: 'Ready for Dispatch', badge: 'green' };
        }
      }
      return o;
    });
    saveOrders(updated);
  };

  // Filter orders by active stage
  const filteredOrders = orders.filter((o) => {
    if (stageFilter === 'All') return true;
    return o.status.toLowerCase().includes(stageFilter.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f8fafc', color: '#0f172a' }}>
      <Head>
        <title>FreshRoute | Partner Laundry Portal</title>
      </Head>

      {/* Floating Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', background: '#0d3826', color: '#fff', padding: '10px 22px', borderRadius: '24px', fontSize: '13px', fontWeight: '800', zIndex: 1000, boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Sidebar matching UI Kit */}
      <aside style={{ width: '250px', background: '#0d3826', color: '#ecfdf5', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', paddingLeft: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px' }}>🌿</span>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>FreshRoute</div>
            <div style={{ fontSize: '11px', color: '#a7f3d0', fontWeight: '600' }}>Partner Hub Portal</div>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
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
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Portal Switcher */}
        <div style={{ borderTop: '1px solid #19563c', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href="http://localhost:3000"
            style={{ display: 'block', padding: '8px 12px', borderRadius: '8px', color: '#a7f3d0', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}
          >
            ↗ Customer App (:3000)
          </a>
          <a
            href="http://localhost:3002"
            style={{ display: 'block', padding: '8px 12px', borderRadius: '8px', color: '#a7f3d0', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}
          >
            ↗ Admin Dashboard (:3002)
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '28px 36px', overflowY: 'auto' }}>
        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
              {activeTab === 'Overview' ? 'Partner Laundry' : activeTab}
            </h1>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Bhilwara Industrial Hub BHL-01 &bull; Active Shift: 07:00 AM – 10:00 PM
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a
              href="/intake"
              style={{
                background: '#0d3826',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(13,56,38,0.15)'
              }}
            >
              <span>⚖️</span>
              <span>+ Weighing Intake</span>
            </a>
          </div>
        </header>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div>
            {/* 4 KPI Tiles */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div
                onClick={() => setStageFilter('Assigned')}
                style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', cursor: 'pointer', transition: 'transform 0.1s' }}
              >
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a' }}>124</div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Assigned Bags</div>
                <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: '700', marginTop: '6px' }}>Click to filter →</div>
              </div>

              <div
                onClick={() => setStageFilter('In Processing')}
                style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#f59e0b' }}>12</div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>In Wash / Dry</div>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '700', marginTop: '6px' }}>Click to filter →</div>
              </div>

              <div
                onClick={() => setStageFilter('Quality Check')}
                style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#7e22ce' }}>8</div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Quality Inspection</div>
                <div style={{ fontSize: '11px', color: '#7e22ce', fontWeight: '700', marginTop: '6px' }}>Click to filter →</div>
              </div>

              <div
                onClick={() => setStageFilter('Ready for Dispatch')}
                style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#16a34a' }}>98</div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Ready for Valet</div>
                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', marginTop: '6px' }}>Click to filter →</div>
              </div>
            </section>

            {/* Today's Orders Section */}
            <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Today's Orders</h2>
                  
                  {/* Stage Filter Buttons */}
                  <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}>
                    {['All', 'Assigned', 'In Processing', 'Quality Check', 'Ready for Dispatch'].map((stg) => (
                      <button
                        key={stg}
                        onClick={() => setStageFilter(stg)}
                        style={{
                          border: 'none',
                          padding: '5px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          background: stageFilter === stg ? '#0d3826' : 'transparent',
                          color: stageFilter === stg ? '#ffffff' : '#64748b'
                        }}
                      >
                        {stg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsDateOpen(!isDateOpen)}
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>📅</span>
                    <span>{dateRange}</span>
                    <span>▼</span>
                  </button>

                  {isDateOpen && (
                    <div style={{ position: 'absolute', right: 0, top: '38px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, width: '180px', overflow: 'hidden' }}>
                      {['Today (Live)', 'Oct 20 - Oct 26, 2024', 'This Month', 'All Past Orders'].map((d) => (
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
                    <th style={{ padding: '12px 10px' }}># Order</th>
                    <th style={{ padding: '12px 10px' }}>QR Tag</th>
                    <th style={{ padding: '12px 10px' }}>Customer / Service</th>
                    <th style={{ padding: '12px 10px' }}>Weight & Items</th>
                    <th style={{ padding: '12px 10px' }}>Status / Action</th>
                    <th style={{ padding: '12px 10px' }}>Inspect</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                        No orders match filter "{stageFilter}"
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 10px', fontWeight: '800', color: '#0f172a' }}>{ord.id}</td>
                        <td style={{ padding: '14px 10px', fontFamily: 'monospace', color: '#0d3826', fontWeight: '700' }}>{ord.bagQr}</td>
                        <td style={{ padding: '14px 10px' }}>
                          <div style={{ fontWeight: '700', color: '#334155' }}>{ord.service}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{ord.customer}</div>
                        </td>
                        <td style={{ padding: '14px 10px', color: '#475569', fontWeight: '600' }}>{ord.weight}</td>
                        <td style={{ padding: '14px 10px' }}>
                          <button
                            onClick={() => advanceStatus(ord.id)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '14px',
                              fontSize: '12px',
                              fontWeight: '800',
                              border: 'none',
                              cursor: 'pointer',
                              background:
                                ord.status === 'Assigned'
                                  ? '#dbeafe'
                                  : ord.status === 'In Processing'
                                  ? '#ffedd5'
                                  : ord.status === 'Quality Check'
                                  ? '#f3e8ff'
                                  : '#dcfce7',
                              color:
                                ord.status === 'Assigned'
                                  ? '#1d4ed8'
                                  : ord.status === 'In Processing'
                                  ? '#c2410c'
                                  : ord.status === 'Quality Check'
                                  ? '#7e22ce'
                                  : '#166534',
                            }}
                          >
                            {ord.status} →
                          </button>
                        </td>
                        <td style={{ padding: '14px 10px' }}>
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}
                          >
                            Details 👁️
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

        {/* TAB 2: ORDERS (FULL MANAGEMENT) */}
        {activeTab === 'Orders' && (
          <section style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>All Partner Laundry Batches</h2>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Complete queue history for Hub BHL-01</div>
              </div>
              <button
                onClick={() => {
                  const csv = "Order,QR,Customer,Service,Weight,Status\n" + orders.map(o => `${o.id},${o.bagQr},${o.customer},${o.service},${o.weight},${o.status}`).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'partner_laundry_orders.csv';
                  a.click();
                  showToast('📥 Downloaded partner_laundry_orders.csv');
                }}
                style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                📥 Export CSV
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px' }}>
                  <th style={{ padding: '12px 10px' }}>Order ID</th>
                  <th style={{ padding: '12px 10px' }}>QR Code</th>
                  <th style={{ padding: '12px 10px' }}>Customer</th>
                  <th style={{ padding: '12px 10px' }}>Service</th>
                  <th style={{ padding: '12px 10px' }}>Weight & Items</th>
                  <th style={{ padding: '12px 10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px', fontWeight: '800' }}>{o.id}</td>
                    <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: '#0d3826', fontWeight: '700' }}>{o.bagQr}</td>
                    <td style={{ padding: '12px 10px' }}>{o.customer}</td>
                    <td style={{ padding: '12px 10px' }}>{o.service}</td>
                    <td style={{ padding: '12px 10px' }}>{o.weight}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', background: '#dcfce7', color: '#166534' }}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* TAB 3: PROCESSING (STATIONS) */}
        {activeTab === 'Processing' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>🌀 Commercial Washer #1</h3>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>Running</span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                Cycle: Eco Cotton 40°C &bull; Batch: Order #FR123455
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '10px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ background: '#16a34a', width: '70%', height: '100%' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                <span>14 minutes remaining</span>
                <span>Calibrated Load: 18.5 kg</span>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>🌀 Commercial Washer #2</h3>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>Running</span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                Cycle: Deep Sanitize 60°C &bull; Batch: Order #FR123456
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '10px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ background: '#0284c7', width: '45%', height: '100%' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                <span>28 minutes remaining</span>
                <span>Calibrated Load: 22.0 kg</span>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>💨 High-Efficiency Dryer #1</h3>
                <span style={{ background: '#ffedd5', color: '#c2410c', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>Drying</span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                Cycle: Low Temp Anti-Crease Tumbler
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '10px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ background: '#f59e0b', width: '85%', height: '100%' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                <span>6 minutes remaining</span>
                <span>Calibrated Load: 15.0 kg</span>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>👔 Steam Press Station</h3>
                <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>Active Press</span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                Operator: Kailash Verma &bull; Station 3
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                16 Garments waiting for vacuum table press
              </div>
              <button
                onClick={() => showToast('Station 3 marked ready for batch handover')}
                style={{ marginTop: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                Mark Station Clear
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: QUALITY CHECK */}
        {activeTab === 'Quality Check' && (
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', maxWidth: '720px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
              Garment Quality Assurance Protocol
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              Every bag must pass strict multi-point verification before valet dispatch handover.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {[
                'Zero fabric tears, color bleeding, or mechanical snags verified',
                'Collar, cuffs, and underarm stain spots inspected under UV inspection lamp',
                'Crisp fold symmetry matching FreshRoute packaging guidelines',
                'Count reconciliation: 100% garment count match with initial intake receipt',
                'Tamper-proof QR tag re-sealed onto outer biodegradable bag'
              ].map((item, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#334155', fontWeight: '600', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#0d3826' }} />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <button
              onClick={() => showToast('✓ Batch QA Certificate #QC-9012 signed & stored')}
              style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
            >
              Sign Off Quality Certificate
            </button>
          </div>
        )}

        {/* TAB 5: PAYOUTS */}
        {activeTab === 'Payouts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Current Week Earnings (Oct 20 - Oct 26)</div>
                <div style={{ fontSize: '36px', fontWeight: '900', color: '#0d3826', marginTop: '4px' }}>₹34,800.00</div>
                <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: '700', marginTop: '4px' }}>
                  ✓ Calculated on 725 kg processed @ ₹48.00/kg
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Remittance Account</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>ICICI Bank &bull; A/c ***5206</div>
                <button
                  onClick={() => showToast('⚡ Early payout request of ₹34,800 sent to Ops Finance')}
                  style={{ marginTop: '12px', background: '#0d3826', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                >
                  Request Early Payout
                </button>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>Past Settlements</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '10px' }}>Payout Cycle</th>
                    <th style={{ padding: '10px' }}>Processed Volume</th>
                    <th style={{ padding: '10px' }}>Gross Payout</th>
                    <th style={{ padding: '10px' }}>Bank UTR</th>
                    <th style={{ padding: '10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px', fontWeight: '700' }}>Oct 13 - Oct 19, 2024</td>
                    <td style={{ padding: '12px 10px' }}>680 kg</td>
                    <td style={{ padding: '12px 10px', fontWeight: '800', color: '#0d3826' }}>₹32,640.00</td>
                    <td style={{ padding: '12px 10px', fontFamily: 'monospace' }}>CITIN249018274</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                        REALIZED
                      </span>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px', fontWeight: '700' }}>Oct 06 - Oct 12, 2024</td>
                    <td style={{ padding: '12px 10px' }}>610 kg</td>
                    <td style={{ padding: '12px 10px', fontWeight: '800', color: '#0d3826' }}>₹29,280.00</td>
                    <td style={{ padding: '12px 10px', fontFamily: 'monospace' }}>CITIN248194019</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                        REALIZED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: PROFILE */}
        {activeTab === 'Profile' && (
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', maxWidth: '640px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>
              Partner Facility Profile
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              Accredited Dark Hub & Commercial Processing Facility
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>FACILITY NAME</label>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>FreshRoute Central Dark Hub (BHL-01)</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>PHYSICAL ADDRESS</label>
                <div style={{ fontSize: '14px', color: '#334155' }}>Plot 14-B, Textile Growth Centre, RIICO Phase 2, Bhilwara 311001</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>OPERATOR / MANAGER</label>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>Rajesh Sharma (+91 98290 12345)</div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>INSTALLED CAPACITY</label>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>500 kg / day (68% utilized)</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('✓ Partner facility parameters updated')}
              style={{ marginTop: '24px', background: '#0d3826', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
            >
              Update Facility Details
            </button>
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
                  <span style={{ fontSize: '12px', color: '#64748b' }}>QR Bag Tag:</span>
                  <span style={{ fontSize: '13px', fontWeight: '900', fontFamily: 'monospace', color: '#0d3826' }}>{selectedOrder.bagQr}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Customer:</span>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>{selectedOrder.customer}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Service:</span>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>{selectedOrder.service}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Measured Load:</span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#0d3826' }}>{selectedOrder.weight}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Current Status:</span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#16a34a' }}>{selectedOrder.status}</span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>SPECIAL HANDLING NOTES</div>
                <div style={{ fontSize: '13px', color: '#334155', background: '#f1f5f9', padding: '10px 12px', borderRadius: '8px' }}>
                  {selectedOrder.notes || 'Standard wash cycle. No exceptions recorded.'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => {
                    advanceStatus(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                  style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Advance Stage →
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{ background: '#f1f5f9', color: '#334155', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
