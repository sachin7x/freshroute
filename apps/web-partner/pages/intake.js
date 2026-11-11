import React, { useState } from 'react';
import Head from 'next/head';

export default function BagIntakePage() {
  const [qrCode, setQrCode] = useState('FRDYO9I8');
  const [weightKg, setWeightKg] = useState('4.5');
  const [itemCount, setItemCount] = useState('12');
  const [service, setService] = useState('Wash & Fold');
  const [notes, setNotes] = useState('Bhilwara pilot order. All whites separated.');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Persist to localStorage for live synchronization with partner index queue
    try {
      const stored = localStorage.getItem('freshroute_partner_orders');
      let orders = stored ? JSON.parse(stored) : [];
      const newOrder = {
        id: 'FR' + Math.floor(100000 + Math.random() * 900000),
        service: `${service} (${weightKg} kg)`,
        weight: `${weightKg} kg (${itemCount} pcs)`,
        status: 'In Processing',
        badge: 'sage',
        customer: 'Intake Bag #' + qrCode.slice(-4),
        bagQr: qrCode,
        notes: notes,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      orders = [newOrder, ...orders];
      localStorage.setItem('freshroute_partner_orders', JSON.stringify(orders));
    } catch (err) {
      console.warn('Storage sync error', err);
    }

    setMessage(`✅ Bag ${qrCode} logged at ${weightKg} kg (${itemCount} garments). Transferred to wash cycle!`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Head>
        <title>FreshRoute Partner | Bag Intake & Weighing</title>
      </Head>

      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#0d3826', color: '#fff', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            🌿
          </div>
          <span style={{ fontSize: '18px', fontWeight: '900', color: '#0d3826' }}>FreshRoute Partner</span>
        </a>
        <a href="/" style={{ textDecoration: 'none', color: '#0d3826', fontSize: '13px', fontWeight: '800' }}>
          ← Back to Live Queue
        </a>
      </header>

      <main style={{ maxWidth: '560px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              ⚖️
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>Bag Intake & Precision Weighing</h2>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Hub BHL-01 / JPR-01 Calibrated Station</p>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
            Verify customer tamper-proof QR tag and record calibrated scale measurements before wash cycle initiation.
          </p>

          {message && (
            <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', marginBottom: '20px' }}>
              <div>{message}</div>
              <div style={{ marginTop: '8px' }}>
                <a href="/" style={{ color: '#0d3826', textDecoration: 'underline', fontWeight: '900' }}>
                  Open Queue & Verify Stage →
                </a>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  QR Bag Identifier
                </label>
                <button
                  type="button"
                  onClick={() => setQrCode('FR' + Math.random().toString(36).substring(2, 8).toUpperCase())}
                  style={{ background: 'none', border: 'none', color: '#16a34a', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  ⚡ Simulate Camera QR Scan
                </button>
              </div>
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', fontFamily: 'monospace', fontWeight: '800', outline: 'none' }}
                placeholder="Scan or enter QR code"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Service Category
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff' }}
              >
                <option value="Wash & Fold">Wash & Fold</option>
                <option value="Wash & Iron">Wash & Iron</option>
                <option value="Dry Cleaning">Dry Cleaning</option>
                <option value="Shoe Care">Shoe Care</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Calibrated Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Total Garment Count
                </label>
                <input
                  type="number"
                  value={itemCount}
                  onChange={(e) => setItemCount(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Fabric / Stain Discrepancy Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: '#0d3826',
                color: '#fff',
                border: 'none',
                padding: '13px',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                marginTop: '6px',
                boxShadow: '0 4px 12px rgba(13,56,38,0.2)'
              }}
            >
              Confirm Intake & Begin Washing
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
