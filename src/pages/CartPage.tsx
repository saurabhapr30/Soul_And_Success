import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/ui';
import { resolveImageUrl } from '@/utils';
import { useCart } from '@/context/CartContext';
import './ShopPage.css';

export function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCart();
  
  const subtotal = getSubtotal();
  const shipping = subtotal > 100 ? 0 : (subtotal > 0 ? 10 : 0);
  const total = subtotal + shipping;

  return (
    <>
      <SEOHead
        title="Your Cart | Shop"
        description="Review your shopping cart."
      />
      <main className="cart-page">
        <div className="container">
          <h1 className="text-display-lg" style={{ marginBottom: '40px', fontFamily: "var(--font-display-secondary)", textAlign: 'center' }}>Your Cart</h1>
          
          {items.length === 0 ? (
            <div className="shop-page__empty">
              <h3>YOUR CART IS EMPTY</h3>
              <p style={{ marginBottom: '24px' }}>Looks like you haven't added anything to your cart yet.</p>
              <Link to="/shop" className="navbar__btn" style={{ display: 'inline-block' }}>CONTINUE SHOPPING</Link>
            </div>
          ) : (
            <div className="cart-page__layout">
              <div className="cart-page__items">
                {items.map((item, index) => (
                  <div key={`${item.product.id}-${index}`} className="cart-page__item">
                    <img src={resolveImageUrl(item.product.images[0])} alt={item.product.name} className="cart-page__item-image" />
                    <div className="cart-page__item-details">
                      <h3 className="cart-page__item-title">{item.product.name}</h3>
                      {item.selectedVariant && Object.entries(item.selectedVariant).map(([key, val]) => (
                        <div key={key} style={{ fontSize: '14px', color: '#5D5D5D', marginBottom: '8px' }}>
                          <span style={{ textTransform: 'capitalize' }}>{key}</span>: {val}
                        </div>
                      ))}
                      <div className="cart-page__item-price">${item.product.price.toFixed(2)}</div>
                      
                      <div className="cart-page__item-actions" style={{ marginTop: '16px' }}>
                        <div className="pdp-page__quantity" style={{ height: '36px' }}>
                          <button 
                            className="pdp-page__qty-btn" 
                            style={{ height: '36px' }}
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                          >-</button>
                          <input type="text" readOnly className="pdp-page__qty-val" value={item.quantity} />
                          <button 
                            className="pdp-page__qty-btn" 
                            style={{ height: '36px' }}
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                          >+</button>
                        </div>
                        <button 
                          className="cart-page__remove"
                          onClick={() => removeItem(item.product.id, item.selectedVariant)}
                        >Remove</button>
                      </div>
                    </div>
                    <div className="cart-page__item-price" style={{ marginLeft: 'auto', fontSize: '18px' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-page__summary">
                <h2 className="cart-page__summary-title">Order Summary</h2>
                
                <div className="cart-page__summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart-page__summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? (subtotal > 0 ? 'Free' : '$0.00') : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="cart-page__summary-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <Link to="/shop/checkout" className="cart-page__checkout-btn">
                  PROCEED TO CHECKOUT
                </Link>
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Link to="/shop" className="pdp-page__review-link" style={{ textDecoration: 'none' }}>CONTINUE SHOPPING</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
