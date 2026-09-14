import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { courseService } from '../services/courseService';
import { bookService } from '../services/bookService';
import { productService } from '../services/productService';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import './ProductDetailsPage.css';

// Assets (Optimized WebP)
import founderImage from '@/assets/intro-portrait-actual.webp'; // Hero image
import standingFounder from '@/assets/standing.webp'; // Founder bottom image
import leavesBg from '@/assets/aboutpage.webp';
import dummyAvatar from '@/assets/hero-portrait-actual.webp';
import placeholderImg from '@/assets/person.webp'; 
import signatureImg from '@/assets/signature.png';

type ProductType = 'course' | 'book' | 'merchandise';

interface NormalizedProduct {
  id: string;
  type: ProductType;
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  highlights?: string[];
  terms?: string;
  details?: string;
  ctaLabel: string;
  bestOffers?: string[];
  termsAndConditions?: string[];
  productDetails?: string[];
}

interface ProductDetailsPageProps {
  type?: ProductType;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ type }) => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<NormalizedProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [notFound, setNotFound] = useState(false);

  // Determine type based on URL path or passed prop
  const productType: ProductType = type || (location.pathname.startsWith('/courses') 
    ? 'course' 
    : location.pathname.startsWith('/books') 
      ? 'book' 
      : 'merchandise');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDetails = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        let rawProduct = null;
        let related = [];

        if (productType === 'course') {
          const courses = await courseService.getCourses();
          rawProduct = await courseService.getCourseBySlug(slug as string).catch(() => null);
          if (rawProduct) {
            // Unify response
            if (rawProduct.data) rawProduct = rawProduct.data;
          }
          related = Array.isArray(courses) ? courses : (courses?.data || courses?.courses || []);
          related = related.filter((c: any) => c.slug !== slug);
        } else if (productType === 'book') {
          const books = await bookService.getBooks();
          rawProduct = await bookService.getBookBySlug(slug as string).catch(() => null);
          if (rawProduct && rawProduct.data) rawProduct = rawProduct.data;
          related = Array.isArray(books) ? books : (books?.data || books?.books || []);
          related = related.filter((b: any) => b.slug !== slug);
        } else {
          const products = await productService.getProducts();
          rawProduct = await productService.getProductBySlug(slug as string).catch(() => null);
          if (rawProduct && rawProduct.data) rawProduct = rawProduct.data;
          related = Array.isArray(products) ? products : (products?.data || products?.products || []);
          related = related.filter((p: any) => p.slug !== slug);
        }

        if (rawProduct) {
          // Normalize product data
          const title = rawProduct.title || rawProduct.name;
          const price = Number(rawProduct.price || 0);
          const initialImg = rawProduct.thumbnail || rawProduct.coverImage || rawProduct.image || (rawProduct.images && rawProduct.images[0]?.url) || (rawProduct.images && rawProduct.images[0]);
          const images = [initialImg || placeholderImg];
          
          if (rawProduct.images && rawProduct.images.length > 1) {
            images.push(...rawProduct.images.slice(1).map((i: any) => i?.url || i || placeholderImg));
          }
          
          // Pad to at least 4 images for the gallery layout
          while(images.length < 4) {
             images.push(images[0]);
          }

          setProduct({
            id: rawProduct.id || rawProduct._id,
            type: productType,
            title,
            subtitle: rawProduct.shortDescription,
            description: rawProduct.description || 'Meaningful reminders to inspire your daily journey.',
            price,
            compareAtPrice: rawProduct.compareAtPrice ? Number(rawProduct.compareAtPrice) : undefined,
            images,
            category: productType === 'course' ? 'Courses' : productType === 'book' ? 'Books' : 'Merchandise',
            ctaLabel: productType === 'course' ? 'ENROLL NOW' : productType === 'book' ? 'BUY NOW' : 'ADD TO BAG',
            bestOffers: rawProduct.bestOffers,
            termsAndConditions: rawProduct.termsAndConditions,
            productDetails: rawProduct.productDetails
          });

          // Normalize related products
          setRelatedProducts(
            related.map((p: any) => ({
               title: p.title || p.name,
               price: Number(p.price || 0),
               description: p.description || '',
               images: [p.thumbnail || p.coverImage || p.image || (p.images && p.images[0]?.url) || (p.images && p.images[0]) || placeholderImg],
               category: productType,
               ctaLabel: 'SHOP NOW',
               slug: p.slug
            })).slice(0, 3)
          );
        } else {
          setProduct(null);
          setNotFound(true);
        }
      } catch (err) {
        console.error(err);
        setProduct(null);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDetails();
    }
  }, [slug, productType]);

  if (loading) {
    return <div className="pdp-loader">Loading...</div>;
  }

  if (notFound || !product) {
    return (
      <div style={{ padding: '10rem 2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: '#D4A96A', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '2rem' }}>Product Not Found</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '3rem' }}>The product you are looking for does not exist or has been removed.</p>
        <Link to={`/${productType}s`} style={{ background: 'linear-gradient(135deg, #E27D60, #D4A96A)', padding: '1rem 2rem', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: 'bold' }}>
          Back to {productType.charAt(0).toUpperCase() + productType.slice(1)}s
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      name: product.title,
      price: product.price,
      category: product.category,
      images: [product.images[0]],
      description: product.description,
      inStock: true,
      itemType: product.type,
    };
    addItem(cartProduct as any, 1);
  };

  const discountPercent = product.compareAtPrice 
    ? Math.round((1 - product.price / product.compareAtPrice) * 100) 
    : 0;

  return (
    <div className="pdp-container">
      
      {/* SECTION 1: HERO */}
      <section className="pdp-hero">
        <div className="pdp-hero-content">
          <div className="pdp-hero-left">
            <h1 className="pdp-hero-title">{product.title}</h1>
            <div className="pdp-hero-breadcrumb">
              <span className="pdp-arrow">→</span>
              <span className="pdp-breadcrumb-text">Pick</span>
            </div>
            <button className="pdp-hero-cta" onClick={handleAddToCart}>{product.ctaLabel}</button>
          </div>
          <div className="pdp-hero-right">
            <OptimizedImage src={founderImage} alt="Founder presentation" className="pdp-hero-image" priority={true} decoding="async" />
          </div>
        </div>
      </section>

      {/* SECTION 2: PRODUCT PRESENTATION */}
      <section className="pdp-main-section">
        <div className="pdp-main-header">
          <div className="pdp-line pdp-line-left"></div>
          <h2 className="pdp-main-title">{product.title}</h2>
          <div className="pdp-line pdp-line-right"></div>
        </div>
        <p className="pdp-main-subtitle">{product.subtitle || 'Talk to yourself like someone you love.'}</p>

        <div className="pdp-product-grid">
          <div className="pdp-gallery-col">
            <div className="pdp-gallery-main">
              <OptimizedImage src={product.images[activeImageIdx]} fallback={placeholderImg} alt={product.title} loading="eager" decoding="async" />
            </div>
            <div className="pdp-gallery-thumbs">
              {product.images.slice(0, 3).map((img, idx) => (
                <button 
                  key={idx} 
                  className={`pdp-thumb-btn ${idx === activeImageIdx ? 'active' : ''}`}
                  onClick={() => setActiveImageIdx(idx)}
                >
                  <OptimizedImage src={img} fallback={placeholderImg} alt={`Thumbnail ${idx+1}`} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="pdp-info-col">
            <h3 className="pdp-info-title">PORTFOLIOS</h3>
            <p className="pdp-info-desc">{product.description}</p>
            
            <div className="pdp-price-row">
              <span className="pdp-price">₹{product.price}</span>
              {product.compareAtPrice && (
                <>
                  <span className="pdp-price-old">₹{product.compareAtPrice}</span>
                  <span className="pdp-price-off">({discountPercent}% OFF)</span>
                </>
              )}
            </div>
            <p className="pdp-tax-note">inclusive of all taxes</p>
            
            <div className="pdp-actions">
              <button className="pdp-add-btn" onClick={handleAddToCart}>ADD TO BAG</button>
              <button className="pdp-wishlist-btn">WISHLIST</button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INFORMATION CARDS */}
      <section className="pdp-info-cards-section">
        <div className="pdp-info-cards-grid">
          <div className="pdp-info-card">
            <div className="pdp-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <h4>BEST OFFERS</h4>
            {product.bestOffers && product.bestOffers.length > 0 ? (
              <ul>
                {product.bestOffers.map((offer: string, idx: number) => (
                  <li key={idx}>{offer}</li>
                ))}
              </ul>
            ) : (
              <p className="pdp-empty-text">No current offers available.</p>
            )}
          </div>

          <div className="pdp-info-card">
            <div className="pdp-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <h4>TERMS & CONDITION</h4>
            {product.termsAndConditions && product.termsAndConditions.length > 0 ? (
              <ul>
                {product.termsAndConditions.map((term: string, idx: number) => (
                  <li key={idx}>{term}</li>
                ))}
              </ul>
            ) : (
              <p className="pdp-empty-text">Standard terms apply.</p>
            )}
          </div>

          <div className="pdp-info-card">
            <div className="pdp-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <h4>PRODUCT DETAILS</h4>
            {product.productDetails && product.productDetails.length > 0 ? (
              <ul>
                {product.productDetails.map((detail: string, idx: number) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            ) : (
              <p className="pdp-empty-text">No additional details.</p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: TESTIMONIALS */}
      <section className="pdp-testimonials">
        <h2 className="pdp-testimonials-title">What Others Are Saying</h2>
        <div className="pdp-test-container">
          <div className="pdp-test-left">
            <div className="pdp-test-rating-big">4.4 ★</div>
            <div className="pdp-test-bars">
              <div className="pdp-bar-row"><span>5★</span><div className="pdp-bar"><div className="pdp-bar-fill" style={{width: '70%'}}></div></div></div>
              <div className="pdp-bar-row"><span>4★</span><div className="pdp-bar"><div className="pdp-bar-fill" style={{width: '20%'}}></div></div></div>
              <div className="pdp-bar-row"><span>3★</span><div className="pdp-bar"><div className="pdp-bar-fill" style={{width: '5%'}}></div></div></div>
              <div className="pdp-bar-row"><span>2★</span><div className="pdp-bar"><div className="pdp-bar-fill" style={{width: '3%'}}></div></div></div>
              <div className="pdp-bar-row"><span>1★</span><div className="pdp-bar"><div className="pdp-bar-fill" style={{width: '2%'}}></div></div></div>
            </div>
          </div>
          <div className="pdp-test-right">
            {[1, 2, 3].map((_item, idx) => (
              <div className={`pdp-review-card pdp-review-${idx+1}`} key={idx}>
                <div className="pdp-review-quote-mark">”</div>
                <div className="pdp-review-header">
                  <OptimizedImage src={dummyAvatar} alt="Reviewer" loading="lazy" />
                  <div>
                    <h4>Full name</h4>
                    <div className="pdp-review-stars">★ ★ ★ ★ ★</div>
                  </div>
                </div>
                <p className="pdp-review-text">
                  5/5 I recently purchased an LV T-shirt, and it has exceeded my expectations in every way. The first thing I noticed was the quality of the fabric. It is made from soft, pure cotton, which feels extremely comfortable against the skin. {idx === 0 || idx === 2 ? "The material is lightweight, breathable, and perfect for everyday wear." : "It's a great, versatile choice for both casual outings and relaxed weekends."}
                </p>
                <div className="pdp-review-images">
                  <OptimizedImage src={product.images[0]} fallback={placeholderImg} alt="Review item" loading="lazy" />
                  <OptimizedImage src={product.images[0]} fallback={placeholderImg} alt="Review item" loading="lazy" />
                  <div className="pdp-review-more">+135</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="pdp-related">
          <div className="pdp-related-header">
            <h2 className="pdp-related-title">
              Similar {productType === 'course' ? 'Courses' : productType === 'book' ? 'Books' : 'Merchandise'}
            </h2>
            <div className="pdp-related-divider">
              <span className="pdp-related-line"></span>
              <span className="pdp-related-heart">♡</span>
              <span className="pdp-related-line"></span>
            </div>
          </div>
          <div className="pdp-related-grid">
            {relatedProducts.map((rel, idx) => (
              <div className="pdp-related-card" key={idx}>
                <div className="pdp-related-img-wrapper">
                  <OptimizedImage src={rel.images[0]} fallback={placeholderImg} alt={rel.title} loading="lazy" />
                </div>
                <div className="pdp-related-info">
                  <div className="pdp-related-icon">
                    {productType === 'course' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C39F87" strokeWidth="1"><path d="M12 22V12"></path><path d="M12 12c-2.5-2.5-6.5-1.5-8 1s1 5.5 3.5 5.5c2-1 4.5-6.5 4.5-6.5z"></path><path d="M12 12c2.5-2.5 6.5-1.5 8 1s-1 5.5-3.5 5.5c-2-1-4.5-6.5-4.5-6.5z"></path></svg>
                    ) : productType === 'book' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C39F87" strokeWidth="1"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C39F87" strokeWidth="1"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    )}
                  </div>
                  <h4 className="pdp-related-cat">{rel.title}</h4>
                  <p className="pdp-related-desc">{rel.description || "Simple Guides and Workbooks for your Personal Growth."}</p>
                  <div className="pdp-related-bottom">
                    <span className="pdp-related-arrow">›</span>
                    <Link to={`/${productType === 'merchandise' ? 'merchandise' : productType + 's'}/${rel.slug}`} className="pdp-related-link">
                      {productType === 'course' ? 'WORK WITH ME' : productType === 'book' ? 'BUY NOW' : 'SHOP NOW'} <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 6: EDITORIAL QUOTE */}
      <section className="pdp-quote-section" style={{ backgroundImage: `url(${leavesBg})` }}>
        <div className="pdp-quote-overlay">
          <div className="pdp-quote-content">
            <span className="pdp-quote-mark">“</span>
            <h2 className="pdp-quote-text">
              Welcome To Soul And Success, Let's Begin Your Journey Toward Healing, Growth, And Lasting Transformation Together.
            </h2>
          </div>
        </div>
      </section>

      {/* SECTION 7: FOUNDER SECTION */}
      <section className="pdp-founder">
        <div className="pdp-founder-container">
          <div className="pdp-founder-left">
            <h2 className="pdp-founder-title">About Jawedan Sehar</h2>
            <p className="pdp-founder-desc">
              I am a Certified Life Coach, Law Of Attraction Expert, NLP Practitioner and Ho'oponopono & EFT Healer. I help you transform your life with clarity, compassion and purpose. With years of leadership experience in the IT industry, I combine practical thinking with emotional healing to help you create lasting transformation. My approach is simple yet powerful to help you heal, grow and manifest the life you truly deserve. You are capable of more than you think.
            </p>
            <img src={signatureImg} alt="Signature" className="pdp-founder-signature" />
          </div>
          <div className="pdp-founder-right">
            <div className="pdp-founder-card">
              <OptimizedImage src={standingFounder} alt="Jawedan Sehar" className="pdp-founder-img" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProductDetailsPage;
