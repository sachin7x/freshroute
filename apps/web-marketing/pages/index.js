import React, { useState } from 'react';
import Head from 'next/head';

export default function MarketingPage() {
  const [selectedCity, setSelectedCity] = useState('Jaipur');
  const [faqOpen, setFaqOpen] = useState({ 0: true });

  const services = [
    {
      id: 'wf',
      title: 'Wash & Fold',
      tagline: 'Everyday clothes, professionally cleaned',
      price: 'From ₹49/kg',
      icon: '🧺',
      badge: 'Most Popular',
      features: ['Premium detergent', 'Hygienic cleaning', 'Fresh fragrance', 'Folded & packed', '48-72 hours delivery']
    },
    {
      id: 'dc',
      title: 'Dry Cleaning',
      tagline: 'Delicate fabrics, expertly treated',
      price: 'From ₹99/item',
      icon: '🧥',
      badge: 'Premium Care',
      features: ['Gentle solvent care', 'Stain spot removal', 'Protective covers', 'Hanger packing', 'Formals & silks']
    },
    {
      id: 'ir',
      title: 'Ironing',
      tagline: 'Crisp & wrinkle-free finish',
      price: 'From ₹25/item',
      icon: '⚡',
      badge: 'Express',
      features: ['Commercial steam press', 'Crisp crease lines', 'Hanger or flat fold', 'Safe temperature', 'Zero shine marks']
    },
    {
      id: 'sc',
      title: 'Shoe Care',
      tagline: 'Revive & refresh your footwear',
      price: 'From ₹149/pair',
      icon: '👟',
      badge: 'Restoration',
      features: ['Deep sole scrub', 'Upper fabric gentle wash', 'Deodorization', 'Lace cleaning', 'All sneaker brands']
    }
  ];

  const faqs = [
    {
      q: 'How does FreshRoute evening pickup work?',
      a: 'Select a 7:00 PM – 10:00 PM window on the app or WhatsApp. Our doorstep valet arrives with an eco-friendly canvas bag, tags it with a washable QR code, and seals it in your presence.'
    },
    {
      q: 'What is the turnaround time for laundry?',
      a: 'Wash & Fold is cleaned, folded, and returned in 24 to 48 hours. Express steam ironing is delivered next evening. Dry cleaning takes 48 to 72 hours for delicate fabric treatment.'
    },
    {
      q: 'How is the final price calculated?',
      a: 'Our partner dark hub weighs your bag on a calibrated digital scale upon arrival and sends you an itemized SMS/WhatsApp breakdown before washing begins. You only pay for exact kilograms.'
    },
    {
      q: 'Which cities and areas are currently live?',
      a: 'We are fully live in Jaipur (Malviya Nagar, Vaishali Nagar, C-Scheme), Bhilwara (Central, Shastri Nagar), and Kishangarh. Rapid expansion across Rajasthan and Delhi NCR is underway.'
    }
  ];

  const toggleFaq = (idx) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a', background: '#f8faf8', minHeight: '100vh' }}>
      <Head>
        <title>FreshRoute | Laundry Made Simple. Pickup. Care. Deliver.</title>
        <meta name="description" content="Quick Commerce Laundry for India. Like Blinkit for Laundry. On-demand valet pickup in Jaipur, Kishangarh & Bhilwara." />
      </Head>

      {/* Top Announcement Banner */}
      <div style={{ background: '#0d3826', color: '#ecfdf5', textAlign: 'center', padding: '10px 16px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.3px' }}>
        🌿 India's Quick-Commerce Laundry &bull; Live in <b>Jaipur</b>, <b>Kishangarh</b> & <b>Bhilwara</b> &bull; Get <b>20% OFF</b> First Order: Code <b>FRESH20</b>
      </div>

      {/* Sticky Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        {/* Brand Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ width: '40px', height: '40px', background: '#0d3826', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px' }}>🌿</span>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#0d3826', letterSpacing: '-0.8px', lineHeight: 1 }}>FreshRoute</div>
            <div style={{ fontSize: '11px', color: '#527867', fontWeight: '600', letterSpacing: '0.2px' }}>Laundry Made Simple.</div>
          </div>
        </a>

        {/* Smooth Scroll Navigation Links */}
        <div style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
          <button onClick={() => scrollTo('services')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>Services & Pricing</button>
          <button onClick={() => scrollTo('how-it-works')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>How It Works</button>
          <button onClick={() => scrollTo('bag-tag')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>QR Bag Tag</button>
          <button onClick={() => scrollTo('coverage')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>City Coverage</button>
          <button onClick={() => scrollTo('faq')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>FAQ</button>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <a href="http://localhost:3000/login" style={{ padding: '9px 18px', borderRadius: '8px', textDecoration: 'none', color: '#0d3826', fontWeight: '700', border: '1.5px solid #0d3826', fontSize: '13px' }}>Sign In</a>
          <a href="http://localhost:3000/schedule" style={{ padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', background: '#0d3826', color: '#fff', fontWeight: '700', fontSize: '13px', boxShadow: '0 2px 8px rgba(13, 56, 38, 0.25)' }}>Schedule Pickup →</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 36px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#dcfce7', color: '#166534', padding: '6px 16px', borderRadius: '24px', fontSize: '12px', fontWeight: '800', marginBottom: '20px' }}>
          <span>⚡ QUICK COMMERCE LAUNDRY</span> &bull; <span>60-MIN EVENING PICKUP (7–10 PM)</span>
        </div>

        <h1 style={{ fontSize: '54px', fontWeight: '900', color: '#0d3826', letterSpacing: '-1.5px', lineHeight: 1.15, marginBottom: '16px' }}>
          Fresh Clothes.<br/><span style={{ color: '#16a34a' }}>Fresher Days.</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#475569', maxWidth: '640px', margin: '0 auto 36px', lineHeight: 1.6 }}>
          Rinse.com adapted for India. Schedule via App or WhatsApp, valet picks up your bag with a tamper-proof QR tag, dark hub cleans & returns within 24–48 hours.
        </p>

        {/* Service Pills Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '44px' }}>
          {[
            { label: 'Doorstep Pickup & Delivery', icon: '🚐' },
            { label: 'Wash & Fold', icon: '🧺' },
            { label: 'Dry Cleaning', icon: '🧥' },
            { label: 'Steam Ironing', icon: '⚡' },
            { label: 'Shoe Laundry', icon: '👟' },
            { label: 'India-wide Coverage', icon: '🇮🇳' },
          ].map((item, idx) => (
            <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '30px', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#0d3826', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <a href="http://localhost:3000" style={{ background: '#0d3826', color: '#fff', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '16px', boxShadow: '0 4px 14px rgba(13, 56, 38, 0.3)' }}>
            Book Valet Pickup Now →
          </a>
          <a href="http://localhost:3000/track" style={{ background: '#fff', color: '#0d3826', border: '2px solid #0d3826', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '16px' }}>
            Track Existing Bag QR
          </a>
        </div>
      </header>

      {/* 4 Service Cards Grid */}
      <section id="services" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0d3826', marginBottom: '10px' }}>Transparent Indian Pricing</h2>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Simple per-kg and per-item pricing in Indian Rupees. Zero hidden fees.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {services.map((srv) => (
            <div key={srv.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '36px' }}>{srv.icon}</span>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                  {srv.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>{srv.title}</h3>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px', minHeight: '34px' }}>{srv.tagline}</p>
              
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#0d3826', marginBottom: '20px' }}>
                {srv.price}
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '24px', flex: 1 }}>
                {srv.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', marginBottom: '8px' }}>
                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <a
                href={`http://localhost:3000?service=${srv.id}`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: '#0d3826',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px'
                }}
              >
                Select {srv.title} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ maxWidth: '1100px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 14px', borderRadius: '14px', fontSize: '12px', fontWeight: '800' }}>
          SEAMLESS 4-STEP CYCLE
        </span>
        <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0d3826', marginTop: '12px', marginBottom: '40px' }}>
          How FreshRoute Works
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            { step: '1', title: 'Schedule Pickup', desc: 'Pick your evening slot (7–10 PM) via web app or WhatsApp in 30 seconds.', icon: '📱' },
            { step: '2', title: 'Doorstep QR Scan', desc: 'Valet arrives with a canvas bag, seals your laundry, and scans the bag QR tag.', icon: '🏷️' },
            { step: '3', title: 'Dark Hub Cleaning', desc: 'Calibrated scale weight logged, separated wash, and professional steam press.', icon: '🧼' },
            { step: '4', title: 'Crisp Delivery', desc: 'Returned to your doorstep within 24–48 hours, folded, packed, and ready to wear.', icon: '🚚' },
          ].map((st) => (
            <div key={st.step} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', textAlign: 'left', position: 'relative' }}>
              <div style={{ width: '32px', height: '32px', background: '#0d3826', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', marginBottom: '16px' }}>
                {st.step}
              </div>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{st.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>{st.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QR Bag Tag Section */}
      <section id="bag-tag" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '60px 24px', margin: '60px 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <span style={{ background: '#ffedd5', color: '#c2410c', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
              PROPRIETARY HARDWARE
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0d3826', marginTop: '12px', marginBottom: '16px' }}>
              Tamper-Proof QR Bag Tag System
            </h2>
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
              Every customer order is sealed in an eco-friendly canvas bag with a unique washable QR tag (e.g. <code>FR123456</code>). Valets scan at pickup, dark hub partner scans upon arrival to record calibrated weights, and delivery valet scans before final doorstep handover.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', flex: 1, textAlign: 'center', background: '#f8fafc' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>🚐</div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: '#0d3826' }}>1. PICK</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Doorstep Valet Scan</div>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', flex: 1, textAlign: 'center', background: '#f8fafc' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>🧼</div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: '#0d3826' }}>2. CLEAN</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Precision Hub Wash</div>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', flex: 1, textAlign: 'center', background: '#f8fafc' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>🚚</div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: '#0d3826' }}>3. DELIVER</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Doorstep Handover</div>
              </div>
            </div>
          </div>

          {/* Bag Tag Visual Component */}
          <div style={{ background: '#fdfbf7', border: '2px dashed #d1c7b7', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '20px', height: '20px', background: '#0d3826', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>F</div>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#0d3826' }}>FreshRoute</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#527867', marginBottom: '16px' }}>Order # FR123456</div>
            
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', width: '140px', height: '140px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
              🏁
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Scan for real-time updates</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', fontSize: '11px', fontWeight: '800', color: '#0d3826' }}>
              <span>PICK</span> &bull; <span>CLEAN</span> &bull; <span>DELIVER</span>
            </div>
          </div>
        </div>
      </section>

      {/* City Coverage Section */}
      <section id="coverage" style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 14px', borderRadius: '14px', fontSize: '12px', fontWeight: '800' }}>
            SERVICE AREAS
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0d3826', marginTop: '12px' }}>
            Live in the RJ Corridor
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { city: 'Jaipur', status: 'Phase 3 (Active)', zones: 'Malviya Nagar, Vaishali Nagar, C-Scheme', pin: '302017, 302021', hub: 'Jaipur SuperHub' },
            { city: 'Bhilwara', status: 'Pilot Hub 1 (Active)', zones: 'Textile Market, Shastri Nagar, City Center', pin: '311001, 311002', hub: 'Dark Hub BHL-01' },
            { city: 'Kishangarh', status: 'Phase 2 (Active)', zones: 'Marble Area, Madanganj, Central', pin: '305801, 305802', hub: 'Dark Hub KSG-01' },
          ].map((c) => (
            <div key={c.city} style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#0d3826' }}>{c.city}</h3>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                  {c.status}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#334155', marginBottom: '6px' }}><b>Zones:</b> {c.zones}</div>
              <div style={{ fontSize: '13px', color: '#334155', marginBottom: '16px' }}><b>PINs:</b> {c.pin}</div>
              <a
                href={`http://localhost:3000?city=${encodeURIComponent(c.city)}`}
                style={{ display: 'block', textAlign: 'center', background: '#0d3826', color: '#fff', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '12px' }}
              >
                Book in {c.city} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" style={{ maxWidth: '800px', margin: '60px auto 80px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0d3826', textAlign: 'center', marginBottom: '32px' }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <button
                onClick={() => toggleFaq(i)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: '#fff',
                  border: 'none',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: '800',
                  fontSize: '15px',
                  color: '#0d3826',
                  cursor: 'pointer'
                }}
              >
                <span>{f.q}</span>
                <span style={{ fontSize: '18px', color: '#16a34a' }}>{faqOpen[i] ? '−' : '+'}</span>
              </button>
              {faqOpen[i] && (
                <div style={{ padding: '0 20px 18px', fontSize: '14px', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #f1f5f9' }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0d3826', color: '#ecfdf5', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '8px' }}>FreshRoute India</div>
        <p style={{ fontSize: '13px', color: '#a7f3d0', marginBottom: '24px' }}>
          Jaipur &bull; Kishangarh &bull; Bhilwara &bull; Expanding across India
        </p>
        <div style={{ fontSize: '12px', color: '#6ee7b7' }}>
          &copy; {new Date().getFullYear()} FreshRoute Technologies Private Limited. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
