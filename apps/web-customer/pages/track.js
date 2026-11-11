import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function TrackPage() {
  const [orderId, setOrderId] = useState('FR123456');
  const [inputOrderId, setInputOrderId] = useState('');
  const [stageIndex, setStageIndex] = useState(4); // Default to Out for Delivery (stage 4) to showcase live map
  const [toast, setToast] = useState('');

  // Blinkit Live Map Telemetry State
  const [progress, setProgress] = useState(0.45); // 0.0 (Hub) to 1.0 (Customer Home)
  const [isSimulating, setIsSimulating] = useState(true);
  const [etaMins, setEtaMins] = useState(8);
  const [distanceKm, setDistanceKm] = useState(1.4);
  const [valetSpeed, setValetSpeed] = useState(26);

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

  // Live Valet Movement Simulation (Blinkit style)
  useEffect(() => {
    if (!isSimulating || stageIndex < 3 || stageIndex >= 5) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.98) {
          setIsSimulating(false);
          setEtaMins(0);
          setDistanceKm(0);
          setStageIndex(5); // Delivered
          showToast('🎉 Valet Ramesh Kumar has arrived at your doorstep!');
          return 1.0;
        }
        const next = prev + 0.035;
        const remainingRatio = 1.0 - next;
        setEtaMins(Math.max(1, Math.round(remainingRatio * 15)));
        setDistanceKm(Math.max(0.1, Number((remainingRatio * 3.2).toFixed(1))));
        setValetSpeed(Math.floor(22 + Math.random() * 8));
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, stageIndex]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const stages = [
    { title: 'Order Confirmed', time: 'Today, 10:00 AM', desc: 'Order received at Jaipur Hub' },
    { title: 'Pickup Scheduled', time: 'Today, 02:00 PM', desc: 'Valet assigned: Ramesh Kumar' },
    { title: 'Picked Up (Bags Scanned)', time: 'Today, 02:15 PM', desc: 'Sealed in 3 Rinse-style color bags' },
    { title: 'In Processing (Dark Hub)', time: 'Today, 06:30 PM', desc: 'Calibrated wash & steam cycle' },
    { title: 'Out for Delivery (Live GPS)', time: 'Live Now', desc: 'Valet on electric scooter heading to you' },
    { title: 'Delivered & Handed Over', time: 'Pending', desc: 'Signed or left at FreshDrop location' },
  ];

  const advanceStage = () => {
    if (stageIndex < stages.length - 1) {
      const next = stageIndex + 1;
      setStageIndex(next);
      if (next === 4) {
        setProgress(0.2);
        setIsSimulating(true);
        setEtaMins(12);
        setDistanceKm(2.8);
      }
      showToast(`⚡ Order status updated to: ${stages[next].title}`);
    } else {
      showToast('✓ Order is already fully Delivered!');
    }
  };

  const restartSimulation = () => {
    setStageIndex(4);
    setProgress(0.1);
    setIsSimulating(true);
    setEtaMins(14);
    setDistanceKm(3.0);
    showToast('🛵 Valet live movement simulation restarted');
  };

  const downloadReceipt = () => {
    const content = `FRESHROUTE LAUNDRY COMMERCE RECEIPT
================================================
Order ID: #${orderId}
Date: ${new Date().toLocaleDateString('en-IN')}
Status: ${stages[stageIndex].title}
Customer: Aarav Sharma (+91 98765 43212)
Delivery Address: B-12, Malviya Nagar, Jaipur - 302017
Valet: Ramesh Kumar (+91 98290 12345) • Hero Electric
FreshDrop Mode: Leave with Society Gatekeeper / Doorstep
------------------------------------------------
RINSE 3-BAG SYSTEM BREAKDOWN:
• ⬛ Black Bag #FRDYO9I8 : Wash & Fold (4.5 kg): ₹245.00
• ⬜ White Bag #FRW88L1N : Dry Clean & Press (3 items): ₹297.00
• 🟦 Teal Bag  #FRT90K2M : Delicate Hang Dry (2 items): ₹150.00
------------------------------------------------
Subtotal: ₹692.00
Promo Discount (FRESH20): -₹138.40
Valet Doorstep Quick Delivery: FREE (Orders > ₹499)
Total Paid: ₹553.60 (UPI Captured)
================================================
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

  // Route Coordinates interpolation on map canvas
  // Waypoints from Jaipur Dark Hub to Customer Home (Malviya Nagar)
  const p0 = { x: 40, y: 50 };   // Hub JPR-01
  const p1 = { x: 120, y: 70 };  // Gaurav Tower Intersection
  const p2 = { x: 190, y: 150 }; // JLN Marg
  const p3 = { x: 280, y: 180 }; // Malviya Nagar Ring Road
  const p4 = { x: 350, y: 240 }; // Customer Home

  // Compute live scooter position based on progress
  const getScooterPos = (t) => {
    if (t <= 0.25) {
      const u = t / 0.25;
      return { x: p0.x + (p1.x - p0.x) * u, y: p0.y + (p1.y - p0.y) * u };
    } else if (t <= 0.5) {
      const u = (t - 0.25) / 0.25;
      return { x: p1.x + (p2.x - p1.x) * u, y: p1.y + (p2.y - p1.y) * u };
    } else if (t <= 0.75) {
      const u = (t - 0.5) / 0.25;
      return { x: p2.x + (p3.x - p2.x) * u, y: p2.y + (p3.y - p2.y) * u };
    } else {
      const u = (t - 0.75) / 0.25;
      return { x: p3.x + (p4.x - p3.x) * u, y: p3.y + (p4.y - p3.y) * u };
    }
  };

  const scooterPos = getScooterPos(Math.min(1.0, Math.max(0.0, progress)));

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f8fafc', minHeight: '100vh', paddingBottom: '70px', color: '#0f172a' }}>
      <Head>
        <title>FreshRoute | Live Valet Tracking #{orderId}</title>
      </Head>

      {/* Floating Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', background: '#0d3826', color: '#fff', padding: '10px 22px', borderRadius: '24px', fontSize: '13px', fontWeight: '800', zIndex: 1000, boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 90 }}>
        <a href="/" style={{ textDecoration: 'none', color: '#0d3826', fontSize: '18px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>←</span>
          <span style={{ fontSize: '15px' }}>FreshRoute</span>
        </a>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: '900', color: '#0d3826' }}>Live Valet Tracking</div>
          <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700' }}>● GPS Satellite Connected</div>
        </div>
        <button
          onClick={restartSimulation}
          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}
        >
          🔄 Reset Route
        </button>
      </header>

      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '16px' }}>

        {/* ========================================================================= */}
        {/* BLINKIT-STYLE LIVE INTERACTIVE VECTOR MAP CANVAS */}
        {/* ========================================================================= */}
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', overflow: 'hidden', marginBottom: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', position: 'relative' }}>
          
          {/* Top Floating ETA Badge (Blinkit Signature) */}
          <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: 'rgba(13, 56, 38, 0.95)', backdropFilter: 'blur(8px)', color: '#ffffff', padding: '8px 16px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <span style={{ fontSize: '16px' }}>⚡</span>
              <div>
                <span style={{ fontSize: '13px', fontWeight: '900' }}>
                  {stageIndex >= 5 ? 'Arrived at Doorstep!' : `Arriving in ${etaMins} mins`}
                </span>
                <span style={{ fontSize: '11px', color: '#a7f3d0', marginLeft: '6px' }}>
                  ({distanceKm} km away)
                </span>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '6px 12px', borderRadius: '20px', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: '800', color: '#0d3826', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              🛵 {valetSpeed} km/h EV
            </div>
          </div>

          {/* SVG Map Canvas with Landmarks & Streets */}
          <div style={{ width: '100%', height: '320px', background: '#eaf4eb', position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
              {/* Background Map Grid & Roads */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d5e8d8" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="#edf7ee" />
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Park & Greenery Polygon */}
              <path d="M 220 20 Q 280 40 320 20 L 360 90 L 250 110 Z" fill="#d4edda" stroke="#b2d8b8" strokeWidth="1" />
              <text x="270" y="70" fontSize="10" fill="#2d6a4f" fontWeight="700">Central Park (Jaipur)</text>

              {/* Secondary City Streets */}
              <path d="M 0 100 L 400 120" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
              <path d="M 120 0 L 140 300" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
              <path d="M 240 0 L 220 300" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
              <path d="M 0 220 L 400 210" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />

              {/* Street Labels */}
              <text x="10" y="94" fontSize="9" fill="#718096" fontWeight="600">JLN Marg</text>
              <text x="146" y="25" fontSize="9" fill="#718096" fontWeight="600">Gaurav Tower Ave</text>
              <text x="15" y="214" fontSize="9" fill="#718096" fontWeight="600">Malviya Nagar Ring Rd</text>

              {/* Main Delivery Route (Dark Green glow line) */}
              <path
                d="M 40 50 Q 120 70 190 150 T 280 180 T 350 240"
                fill="none"
                stroke="#16a34a"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="6,4"
              />

              {/* Origin Marker: Dark Hub BHL-01 / JPR-01 */}
              <circle cx={p0.x} cy={p0.y} r="14" fill="#0d3826" />
              <text x={p0.x - 6} y={p0.y + 4} fontSize="11" fill="#ffffff" fontWeight="bold">🧺</text>
              <text x={p0.x - 20} y={p0.y - 18} fontSize="10" fill="#0d3826" fontWeight="800">Jaipur Dark Hub</text>

              {/* Destination Marker: Customer Home */}
              <circle cx={p4.x} cy={p4.y} r="16" fill="#ef4444" />
              <circle cx={p4.x} cy={p4.y} r="24" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x={p4.x - 6} y={p4.y + 4} fontSize="12" fill="#ffffff" fontWeight="bold">🏠</text>
              <text x={p4.x - 45} y={p4.y + 32} fontSize="10" fill="#0f172a" fontWeight="800">B-12, Malviya Nagar</text>

              {/* Live Moving Valet Scooter Marker (Animated) */}
              <g transform={`translate(${scooterPos.x}, ${scooterPos.y})`}>
                {/* Radar Wave Glow Pulse */}
                <circle cx="0" cy="0" r="18" fill="rgba(22, 163, 74, 0.25)">
                  <animate attributeName="r" values="14;24;14" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
                </circle>

                {/* Valet Pin Circle */}
                <circle cx="0" cy="0" r="13" fill="#ffffff" stroke="#16a34a" strokeWidth="2.5" />
                <text x="-7" y="4" fontSize="12">🛵</text>
              </g>
            </svg>

            {/* Bottom Map Overlay Bar */}
            <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a', animation: 'pulse 1.5s infinite' }}></div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#0d3826' }}>
                  {stageIndex >= 5 ? 'Doorstep Handover Complete' : 'Live Route Optimization Active'}
                </span>
              </div>
              <button
                onClick={advanceStage}
                style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
              >
                Fast-Forward ⚡
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VALET PROFILE CARD (BLINKIT PARITY) */}
        {/* ========================================================================= */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0', padding: '18px 20px', marginBottom: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '2px solid #bbf7d0' }}>
                🛵
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>Ramesh Kumar</span>
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>★ 4.9 (640+)</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Hero Electric NYX &bull; RJ 14 EV 2026
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href="tel:+919829012345"
                style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0d3826', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '16px', boxShadow: '0 2px 6px rgba(13,56,38,0.3)' }}
                title="Call Valet"
              >
                📞
              </a>
              <a
                href="https://wa.me/919829012345?text=Hi%20Ramesh,%20regarding%20my%20FreshRoute%20Order%20FR123456"
                target="_blank"
                rel="noreferrer"
                style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '18px', boxShadow: '0 2px 6px rgba(37,211,102,0.3)' }}
                title="WhatsApp Valet"
              >
                💬
              </a>
            </div>
          </div>

          {/* Safety & Hygiene Badge */}
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#166534', fontWeight: '700' }}>
            <span>✓ Verified Valet &amp; Temperature Checked (98.2°F)</span>
            <span>✓ Tamper-Sealed Bags</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RINSE.COM 3-BAG SYSTEM MANIFEST (COLOR-CODED BAG STATUS) */}
        {/* ========================================================================= */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0', padding: '20px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#0d3826' }}>
              Rinse 3-Bag System Manifest
            </h3>
            <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '10px', fontWeight: '800' }}>
              3 Bags In Order
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* 1. Black Bag: Wash & Fold */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #0f172a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>⬛</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>Black Bag: Wash &amp; Fold</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>QR: #FRDYO9I8 &bull; 4.5 kg (Lights/Darks Separated)</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a' }}>Cleaned &amp; Folded</span>
            </div>

            {/* 2. White Bag: Dry Clean & Press */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>⬜</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>White Bag: Dry Clean &amp; Press</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>QR: #FRW88L1N &bull; 3 items (On Custom Hangers)</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a' }}>Steam Pressed</span>
            </div>

            {/* 3. Teal Bag: Delicate Hang Dry */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #0284c7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>🟦</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>Teal Bag: Delicate Hang Dry</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>QR: #FRT90K2M &bull; 2 Gym garments (Cold air dried)</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a' }}>Air Dried</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FRESHDROP UNATTENDED CONCIERGE CARD (RINSE DROP PARITY) */}
        {/* ========================================================================= */}
        <div style={{ background: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0', padding: '16px 18px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
              FreshDrop (Rinse Drop Mode)
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0d3826', marginTop: '2px' }}>
              Leave with Society Gatekeeper / Doorstep
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
              Instructions: "Hand over sealed bags to Guard Bahadur at Tower B Gate"
            </div>
          </div>
          <button
            onClick={downloadReceipt}
            style={{ background: '#fff', border: '1px solid #16a34a', color: '#166534', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
          >
            Invoice ↓
          </button>
        </div>

        {/* ========================================================================= */}
        {/* STEPPER PROGRESS */}
        {/* ========================================================================= */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0', padding: '22px 20px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#0d3826' }}>Order Milestones</h3>
            <button
              onClick={advanceStage}
              style={{ background: '#f0fdf4', border: '1px solid #16a34a', color: '#166534', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
            >
              Simulate Next Step ⚡
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

      </main>
    </div>
  );
}
