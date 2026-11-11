import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function TrackPage() {
  const [orderId, setOrderId] = useState('FR123456');
  const [inputOrderId, setInputOrderId] = useState('');
  const [stageIndex, setStageIndex] = useState(2); // 0 to 4
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get('orderId');
      if (queryId) {
        setOrderId(queryId);
      } else {
        const last = localStorage.getItem('freshroute_last_order');
        if (last) setOrderId(last);
      }
    }
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const stages = [
    { title: 'Order Confirmed', time: 'Today, 10:00 AM', desc: 'Order received at Jaipur Hub' },
    { title: 'Pickup Scheduled', time: 'Today, 02:00 PM', desc: 'Valet assigned: Ramesh Kumar' },
    { title: 'Picked Up (Bag Scanned)', time: 'Today, 02:15 PM', desc: 'Sealed in canvas QR bag' },
    { title: 'In Processing (Dark Hub Wash)', time: 'Today, 06:30 PM', desc: 'Weighed on digital scale (4.5 kg) & washed' },
    { title: 'Out for Delivery', time: 'Tomorrow, 07:00 PM', desc: 'Valet out for evening delivery' },
    { title: 'Delivered & Handed Over', time: 'Pending', desc: 'Signed and delivered at doorstep' },
  ];

  const advanceStage = () => {
    if (stageIndex < stages.length - 1) {
      const next = stageIndex + 1;
      setStageIndex(next);
      showToast(`⚡ Order status updated to: ${stages[next].title}`);
    } else {
      showToast('✓ Order is already fully Delivered!');
    }
  };

  const handleSearchOrder = (e) => {
    e.preventDefault();
    if (inputOrderId.trim()) {
      setOrderId(inputOrderId.trim().toUpperCase());
      setInputOrderId('');
      setStageIndex(1);
      showToast(`🔍 Loaded tracking for #${inputOrderId.trim().toUpperCase()}`);
    }
  };

  const downloadReceipt = () => {
    const content = `FRESHROUTE LAUNDRY RECEIPT
=============================
Order ID: #${orderId}
Date: ${new Date().toLocaleDateString('en-IN')}
Status: ${stages[stageIndex].title}
Address: B-12, Malviya Nagar, Jaipur - 302017
Valet: Ramesh Kumar (+91 98290 12345)
-----------------------------
1. Wash & Fold (5 kg): ₹245.00
2. Steam Ironing (3 pcs): ₹87.00
-----------------------------
Subtotal: ₹332.00
Discount (FRESH20): -₹66.40
Valet Delivery: FREE
Total Paid: ₹265.60 (UPI)
=============================
Thank you for choosing FreshRoute!`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FreshRoute_Receipt_${orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📄 Receipt downloaded successfully!');
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f8faf8', minHeight: '100vh', paddingBottom: '60px', color: '#0f172a' }}>
      <Head>
        <title>FreshRoute | Track Order #{orderId}</title>
      </Head>

      {/* Floating Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', background: '#0d3826', color: '#fff', padding: '10px 20px', borderRadius: '24px', fontSize: '13px', fontWeight: '700', zIndex: 1000, boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none', color: '#0d3826', fontSize: '18px', fontWeight: 'bold' }}>←</a>
        <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0d3826' }}>Order Tracking</h1>
        <div style={{ width: '18px' }}></div>
      </header>

      <main style={{ maxWidth: '540px', margin: '20px auto', padding: '0 16px' }}>
        {/* Order Search Bar */}
        <form onSubmit={handleSearchOrder} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by Order ID (e.g. FR123456)"
            value={inputOrderId}
            onChange={(e) => setInputOrderId(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', background: '#fff', outline: 'none' }}
          />
          <button
            type="submit"
            style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '0 18px', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
          >
            Track
          </button>
        </form>

        {/* QR Bag Identifier Card */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>CANVAS LAUNDRY BAG QR</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#0d3826', letterSpacing: '0.5px' }}>{orderId}</div>
            </div>
            <span style={{
              background: stageIndex >= 5 ? '#dcfce7' : '#ffedd5',
              color: stageIndex >= 5 ? '#166534' : '#c2410c',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '800'
            }}>
              ● {stages[stageIndex].title}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
            Address: B-12, Malviya Nagar, Jaipur - 302017
          </div>
        </div>

        {/* Expected Delivery Banner */}
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>📅</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>Expected Delivery</div>
              <div style={{ fontSize: '15px', fontWeight: '900', color: '#0d3826' }}>Tomorrow, 7:00 PM – 10:00 PM</div>
            </div>
          </div>
          <button
            onClick={downloadReceipt}
            style={{ background: '#fff', border: '1px solid #16a34a', color: '#166534', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            Invoice ↓
          </button>
        </div>

        {/* Live Stepper Timeline */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '24px 20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#0d3826' }}>Tracking Progress</h3>
            <button
              onClick={advanceStage}
              style={{ background: '#f0fdf4', border: '1px solid #16a34a', color: '#166534', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
            >
              Simulate Next Step ⚡
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {stages.map((st, idx) => {
              const isDone = idx <= stageIndex;
              const isCurrent = idx === stageIndex;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: isDone ? '#16a34a' : '#e2e8f0',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginTop: '2px',
                    boxShadow: isCurrent ? '0 0 0 4px #dcfce7' : 'none'
                  }}>
                    {isDone ? '✓' : ''}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: isDone ? '800' : '500', color: isDone ? '#0d3826' : '#94a3b8' }}>
                      {st.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{st.desc}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>{st.time}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Valet Contact Card */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>ASSIGNED VALET</div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Ramesh Kumar</div>
            <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>+91 98290 12345 &bull; Two-Wheeler 🛵</div>
          </div>
          <a
            href="tel:+919829012345"
            style={{ background: '#0d3826', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '800' }}
          >
            Call Valet
          </a>
        </div>
      </main>
    </div>
  );
}
