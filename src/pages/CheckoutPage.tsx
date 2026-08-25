import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/ui';
import { resolveImageUrl } from '@/utils';
import { useCart } from '@/context/CartContext';
import { couponService } from '@/services/couponService';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import './ShopPage.css';

export function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    phone: '',
    paymentMethod: 'card'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const requiresShipping = items.some(item => !['Life Coaching', 'E-Books'].includes(item.product.category));

  const subtotal = getSubtotal();
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'PERCENTAGE') {
      discount = (subtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maximumDiscount && discount > appliedCoupon.maximumDiscount) {
        discount = appliedCoupon.maximumDiscount;
      }
    } else {
      discount = appliedCoupon.value;
    }
  }

  const shipping = requiresShipping ? ((subtotal - discount) > 1000 ? 0 : ((subtotal - discount) > 0 ? 99 : 0)) : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await couponService.validateCoupon(couponCode);
      const coupon = res.data;
      if (coupon.minimumOrderValue && subtotal < coupon.minimumOrderValue) {
         setCouponError(`Minimum order value of ₹${coupon.minimumOrderValue} required`);
         setAppliedCoupon(null);
      } else {
         setAppliedCoupon(coupon);
      }
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    if (requiresShipping) {
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zip) newErrors.zip = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsProcessing(true);
    
    try {
      // 1. Create Order in DB
      const orderPayload = {
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price, itemType: (i.product as any).itemType || 'product' })),
        subtotal,
        tax: 0,
        shipping,
        discount,
        total,
        couponCode: appliedCoupon?.code,
        shippingAddress: requiresShipping ? {
          fullName: `${formData.firstName} ${formData.lastName}`,
          addressLine1: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zip,
          country: formData.country,
          phone: formData.phone
        } : undefined
      };
      
      const orderRes = await orderService.createOrder(orderPayload);
      const orderId = orderRes.data.id;

      // 2. Fetch Razorpay order specs from server
      let rzpOrder: any = {};
      try {
        const rzpOrderRes = await paymentService.createOrder(orderId);
        rzpOrder = rzpOrderRes.data || {};
      } catch (err) {
        console.warn('Failed to fetch backend payment specs', err);
      }

      // 3. Load Razorpay script & launch payment gateway popup
      const isRzpLoaded = await loadRazorpay();

      if (isRzpLoaded && (window as any).Razorpay) {
        const options: any = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
          amount: rzpOrder.amount || Math.round(total * 100),
          currency: rzpOrder.currency || 'INR',
          name: 'Soul & Success',
          description: 'Order Payment',
          order_id: rzpOrder.orderId || undefined,
          handler: async function (response: any) {
            try {
              if (response?.razorpay_payment_id) {
                await paymentService.verifyPayment({
                  orderId,
                  razorpayOrderId: response.razorpay_order_id || 'sim_order',
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature || 'sim_sig'
                });
              }
            } catch (err) {
              console.error('Payment verification note:', err);
            } finally {
              clearCart();
              navigate('/shop/order-confirmation');
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#E27D60'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          alert(`Payment failed: ${response.error?.description || 'Transaction declined'}`);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        alert('Could not connect to Payment Gateway. Please check your internet connection.');
        setIsProcessing(false);
      }

    } catch (err: any) {
      console.error('Order creation error:', err);
      const msg = err.response?.data?.message || err.message || 'Error processing order';
      alert(`Could not process order: ${msg}`);
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  if (items.length === 0) {
    return (
      <main className="checkout-page" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ fontFamily: "var(--font-display-secondary)", marginBottom: '1rem' }}>YOUR CART IS EMPTY</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => navigate('/shop')}
          style={{ background: '#BC957B', color: '#fff', border: 'none', padding: '12px 24px', cursor: 'pointer', borderRadius: '4px' }}
        >
          CONTINUE SHOPPING
        </button>
      </main>
    );
  }

  return (
    <>
      <SEOHead title="Checkout | Shop" description="Secure checkout." />
      <main className="checkout-page">
        <div className="container">
          <div className="cart-page__layout">
            
            {/* Form Area */}
            <div className="cart-page__items" style={{ padding: '0', background: 'transparent', border: 'none' }}>
              <form onSubmit={handleSubmit} className="checkout-page__form">
                
                <h2 className="checkout-page__section-title">Contact Information</h2>
                
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div className="checkout-page__field" style={{ flex: 1 }}>
                    <label className="checkout-page__label">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="checkout-page__input" />
                    {errors.firstName && <div className="checkout-page__error">{errors.firstName}</div>}
                  </div>
                  <div className="checkout-page__field" style={{ flex: 1 }}>
                    <label className="checkout-page__label">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="checkout-page__input" />
                    {errors.lastName && <div className="checkout-page__error">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="checkout-page__field">
                  <label className="checkout-page__label">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="checkout-page__input" />
                  {errors.email && <div className="checkout-page__error">{errors.email}</div>}
                </div>

                <div className="checkout-page__field">
                  <label className="checkout-page__label">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="checkout-page__input" />
                  {errors.phone && <div className="checkout-page__error">{errors.phone}</div>}
                </div>

                {requiresShipping && (
                  <>
                    <h2 className="checkout-page__section-title" style={{ marginTop: '40px' }}>Shipping Address</h2>
                    <div className="checkout-page__field">
                      <label className="checkout-page__label">Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} className="checkout-page__input" />
                      {errors.address && <div className="checkout-page__error">{errors.address}</div>}
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div className="checkout-page__field" style={{ flex: 1 }}>
                        <label className="checkout-page__label">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="checkout-page__input" />
                        {errors.city && <div className="checkout-page__error">{errors.city}</div>}
                      </div>
                      <div className="checkout-page__field" style={{ flex: 1 }}>
                        <label className="checkout-page__label">State / Province</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="checkout-page__input" />
                        {errors.state && <div className="checkout-page__error">{errors.state}</div>}
                      </div>
                      <div className="checkout-page__field" style={{ flex: 1 }}>
                        <label className="checkout-page__label">ZIP / Postal Code</label>
                        <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="checkout-page__input" />
                        {errors.zip && <div className="checkout-page__error">{errors.zip}</div>}
                      </div>
                    </div>
                  </>
                )}

                <h2 className="checkout-page__section-title" style={{ marginTop: '40px' }}>Payment Method</h2>
                <div style={{ border: '1px solid rgba(137, 106, 86, 0.4)', borderRadius: '4px', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} id="pay-card" />
                    <label htmlFor="pay-card" className="checkout-page__label" style={{ margin: 0 }}>Razorpay Payment Gateway (Cards, UPI, Netbanking, Wallets)</label>
                  </div>
                </div>
                
                <div style={{ padding: '16px', background: '#F9ECD7', borderRadius: '4px', marginBottom: '32px', fontSize: '14px', color: '#444' }}>
                  <strong>Secure Payment:</strong> You will be securely connected to the Razorpay Payment Gateway to complete your purchase via UPI, Card, or Netbanking.
                </div>

                <button type="submit" className="cart-page__checkout-btn" style={{ border: 'none', cursor: 'pointer' }} disabled={isProcessing}>
                  {isProcessing ? 'CONNECTING TO PAYMENT GATEWAY...' : 'PROCEED TO PAYMENT'}
                </button>

              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="cart-page__summary">
              <h2 className="cart-page__summary-title">Order Summary</h2>
              <div style={{ marginBottom: '24px' }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={resolveImageUrl(item.product.images?.[0], 'https://via.placeholder.com/60')} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                      <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#5D5D5D', color: '#FFF', fontSize: '12px', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontFamily: "var(--font-body)", fontWeight: 600 }}>{item.product.name}</div>
                      <div style={{ fontSize: '12px', color: '#5D5D5D' }}>₹{Number(item.product.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-page__summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div style={{ margin: '16px 0', padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    value={couponCode} 
                    onChange={e => setCouponCode(e.target.value)} 
                    placeholder="Coupon code" 
                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                    disabled={!!appliedCoupon}
                  />
                  {!appliedCoupon ? (
                    <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode} style={{ padding: '8px 16px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  ) : (
                    <button onClick={handleRemoveCoupon} style={{ padding: '8px 16px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Remove
                    </button>
                  )}
                </div>
                {couponError && <div style={{ color: '#d32f2f', fontSize: '12px' }}>{couponError}</div>}
                {appliedCoupon && <div style={{ color: '#388e3c', fontSize: '12px' }}>Coupon '{appliedCoupon.code}' applied!</div>}
              </div>

              {appliedCoupon && (
                <div className="cart-page__summary-row" style={{ color: '#388e3c' }}>
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="cart-page__summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</span>
              </div>
              
              <div className="cart-page__summary-total">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </>
  );
}
