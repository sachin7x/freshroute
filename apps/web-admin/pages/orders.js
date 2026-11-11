import React, { useState } from 'react';
import Head from 'next/head';

export default function OrdersPage() {
  const [orders, setOrders] = useState([
    { id: 'FRMWC76KPG', customer: '+919876543212', city: 'Bhilwara', amount: '₹442.50', status: 'DELIVERED', qr: 'FRDYO9I8', valet: 'Ramesh Kumar' },
    { id: 'FR8XJ2K9L1', customer: '+919829011223', city: 'Bhilwara', amount: '₹620.00', status: 'RECEIVED_AT_HUB', qr: 'FR90K2M1', valet: 'Ramesh Kumar' },
    { id: 'FR7Y10L4M9', customer: '+919414055667', city: 'Kishangarh', amount: '₹349.00', status: 'PICKED_UP', qr: 'FR88L1N2', valet: 'Unassigned' },
    { id: 'FR4B88K1Z0', customer: '+919829077889', city: 'Jaipur', amount: '₹890.00', status: 'CONFIRMED', qr: 'FR12A3B4', valet: 'Unassigned' },
  ]);

  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${id} status changed to ${newStatus}`);
  };

  const assignValet = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, valet: 'Ramesh Kumar', status: 'PICKUP_ASSIGNED' } : o))
    );
    showToast(`Assigned Ramesh Kumar to Order #${id}`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Head>
        <title>FreshRoute Admin | Order Management</title>
      </Head>

      {toast && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', background: '#0d3826', color: '#fff', padding: '10px 22px', borderRadius: '24px', fontSize: '13px', fontWeight: '800', zIndex: 1000, boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      <aside style={{ width: '250px', background: '#0d3826', color: '#ecfdf5', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', paddingLeft: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px' }}>🌿</span>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>FreshRoute</div>
            <div style={{ fontSize: '11px', color: '#a7f3d0', fontWeight: '600' }}>Admin Command</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', borderRadius: '10px', color: '#a7f3d0', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            <span>🏠</span> <span>Dashboard</span>
          </a>
          <a href="/orders" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', borderRadius: '10px', background: '#19563c', color: '#ffffff', textDecoration: 'none', fontWeight: '800', fontSize: '14px' }}>
            <span>📋</span> <span>Orders</span>
          </a>
          <a href="/serviceability" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', borderRadius: '10px', color: '#a7f3d0', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            <span>📍</span> <span>Zones & PINs</span>
          </a>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '32px 40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>Order Dispatch & Control</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>Assign valets, update state machines, and track physical laundry bags.</p>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '12px 8px' }}>Order ID</th>
                <th style={{ padding: '12px 8px' }}>QR Tag</th>
                <th style={{ padding: '12px 8px' }}>Customer</th>
                <th style={{ padding: '12px 8px' }}>City</th>
                <th style={{ padding: '12px 8px' }}>Valet</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px', fontWeight: '800' }}>{ord.id}</td>
                  <td style={{ padding: '12px 8px', fontFamily: 'monospace', color: '#0d3826', fontWeight: '700' }}>{ord.qr}</td>
                  <td style={{ padding: '12px 8px' }}>{ord.customer}</td>
                  <td style={{ padding: '12px 8px' }}>{ord.city}</td>
                  <td style={{ padding: '12px 8px', fontWeight: ord.valet === 'Unassigned' ? 'normal' : '700', color: ord.valet === 'Unassigned' ? '#94a3b8' : '#0d3826' }}>
                    {ord.valet}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <select
                      value={ord.status}
                      onChange={(e) => updateStatus(ord.id, e.target.value)}
                      style={{ padding: '5px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: '700', background: '#fff' }}
                    >
                      <option value="CREATED">CREATED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PICKUP_ASSIGNED">PICKUP_ASSIGNED</option>
                      <option value="PICKED_UP">PICKED_UP</option>
                      <option value="RECEIVED_AT_HUB">RECEIVED_AT_HUB</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="QUALITY_CHECK">QUALITY_CHECK</option>
                      <option value="READY_FOR_DELIVERY">READY_FOR_DELIVERY</option>
                      <option value="DELIVERY_ASSIGNED">DELIVERY_ASSIGNED</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    {ord.valet === 'Unassigned' ? (
                      <button
                        onClick={() => assignValet(ord.id)}
                        style={{ padding: '5px 12px', background: '#0d3826', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Assign Valet
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700' }}>✓ Dispatched</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
