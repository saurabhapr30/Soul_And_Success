import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/ui';

export function OrderConfirmationPage() {
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <>
      <SEOHead title="Order Confirmed | Shop" description="Your order has been confirmed." />
      <main className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', backgroundColor: '#F9F9FE' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#C39F87', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', fontSize: '32px' }}>
            ✓
          </div>
          
          <h1 className="text-display-lg" style={{ fontFamily: "var(--font-display-secondary)", marginBottom: '16px' }}>Order Confirmed</h1>
          
          <p className="text-body-lg" style={{ marginBottom: '30px', color: '#5D5D5D' }}>
            Thank you for your purchase. We've received your order and are getting it ready for shipment.
          </p>

          <div style={{ background: '#FFFFFF', padding: '30px', border: '1px solid rgba(137, 106, 86, 0.2)', borderRadius: '4px', marginBottom: '40px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '16px' }}>
              <span style={{ fontFamily: "var(--font-body)", color: '#5D5D5D' }}>Order Number:</span>
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}>#{orderNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "var(--font-body)", color: '#5D5D5D' }}>Estimated Delivery:</span>
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}>
                {deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          <Link to="/shop" className="navbar__btn" style={{ display: 'inline-block' }}>
            CONTINUE SHOPPING
          </Link>
          
          <p style={{ marginTop: '40px', fontSize: '12px', color: '#A28D79' }}>
            * This was a simulated checkout. No real payment was captured and no actual items will be shipped.
          </p>
        </div>
      </main>
    </>
  );
}
