import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { resolveImageUrl } from '@/utils';
import { useCart } from '@/context/CartContext';
import { serviceService } from '@/services/serviceService';
import './ShopPage.css';

export function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        if (!slug) return;
        const res = await serviceService.getServiceBySlug(slug);
        const fetchedService = res.data;
        // Ensure the service object has itemType 'service' for cart
        if (fetchedService) {
          fetchedService.itemType = 'service';
          // Ensure it has images array since services might have 'image' instead of 'images'
          if (fetchedService.image && !fetchedService.images) {
             fetchedService.images = [fetchedService.image];
          }
        }
        setProduct(fetchedService);
        
        // Fetch similar services
        const allServices = await serviceService.getServices();
        setSimilarProducts(allServices.data?.filter((p: any) => p.id !== fetchedService?.id).slice(0, 3) || []);
      } catch (err) {
        console.error('Failed to load service', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  useEffect(() => {
    if (product) {
      setActiveImage(0);
      setQuantity(1);
      if (product.variants && product.variants.length > 0) {
        // Simplified variant handling for real DB schema
        const initialVariants: {[key: string]: string} = {};
        if (product.variants[0].attributes) {
            Object.keys(product.variants[0].attributes).forEach(key => {
                initialVariants[key] = product.variants[0].attributes[key];
            });
        }
        setSelectedVariant(initialVariants);
      }
    }
  }, [product]);

  if (loading) {
    return <div className="section container" style={{ paddingTop: '200px', textAlign: 'center' }}><p>Loading...</p></div>;
  }

  if (!product) {
    return (
      <div className="section container" style={{ paddingTop: '200px', textAlign: 'center' }}>
        <h1 className="text-display-lg">Service Not Found</h1>
        <Link to="/services" className="navbar__btn" style={{ display: 'inline-block', marginTop: '20px' }}>
          RETURN TO SERVICES
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedVariant);
    navigate('/shop/cart');
  };

  return (
    <>
      <SEOHead
        title={`${product.title || product.name} | Services`}
        description={product.description}
      />
      <main className="pdp-page">
        {/* HERO */}
        <section className="pdp-page__hero">
          <div className="pdp-page__hero-top container">
            <div className="pdp-page__breadcrumb">
              HOME / SERVICES / {(product.title || product.name).toUpperCase()}
            </div>
            <h1 className="pdp-page__title-large">{product.title || product.name}</h1>
            <button className="pdp-page__buy-now-top" onClick={handleBuyNow}>Buy Now</button>
            <div className="pdp-page__hero-image-wrapper">
              {product.images && product.images.length > 0 ? (
                  <img src={resolveImageUrl(product.images[0]?.url || product.images[0])} alt={product.name} className="pdp-page__hero-image" />
              ) : (
                  <div className="pdp-page__hero-image" style={{background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>No Image</div>
              )}
            </div>
          </div>
        </section>

        {/* MAIN PRODUCT AREA */}
        <section className="pdp-page__main-area">
          <div className="container">
            <div className="pdp-page__product-header">
              <h2 className="pdp-page__product-title">{product.title || product.name}</h2>
              <div className="pdp-page__product-subtitle">Select your preferences below</div>
            </div>

            <div className="pdp-page__content-grid">
              {/* Left Gallery */}
              <div className="pdp-page__gallery">
                  {product.images && product.images.length > 0 && (
                    <OptimizedImage src={product.images[activeImage]?.url || product.images[activeImage]} alt={product.name} className="pdp-page__main-image" loading="eager" decoding="async" />
                 )}
                {product.images && product.images.length > 1 && (
                  <div className="pdp-page__thumbnail-list">
                    {product.images.map((img: any, idx: number) => (
                      <OptimizedImage 
                        key={idx}
                        src={img?.url || img} 
                        alt={`${product.name} ${idx + 1}`} 
                        className={`pdp-page__thumbnail ${idx === activeImage ? 'active' : ''}`}
                        onClick={() => setActiveImage(idx)}
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Info */}
              <div className="pdp-page__info">
                <div className="pdp-page__price-block">
                  <span className="pdp-page__price">${product.price.toFixed(2)}</span>
                </div>

                <div className="pdp-page__rating-row">
                  <div className="pdp-page__stars">★★★★★</div>
                  <span className="pdp-page__review-link">{product.reviewCount} Reviews</span>
                </div>

                {product.variants && product.variants.map((variant: any) => (
                  <div key={variant.id} className="pdp-page__options">
                    <span className="pdp-page__option-label">{variant.name}</span>
                    <div className="pdp-page__option-buttons">
                      {variant.options.map((opt: any) => (
                        <button 
                          key={opt} 
                          className={`pdp-page__option-btn ${selectedVariant[variant.id] === opt ? 'active' : ''}`}
                          onClick={() => setSelectedVariant(prev => ({...prev, [variant.id]: opt}))}
                        >
                          {/* MOCK COLORS for color variant, otherwise text */}
                          {variant.name.toLowerCase() === 'color' ? (
                             <div style={{
                               width: '100%', height: '100%', 
                               backgroundColor: opt === 'Sage Green' ? '#8F9B8A' : opt === 'Warm Beige' ? '#DCCBBB' : '#444'
                             }}></div>
                          ) : opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pdp-page__options">
                  <span className="pdp-page__option-label">QUANTITY</span>
                  <div className="pdp-page__actions">
                    <div className="pdp-page__quantity">
                      <button className="pdp-page__qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                      <input type="text" readOnly className="pdp-page__qty-btn pdp-page__qty-val" value={quantity} />
                      <button className="pdp-page__qty-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
                    </div>
                    <button 
                      className="pdp-page__add-to-cart" 
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'SOLD OUT' : 'ADD TO CART'}
                    </button>
                  </div>
                  <div className="pdp-page__wishlist">
                    <span>♥</span> ADD TO WISHLIST
                  </div>
                </div>

                <div className="pdp-page__info-tabs">
                  <div className="pdp-page__tab-card">
                    <h3 className="pdp-page__tab-title">MATERIAL</h3>
                    <div className="pdp-page__tab-content">
                      {product.details}
                    </div>
                  </div>
                  <div className="pdp-page__tab-card">
                    <h3 className="pdp-page__tab-title">Refunds & Cancellations</h3>
                    <div className="pdp-page__tab-content">
                      {product.category === 'Life Coaching' 
                        ? 'Refund is not applicable for sessions.'
                        : 'We accept returns within 30 days of delivery. The item must be in its original condition.'}
                    </div>
                  </div>
                  <div className="pdp-page__tab-card">
                    <h3 className="pdp-page__tab-title">Delivery & Returns</h3>
                    <div className="pdp-page__tab-content">
                      {product.category === 'Life Coaching'
                        ? 'Delivery is done through email with a link to attend the virtual session.'
                        : 'Free shipping on orders over $100. Standard delivery takes 3-5 business days.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="pdp-page__reviews-section">
          <div className="container">
            <div className="pdp-page__section-header">
              <h2 className="pdp-page__section-title">What Others Are Saying</h2>
            </div>
            <div className="pdp-page__reviews-layout">
              <div className="pdp-page__reviews-summary">
                <div className="pdp-page__average">{product.rating.toFixed(1)}</div>
                <div className="pdp-page__stars" style={{ fontSize: '24px', marginBottom: '8px' }}>★★★★★</div>
                <div style={{ fontFamily: "var(--font-body)", color: '#5D5D5D' }}>Based on {product.reviewCount} reviews</div>
              </div>
              <div className="pdp-page__reviews-list">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review: any) => (
                    <div key={review.id} className="pdp-page__review-card">
                      <div className="pdp-page__stars" style={{ marginBottom: '12px' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <div className="pdp-page__review-name">{review.name}</div>
                      <div className="pdp-page__review-date">{review.date}</div>
                      <div className="pdp-page__review-text">{review.text}</div>
                    </div>
                  ))
                ) : (
                  <div className="pdp-page__review-card">
                    <div className="pdp-page__review-text">No reviews yet. Be the first to review!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SIMILAR PRODUCTS */}
        {similarProducts.length > 0 && (
          <section className="pdp-page__similar-section">
            <div className="container">
              <div className="pdp-page__section-header">
                <h2 className="pdp-page__section-title">Other Services</h2>
              </div>
              <div className="shop-page__grid">
                {similarProducts.map(p => (
                  <article key={p.id} className="shop-page__product-card">
                    <Link to={`/services/${p.slug}`} className="shop-page__product-image-link">
                      <div className="shop-page__product-image-wrapper">
                        {p.badge && <span className="shop-page__badge">{p.badge}</span>}
                        <OptimizedImage src={p.image || (p.images && p.images[0])} alt={p.title || p.name} className="shop-page__product-image" loading="lazy" />
                      </div>
                    </Link>
                    <div className="shop-page__product-details">
                      <span className="shop-page__product-category">{p.category || 'Service'}</span>
                      <Link to={`/services/${p.slug}`} className="shop-page__product-name-link">
                        <h3 className="shop-page__product-title">{p.title || p.name}</h3>
                      </Link>
                      <div className="shop-page__product-price-row">
                        <div className="shop-page__price">
                          <span>${p.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <button 
                        className="shop-page__add-btn"
                        onClick={() => addItem(p, 1)}
                        disabled={p.stock === 0}
                      >
                        {p.stock === 0 ? 'SOLD OUT' : 'ADD TO CART'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BANNER */}
        <section className="pdp-page__banner">
          <div className="pdp-page__banner-text">
            Welcome To Soul And Success, Start Your Inner Journey Towards Abundance.
          </div>
        </section>
      </main>
    </>
  );
}
