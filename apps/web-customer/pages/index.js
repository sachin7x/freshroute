import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function CustomerHome() {
  const [city, setCity] = useState('Jaipur, Rajasthan');
  const [pincode, setPincode] = useState('302017');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [customPincode, setCustomPincode] = useState('302017');
  const [pinStatus, setPinStatus] = useState('Serviceable');
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [basket, setBasket] = useState([]);
  const [couponCode, setCouponCode] = useState('FRESH20');
  const [toast, setToast] = useState('');

  const catalog = [
    {
      id: 'wf',
      title: 'Wash & Fold (Black Bag)',
      tagline: 'Everyday clothes, auto-sorted lights & darks, folded crisp',
      pricePaise: 4900,
      priceFormatted: '₹49/kg',
      unit: 'kg',
      icon: '⬛',
      badge: 'Rinse Black Bag',
      features: ['Hypoallergenic wash', 'Lights & darks separated', 'Tumble dry low', 'Folded & packaged in eco-pack', '48h standard turnaround']
    },
    {
      id: 'dc',
      title: 'Dry Clean & Press (White Bag)',
      tagline: 'Suits, blazers, sarees & dresses returned on custom hangers',
      pricePaise: 9900,
      priceFormatted: 'From ₹99/item',
      unit: 'item',
      icon: '⬜',
      badge: 'Rinse White Bag',
      features: ['Gentle solvent cleaning', 'Hand stain spot treatment', 'Delivered on premium hangers', 'Protective breathable garment covers', 'Formals & silks']
    },
    {
      id: 'hd',
      title: 'Delicate Hang Dry (Teal Bag)',
      tagline: 'Gym activewear, lululemon, swimsuits & woolens dried with zero heat',
      pricePaise: 7900,
      priceFormatted: 'From ₹79/item',
      unit: 'item',
      icon: '🟦',
      badge: 'Rinse Teal Bag',
      features: ['Zero tumble heat', 'Ambient cold air drying', 'Prevents elastic damage & shrinkage', 'Sports apparel & swimwear', 'Fine wools & cashmere']
    },
    {
      id: 'ftb',
      title: 'Fill-The-Bag (Flat Rate)',
      tagline: 'Rinse famous flat rate: Stuff it as full as it zips!',
      pricePaise: 34900,
      priceFormatted: 'Flat ₹349 / bag',
      unit: 'bag',
      icon: '🎒',
      badge: 'Most Value',
      features: ['Zero per-kg weighing hassle', 'Flex Bag (up to 5 kg) ₹349', 'Family Bag (up to 10 kg) ₹599', 'Complete wash, dry & fold', 'Next evening delivery']
    },
    {
      id: 'ir',
      title: 'Boiler Steam Ironing',
      tagline: 'Commercial high-pressure boiler steam pressing',
      pricePaise: 2500,
      priceFormatted: 'From ₹25/item',
      unit: 'item',
      icon: '⚡',
      badge: 'Express',
      features: ['Commercial steam press', 'Crisp crease lines', 'Hanger or flat fold', 'Safe fabric temperature', 'Zero burn guarantee']
    },
    {
      id: 'sc',
      title: 'Shoe & Sneaker Care',
      tagline: 'Sneakers, running shoes & formal leather deep cleaned',
      pricePaise: 14900,
      priceFormatted: 'From ₹149/pair',
      unit: 'pair',
      icon: '👟',
      badge: 'Deep Clean',
      features: ['Deep sole scrub', 'Upper fabric gentle wash', 'Deodorization treatment', 'Lace cleaning & wash', 'Leather conditioning']
    }
  ];

  // Load basket or pre-selected service from URL or storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBasket = localStorage.getItem('freshroute_basket');
      if (savedBasket) {
        try {
          setBasket(JSON.parse(savedBasket));
        } catch (e) {}
      }

      const params = new URLSearchParams(window.location.search);
      const srvParam = params.get('service');
      if (srvParam) {
        const found = catalog.find((c) => c.id === srvParam);
        if (found) setSelectedService(found);
      }
      const cityParam = params.get('city');
      if (cityParam) {
        setCity(`${cityParam}, Rajasthan`);
      }
    }
  }, []);

  // Sync basket to localStorage
  const saveBasket = (newBasket) => {
    setBasket(newBasket);
    if (typeof window !== 'undefined') {
      localStorage.setItem('freshroute_basket', JSON.stringify(newBasket));
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handlePincodeValidation = (code) => {
    setCustomPincode(code);
    const validCodes = ['311001', '311002', '305801', '305802', '302017', '302021'];
    if (code.length === 6) {
      if (validCodes.includes(code.trim())) {
        setPinStatus('Serviceable');
      } else {
        setPinStatus('Not Serviceable');
      }
    } else {
      setPinStatus('Checking...');
    }
  };

  const applyCitySelection = (c, pin) => {
    setCity(c);
    setPincode(pin);
    setIsCityModalOpen(false);
    showToast(`📍 Switched location to ${c}`);
  };

  const addToBasket = (srv) => {
    const existing = basket.find((item) => item.id === srv.id);
    let updated;
    if (existing) {
      updated = basket.map((item) => (item.id === srv.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      updated = [...basket, { ...srv, qty: 1 }];
    }
    saveBasket(updated);
    setSelectedService(null);
    showToast(`✓ Added ${srv.title} to basket`);
  };

  const updateQty = (id, delta) => {
    const updated = basket
      .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
      .filter((item) => item.qty > 0);
    saveBasket(updated);
  };

  // Filter catalog based on search
  const filteredCatalog = catalog.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.tagline.toLowerCase().includes(search.toLowerCase())
  );

  const subtotalPaise = basket.reduce((acc, curr) => acc + curr.pricePaise * curr.qty, 0);
  const discountPaise = couponCode === 'FRESH20' && subtotalPaise > 0 ? Math.round(subtotalPaise * 0.2) : 0;
  const totalPaise = subtotalPaise - discountPaise;

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#f8faf8', minHeight: '100vh', paddingBottom: '90px', color: '#0f172a' }}>
      <Head>
        <title>FreshRoute | Customer Home</title>
      </Head>

      {/* Floating Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', background: '#0d3826', color: '#fff', padding: '10px 20px', borderRadius: '24px', fontSize: '13px', fontWeight: '700', zIndex: 1000, boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Top Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 90 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Deliver to</div>
            <button
              onClick={() => setIsCityModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '15px', fontWeight: '900', color: '#0d3826', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <span>📍 {city} ({pincode})</span>
              <span style={{ fontSize: '11px' }}>▼</span>
            </button>
          </div>
          <button
            onClick={() => setIsProfileOpen(true)}
            style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0d3826', fontSize: '14px', cursor: 'pointer' }}
          >
            A
          </button>
        </div>

        {/* Search Bar with live filter */}
        <div style={{ maxWidth: '600px', margin: '12px auto 0' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }}>🔍</span>
            <input
              type="text"
              placeholder="Search services (Wash & Fold, Dry Cleaning...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', outline: 'none' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '600px', margin: '20px auto', padding: '0 16px' }}>
        {/* Rinse 3-Bag System Quick Explainer Card */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '16px 18px', marginBottom: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0d3826' }}>🧺 Rinse-Style 3-Color Smart Bags</span>
            <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>VALET BRINGS BAGS</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', fontSize: '11px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 6px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '18px' }}>⬛</div>
              <div style={{ fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>Black Bag</div>
              <div style={{ color: '#64748b', fontSize: '10px' }}>Wash & Fold</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 6px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '18px' }}>⬜</div>
              <div style={{ fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>White Bag</div>
              <div style={{ color: '#64748b', fontSize: '10px' }}>Dry Clean / Hanger</div>
            </div>
            <div style={{ background: '#f0fdfa', padding: '10px 6px', borderRadius: '10px', border: '1px solid #ccfbf1' }}>
              <div style={{ fontSize: '18px' }}>🟦</div>
              <div style={{ fontWeight: '800', color: '#0f766e', marginTop: '2px' }}>Teal Bag</div>
              <div style={{ color: '#64748b', fontSize: '10px' }}>Delicate Hang Dry</div>
            </div>
          </div>
        </div>

        {/* 6 Category 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          {filteredCatalog.map((srv) => (
            <div
              key={srv.id}
              onClick={() => setSelectedService(srv)}
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '18px 16px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                position: 'relative'
              }}
            >
              {srv.badge && (
                <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '9px', fontWeight: '800', background: '#f1f5f9', color: '#0d3826', padding: '2px 6px', borderRadius: '6px' }}>
                  {srv.badge}
                </span>
              )}
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>{srv.icon}</div>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '4px', lineHeight: 1.3 }}>{srv.title}</h3>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0d3826' }}>{srv.priceFormatted}</div>
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', marginTop: '6px' }}>Tap for Details &bull; +</div>
            </div>
          ))}
        </div>

        {/* First Order 20% OFF Promo Card */}
        <div style={{ background: '#dcfce7', borderRadius: '16px', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', border: '1px solid #bbf7d0' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>First Order Special</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#0d3826' }}>20% OFF (FRESH20)</div>
          </div>
          <button
            onClick={() => {
              if (basket.length === 0) {
                addToBasket(catalog[0]);
              }
              window.location.href = '/schedule';
            }}
            style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
          >
            Book Now
          </button>
        </div>

        {/* Service Details Modal/View */}
        {selectedService && (
          <div style={{ background: '#ffffff', border: '2px solid #0d3826', borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '32px' }}>{selectedService.icon}</div>
              <button onClick={() => setSelectedService(null)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0d3826', marginBottom: '4px' }}>{selectedService.title}</h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{selectedService.tagline}</p>
            
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#0d3826', marginBottom: '18px' }}>
              {selectedService.priceFormatted}
            </div>

            <div style={{ marginBottom: '20px' }}>
              {selectedService.features.map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', marginBottom: '8px' }}>
                  <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => addToBasket(selectedService)}
              style={{ width: '100%', background: '#0d3826', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}
            >
              Add to Basket
            </button>
          </div>
        )}

        {/* Basket Summary Card */}
        {basket.length > 0 && (
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Basket ({basket.reduce((a, b) => a + b.qty, 0)} items)</h3>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}>20% OFF Applied</span>
            </div>

            {basket.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>₹{(item.pricePaise / 100).toFixed(0)} / {item.unit}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateQty(item.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                  <span style={{ fontWeight: '700', minWidth: '18px', textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                  <span style={{ fontWeight: '800', minWidth: '60px', textAlign: 'right', color: '#0d3826' }}>
                    ₹{((item.pricePaise * item.qty) / 100).toFixed(0)}
                  </span>
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '12px', marginTop: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '4px' }}>
                <span>Subtotal</span>
                <span>₹{(subtotalPaise / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: '600', marginBottom: '4px' }}>
                <span>Promo Discount (20% Code: FRESH20)</span>
                <span>-₹{(discountPaise / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '16px', color: '#0d3826', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <span>Total to Pay</span>
                <span>₹{(totalPaise / 100).toFixed(2)}</span>
              </div>
            </div>

            <a
              href="/schedule"
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
                marginTop: '16px'
              }}
            >
              Continue to Pickup Date (7–10 PM) →
            </a>
          </div>
        )}
      </main>

      {/* Interactive City Selector Modal */}
      {isCityModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0d3826' }}>Select Your Service City</h3>
              <button onClick={() => setIsCityModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => applyCitySelection('Jaipur, Rajasthan', '302017')}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: city.includes('Jaipur') ? '#dcfce7' : '#fff', textAlign: 'left', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>📍 Jaipur (Malviya Nagar, Vaishali)</span>
                <span style={{ color: '#16a34a' }}>302017</span>
              </button>
              <button
                onClick={() => applyCitySelection('Bhilwara, Rajasthan', '311001')}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: city.includes('Bhilwara') ? '#dcfce7' : '#fff', textAlign: 'left', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>📍 Bhilwara (Pilot Hub)</span>
                <span style={{ color: '#16a34a' }}>311001</span>
              </button>
              <button
                onClick={() => applyCitySelection('Kishangarh, Rajasthan', '305801')}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: city.includes('Kishangarh') ? '#dcfce7' : '#fff', textAlign: 'left', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>📍 Kishangarh (Marble Hub)</span>
                <span style={{ color: '#16a34a' }}>305801</span>
              </button>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>Or Test 6-Digit PIN Code</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={6}
                  value={customPincode}
                  onChange={(e) => handlePincodeValidation(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 'bold' }}
                />
                <button
                  onClick={() => applyCitySelection(city, customPincode)}
                  disabled={pinStatus !== 'Serviceable'}
                  style={{ background: pinStatus === 'Serviceable' ? '#0d3826' : '#cbd5e1', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: '700', cursor: pinStatus === 'Serviceable' ? 'pointer' : 'not-allowed' }}
                >
                  Apply
                </button>
              </div>
              <div style={{ marginTop: '6px', fontSize: '12px', fontWeight: '700', color: pinStatus === 'Serviceable' ? '#16a34a' : '#dc2626' }}>
                {pinStatus === 'Serviceable' ? '✓ PIN is currently serviceable' : '✗ Service not available yet for this PIN'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Offers Drawer */}
      {isOffersOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', maxWidth: '600px', width: '100%', boxShadow: '0 -8px 30px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0d3826' }}>Available Coupons & Offers</h3>
              <button onClick={() => setIsOffersOpen(false)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ border: '1.5px dashed #16a34a', borderRadius: '12px', padding: '16px', background: '#f0fdf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '900', color: '#0d3826', fontSize: '16px' }}>FRESH20</div>
                  <div style={{ fontSize: '12px', color: '#166534' }}>20% OFF on all laundry services</div>
                </div>
                <button
                  onClick={() => {
                    setCouponCode('FRESH20');
                    setIsOffersOpen(false);
                    showToast('🎉 Coupon FRESH20 Applied!');
                  }}
                  style={{ background: '#0d3826', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                >
                  Apply
                </button>
              </div>

              <div style={{ border: '1.5px dashed #0284c7', borderRadius: '12px', padding: '16px', background: '#f0f9ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '900', color: '#0369a1', fontSize: '16px' }}>FRESH100</div>
                  <div style={{ fontSize: '12px', color: '#0284c7' }}>Flat ₹100 OFF on orders above ₹499</div>
                </div>
                <button
                  onClick={() => {
                    setCouponCode('FRESH100');
                    setIsOffersOpen(false);
                    showToast('🎉 Coupon FRESH100 Applied!');
                  }}
                  style={{ background: '#0369a1', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Card */}
      {isProfileOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', maxWidth: '380px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0d3826' }}>Customer Account</h3>
              <button onClick={() => setIsProfileOpen(false)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#0d3826', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 10px' }}>
                A
              </div>
              <div style={{ fontWeight: '800', fontSize: '16px' }}>Aarav Sharma</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>+91 98765 43212</div>
              <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', marginTop: '4px' }}>FreshPass Member (Active)</div>
            </div>
            <a
              href="/track"
              style={{ display: 'block', textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0d3826', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', marginBottom: '10px' }}
            >
              View Order History →
            </a>
            <button
              onClick={() => {
                setIsProfileOpen(false);
                window.location.href = '/login';
              }}
              style={{ width: '100%', background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 80 }}>
        <a href="/" style={{ textAlign: 'center', textDecoration: 'none', color: '#0d3826' }}>
          <div style={{ fontSize: '18px' }}>🏠</div>
          <div style={{ fontSize: '11px', fontWeight: '800' }}>Home</div>
        </a>
        <a href="/track" style={{ textAlign: 'center', textDecoration: 'none', color: '#64748b' }}>
          <div style={{ fontSize: '18px' }}>📋</div>
          <div style={{ fontSize: '11px', fontWeight: '600' }}>Orders</div>
        </a>
        <button onClick={() => setIsOffersOpen(true)} style={{ background: 'none', border: 'none', textAlign: 'center', cursor: 'pointer', color: '#64748b', padding: 0 }}>
          <div style={{ fontSize: '18px' }}>🏷️</div>
          <div style={{ fontSize: '11px', fontWeight: '600' }}>Offers</div>
        </button>
        <button onClick={() => setIsProfileOpen(true)} style={{ background: 'none', border: 'none', textAlign: 'center', cursor: 'pointer', color: '#64748b', padding: 0 }}>
          <div style={{ fontSize: '18px' }}>👤</div>
          <div style={{ fontSize: '11px', fontWeight: '600' }}>Profile</div>
        </button>
      </nav>
    </div>
  );
}
