import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function SchedulePage() {
  const [address, setAddress] = useState('B-12, Malviya Nagar, Jaipur - 302017');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Tue Oct 29');
  const [selectedSlot, setSelectedSlot] = useState('19:00 - 22:00');
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const [basket, setBasket] = useState([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('freshroute_basket');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) {
            setBasket(parsed);
            return;
          }
        } catch (e) {}
      }
      // Fallback default basket matching Panel 4
      setBasket([
        { id: 'wf', title: 'Wash & Fold', unit: 'kg', qty: 5, pricePaise: 4900 },
        { id: 'ir', title: 'Steam Ironing', unit: 'item', qty: 3, pricePaise: 2900 },
      ]);
    }
  }, []);

  const dates = [
    { label: 'Today', sub: 'Oct 28' },
    { label: 'Tue', sub: 'Oct 29' },
    { label: 'Wed', sub: 'Oct 30' },
    { label: 'Thu', sub: 'Oct 31' }
  ];

  const subtotalPaise = basket.reduce((acc, curr) => acc + curr.pricePaise * curr.qty, 0);
  const discountPaise = Math.round(subtotalPaise * 0.2); // 20% OFF
  const deliveryPaise = subtotalPaise > 29900 ? 0 : 3000;
  const totalPaise = subtotalPaise - discountPaise + deliveryPaise;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newId = 'FR' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Call backend API or simulate order creation
    try {
      await fetch('http://localhost:3001/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'cust_default',
          serviceType: basket[0]?.id || 'WASH_FOLD',
          pickupSlot: selectedSlot,
          pickupDate: selectedDate,
          address: address,
          totalPaise: totalPaise,
        }),
      });
    } catch (err) {
      // Continue locally even if disconnected
    }

    setConfirmedOrderId(newId);
    setOrderConfirmed(true);
    setIsSubmitting(false);

    if (typeof window !== 'undefined') {
      localStorage.setItem('freshroute_last_order', newId);
    }
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f8faf8', minHeight: '100vh', paddingBottom: '60px', color: '#0f172a' }}>
      <Head>
        <title>FreshRoute | Schedule Pickup</title>
      </Head>

      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ textDecoration: 'none', color: '#0d3826', fontSize: '18px', fontWeight: 'bold' }}>←</a>
        <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0d3826' }}>
          {orderConfirmed ? 'Order Confirmed' : 'Schedule Pickup'}
        </h1>
        <div style={{ width: '18px' }}></div>
      </header>

      <main style={{ maxWidth: '540px', margin: '20px auto', padding: '0 16px' }}>
        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          {['Address', 'Service', 'Schedule', 'Pay'].map((st, i) => (
            <div key={st} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                background: orderConfirmed ? '#0d3826' : (i <= 2 ? '#0d3826' : '#e2e8f0'),
                color: orderConfirmed || i <= 2 ? '#fff' : '#64748b',
                padding: '6px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                margin: '0 3px',
              }}>
                {st}
              </div>
            </div>
          ))}
        </div>

        {orderConfirmed ? (
          /* Order Confirmed View matching Panel 6 */
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '26px' }}>
                ✓
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0d3826', marginBottom: '4px' }}>Order Confirmed</h2>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Order ID: <b>#{confirmedOrderId}</b></div>
            </div>

            {/* Bag Tag Card */}
            <div style={{ background: '#fdfbf7', border: '1px dashed #d1c7b7', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#527867' }}>TAMPER-PROOF QR BAG ASSIGNED</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#0d3826', margin: '4px 0', letterSpacing: '1px' }}>{confirmedOrderId}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Valet arrives with eco-friendly canvas bag</div>
            </div>

            {/* Order Total & Breakdown toggle */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Order Total</div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#0d3826' }}>₹{(totalPaise / 100).toFixed(0)}</div>
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                style={{ background: 'none', border: 'none', fontSize: '12px', color: '#16a34a', fontWeight: '700', cursor: 'pointer', marginTop: '4px' }}
              >
                {showBreakdown ? 'Hide Breakdown ▲' : 'View Breakdown ▼'}
              </button>

              {showBreakdown && (
                <div style={{ marginTop: '12px', background: '#f8fafc', padding: '14px', borderRadius: '10px', fontSize: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Subtotal</span>
                    <span>₹{(subtotalPaise / 100).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', marginBottom: '4px' }}>
                    <span>Promo Discount (20%)</span>
                    <span>-₹{(discountPaise / 100).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Valet Pickup & Delivery</span>
                    <span>₹{(deliveryPaise / 100).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid #cbd5e1', paddingTop: '6px', marginTop: '6px' }}>
                    <span>Total Amount</span>
                    <span>₹{(totalPaise / 100).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* UPI Selection matching Panel 6 */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>UPI Recommended</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Google Pay', icon: '🟢', id: 'gpay' },
                  { name: 'PhonePe', icon: '🟣', id: 'phonepe' },
                  { name: 'Paytm UPI', icon: '🔵', id: 'paytm' },
                  { name: 'Credit/Debit Card', icon: '💳', id: 'card' },
                  { name: 'Cash on Delivery', icon: '💵', id: 'cod' },
                ].map((m) => (
                  <label key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: paymentMethod === m.id ? '2px solid #0d3826' : '1px solid #e2e8f0', borderRadius: '12px', background: paymentMethod === m.id ? '#f0fdf4' : '#fff', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '700' }}>
                      <span>{m.icon}</span>
                      <span>{m.name}</span>
                    </div>
                    <input type="radio" name="pay" checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} />
                  </label>
                ))}
              </div>
            </div>

            <a
              href={`/track?orderId=${confirmedOrderId}`}
              style={{
                display: 'block',
                textAlign: 'center',
                background: '#0d3826',
                color: '#fff',
                textDecoration: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '15px',
                marginBottom: '12px'
              }}
            >
              Pay ₹{(totalPaise / 100).toFixed(0)} & Track Valet →
            </a>
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>
              🔒 Secure payment powered by Razorpay
            </div>
          </div>
        ) : (
          /* Schedule Form */
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Address Card */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>🏠 Home Address</span>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  style={{ border: 'none', background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
                >
                  {isEditingAddress ? 'Done' : 'Change'}
                </button>
              </div>

              {isEditingAddress ? (
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              ) : (
                <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.4 }}>
                  {address}
                </div>
              )}
            </div>

            {/* Preferred Pickup Date Chips */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
                Preferred Pickup Date
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {dates.map((d) => (
                  <button
                    key={d.sub}
                    type="button"
                    onClick={() => setSelectedDate(`${d.label} ${d.sub}`)}
                    style={{
                      background: selectedDate === `${d.label} ${d.sub}` ? '#0d3826' : '#ffffff',
                      color: selectedDate === `${d.label} ${d.sub}` ? '#ffffff' : '#0f172a',
                      border: selectedDate === `${d.label} ${d.sub}` ? '1.5px solid #0d3826' : '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '10px 4px',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: '600' }}>{d.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: '800' }}>{d.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Window */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                Pickup Window
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: selectedSlot === '19:00 - 22:00' ? '2px solid #16a34a' : '1px solid #e2e8f0', borderRadius: '10px', background: selectedSlot === '19:00 - 22:00' ? '#f0fdf4' : '#fff', cursor: 'pointer' }}>
                  <input type="radio" name="slot" checked={selectedSlot === '19:00 - 22:00'} onChange={() => setSelectedSlot('19:00 - 22:00')} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0d3826' }}>7:00 PM – 10:00 PM (Evening Prime)</div>
                    <div style={{ fontSize: '11px', color: '#166534' }}>After-work quick valet arrival</div>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: selectedSlot === '10:00 - 13:00' ? '2px solid #16a34a' : '1px solid #e2e8f0', borderRadius: '10px', background: selectedSlot === '10:00 - 13:00' ? '#f0fdf4' : '#fff', cursor: 'pointer' }}>
                  <input type="radio" name="slot" checked={selectedSlot === '10:00 - 13:00'} onChange={() => setSelectedSlot('10:00 - 13:00')} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0d3826' }}>10:00 AM – 1:00 PM (Morning Window)</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Weekend & daytime pickup</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Cart Estimate */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '18px 20px', fontSize: '13px' }}>
              <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '10px', color: '#0d3826' }}>Selected Items</div>
              {basket.map((it) => (
                <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', color: '#334155' }}>{it.title} ({it.qty} {it.unit})</span>
                  <span style={{ fontWeight: '800' }}>₹{((it.pricePaise * it.qty) / 100).toFixed(0)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontWeight: '900', fontSize: '16px', color: '#0d3826' }}>
                <span>Estimated Total (after 20% discount)</span>
                <span>₹{(totalPaise / 100).toFixed(0)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: '#0d3826',
                color: '#fff',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '15px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(13, 56, 38, 0.25)'
              }}
            >
              {isSubmitting ? 'Confirming with Dark Hub...' : 'Confirm Order & Select Payment →'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
