import React, { useState } from 'react';
import Head from 'next/head';

export default function ServiceabilityPage() {
  const [zones, setZones] = useState([
    { id: 'Z1', city: 'Bhilwara', code: 'BHL-CENTRAL', pincodes: ['311001', '311002'], hub: 'Dark Hub BHL-01', active: true },
    { id: 'Z2', city: 'Kishangarh', code: 'KSG-CENTRAL', pincodes: ['305801', '305802'], hub: 'Dark Hub KSG-01', active: true },
    { id: 'Z3', city: 'Jaipur', code: 'JPR-MALVIYA', pincodes: ['302017'], hub: 'Jaipur SuperHub', active: true },
    { id: 'Z4', city: 'Jaipur', code: 'JPR-VAISHALI', pincodes: ['302021'], hub: 'Jaipur SuperHub', active: true },
  ]);

  const toggleZone = (id) => {
    setZones(prev =>
      prev.map(z => z.id === id ? { ...z, active: !z.active } : z)
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Head>
        <title>FreshRoute Admin | Zones & Serviceability</title>
      </Head>

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
          <a href="/orders" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', borderRadius: '10px', color: '#a7f3d0', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            <span>📋</span> <span>Orders</span>
          </a>
          <a href="/serviceability" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', borderRadius: '10px', background: '#19563c', color: '#ffffff', textDecoration: 'none', fontWeight: '800', fontSize: '14px' }}>
            <span>📍</span> <span>Zones & PINs</span>
          </a>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '32px 40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>Service Zones & Geographic Routing</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>Multi-city expansion matrix for Bhilwara, Kishangarh, and Jaipur.</p>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '12px 8px' }}>City</th>
                <th style={{ padding: '12px 8px' }}>Zone Code</th>
                <th style={{ padding: '12px 8px' }}>Supported PIN Codes</th>
                <th style={{ padding: '12px 8px' }}>Fulfillment Hub</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 8px', fontWeight: '700' }}>{z.city}</td>
                  <td style={{ padding: '14px 8px', fontFamily: 'monospace', color: '#0d3826', fontWeight: '700' }}>{z.code}</td>
                  <td style={{ padding: '14px 8px' }}>{z.pincodes.join(', ')}</td>
                  <td style={{ padding: '14px 8px' }}>{z.hub}</td>
                  <td style={{ padding: '14px 8px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', background: z.active ? '#dcfce7' : '#fee2e2', color: z.active ? '#166534' : '#b91c1c' }}>
                      {z.active ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 8px' }}>
                    <button
                      onClick={() => toggleZone(z.id)}
                      style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      {z.active ? 'Pause' : 'Activate'}
                    </button>
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
