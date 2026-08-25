import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SEOHead } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { resolveImageUrl } from '@/utils';
import { productService } from '@/services/productService';
import { useCart } from '@/context/CartContext';
import './CoursesPage.css'; // Reuse exact layout styles

// Assets
import heroImage from '@/assets/intro-portrait-actual.webp';
import personImage from '@/assets/hero-portrait-actual.webp';
import merchImage from '@/assets/Merchandise.webp';

const IconMerch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" stroke="#CBAE9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productService.getProducts();
        const prodData = res.data || res || [];
        setProducts(Array.isArray(prodData) ? prodData : (prodData.data || []));
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    const cartProduct = {
      id: product.id || `prod_${Date.now()}`,
      name: product.name || product.title,
      price: Number(product.price || 0),
      category: 'Merchandise',
      images: [resolveImageUrl(product.coverImage || product.image, merchImage)],
      description: product.description || '',
      inStock: true,
      itemType: 'product',
    };
    addItem(cartProduct as any, 1);
  };

  const handleBuyNow = (product: any) => {
    handleAddToCart(product);
    navigate('/shop/cart');
  };

  // Testimonials logic (same as Courses/Books)
  const allTestimonials = [
    { name: "Charlotte P.", quote: "Vitae tristique feu senectus sed egestas egestas fringilla. At risus viverra integer adipiscing at in tellus nus.", image: personImage },
    { name: "Sara and Allan", quote: "Diam tristique feu senectus sed egestas egestas fringilla. At risus viverra integer adipiscing at in tellus mass.", image: personImage },
    { name: "Ingrid G.", quote: "Morbi tristique feu senectus sed egestas egestas fringilla. At risus viverra integer adipiscing at in tellus sed.", image: personImage },
    { name: "Anna H.", quote: "Vitae tristique feu senectus sed egestas egestas fringilla. At risus viverra integer adipiscing at in tellus nus.", image: personImage },
    
    { name: "Michael T.", quote: "Amet luctus venenatis lectus magna fringilla urna porttitor. Facilisis sed odio morbi quis commodo.", image: personImage },
    { name: "Emma W.", quote: "Nisi est sit amet facilisis magna etiam. Dictum varius duis at consectetur lorem donec massa sapien.", image: personImage },
    { name: "Oliver R.", quote: "Sit amet facilisis magna etiam tempor. Velit aliquet sagittis id consectetur purus ut faucibus pulvinar.", image: personImage },
    { name: "Sophia L.", quote: "In hendrerit gravida rutrum quisque non tellus orci. Eget felis eget nunc lobortis mattis aliquam faucibus.", image: personImage },

    { name: "James B.", quote: "Sed vulputate mi sit amet mauris. Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget.", image: personImage },
    { name: "Isabella K.", quote: "Viverra vitae congue eu consequat. Turpis in eu mi bibendum neque egestas congue. Malesuada fames.", image: personImage },
    { name: "William C.", quote: "Ut consequat semper viverra nam libero justo laoreet sit. Arcu cursus vitae congue mauris rhoncus.", image: personImage },
    { name: "Mia D.", quote: "Aliquam ut porttitor leo a diam. Vitae sapien pellentesque habitant morbi tristique senectus et.", image: personImage },
  ];

  const handleNextPage = () => setCurrentTestimonialPage((prev) => (prev + 1) % 3);
  const handlePrevPage = () => setCurrentTestimonialPage((prev) => (prev - 1 + 3) % 3);

  const displayedTestimonials = allTestimonials.slice(currentTestimonialPage * 4, currentTestimonialPage * 4 + 4);

  return (
    <>
      <SEOHead
        title="Merchandise | Soul & Success"
        description="Buy Products From Here. Talk to yourself like someone you love."
      />

      <main className="courses-page-container">
        {/* HERO SECTION */}
        <section className="courses-hero">
          <div className="courses-hero-content">
            <h1 className="courses-hero-heading">Buy Products From Here</h1>
            <p className="courses-hero-subtitle">Talk to yourself like someone you love.</p>
            <div className="courses-hero-cta">
              <span className="cta-arrow">→</span>
              <button className="courses-btn-primary" onClick={() => {
                const el = document.getElementById('merch-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>BUY NOW</button>
            </div>
          </div>
          <div className="courses-hero-image-wrapper">
            <OptimizedImage src={heroImage} alt="Jawedan Sehar" className="courses-hero-image" priority={true} decoding="async" />
          </div>
          <div className="courses-hero-scroll-indicator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#BC957B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </section>

        {/* QUOTE SECTION */}
        <section className="courses-quote">
          <div className="quote-text-container">
            <div className="quote-marks quote-left">“</div>
            <div className="quote-decorative-header">
              <div className="quote-line"></div>
              <div className="quote-small-mark">“</div>
              <div className="quote-line"></div>
            </div>
            <h2 className="quote-text">EVERYTHING IN THIS SHOP IS SOMETHING I ACTUALLY REACH FOR — NOTHING MADE JUST TO SELL.</h2>
            <p className="quote-signature">~ Jawedan</p>
          </div>
        </section>

        {/* COLLECTION SECTION */}
        <section className="courses-collection" id="merch-collection">
          <div className="collection-header">
            <span className="collection-eyebrow">SHOP THE COLLECTION</span>
            <div className="collection-divider"></div>
            <h3 className="collection-heading">Small Things That Hold Big Reminders</h3>
            
            <div className="collection-leaf">
              <svg xmlns="http://www.w3.org/2000/svg" width="182" height="192" viewBox="0 0 182 192" fill="none" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path d="M75.0037 190.166C56.5377 190.222 38.7251 183.346 25.0988 170.903C11.4725 158.46 3.02774 141.358 1.43945 122.988C-0.148831 104.619 5.23536 86.3251 16.5242 71.7342C27.813 57.1432 44.1818 47.3213 62.3841 44.2164C122.327 32.6664 138.101 27.2065 159.134 1.1665C169.65 22.1665 180.167 45.0564 180.167 85.1664C180.167 142.916 129.899 190.166 75.0037 190.166Z" stroke="#BC957B" strokeOpacity="0.2" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="59" height="98" viewBox="0 0 119 98" fill="none" style={{ position: 'absolute', top: 30, left: 0 }}>
                <path d="M1.1665 96.1665C1.1665 64.4998 20.6756 39.5887 54.7374 32.8332C80.2574 27.7665 106.621 11.7221 117.167 1.1665" stroke="#BC957B" strokeOpacity="0.2" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="collection-grid">
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', fontSize: '18px', color: '#896A56' }}>
                Loading Merchandise...
              </div>
            ) : products.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', fontSize: '18px', color: '#896A56' }}>
                No Merchandise available at the moment.
              </div>
            ) : (
              (() => {
                const displayedProducts = products.slice(0, 6);
                
                return displayedProducts.map((product, idx) => (
                  <React.Fragment key={product.id}>
                    <div className="collection-card">
                      <div className="card-image-wrapper" style={{ backgroundColor: '#D7CEC8' }}>
                        <OptimizedImage src={product.coverImage || product.image} fallback={merchImage} alt={product.name} className="card-image" loading="lazy" />
                      </div>
                      <div className="card-content">
                        <div className="card-icon"><IconMerch /></div>
                        <Link to={`/merchandise/${product.slug}`} style={{ textDecoration: 'none' }}>
                          <h4 className="card-category">{product.name}</h4>
                        </Link>
                        <p className="card-desc">{product.description}</p>
                        
                        <div className="card-cta-container">
                          <span className="card-cta-arrow-out">&gt;</span>
                          <button 
                            className="card-cta" 
                            onClick={() => handleBuyNow(product)}
                            style={{ opacity: 1, cursor: 'pointer' }}
                          >
                            SHOP NOW <span className="card-cta-arrow-in">→</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Add dividers between rows like in Courses if it's the end of a row (idx % 3 === 2) */}
                    {(idx + 1) % 3 === 0 && idx !== displayedProducts.length - 1 && (
                      <div className="collection-row-divider" style={{ gridColumn: '1 / -1' }}>
                        <div className="row-divider-line"></div>
                        <div className="row-divider-heart">♡</div>
                        <div className="row-divider-line"></div>
                      </div>
                    )}
                  </React.Fragment>
                ));
              })()
            )}
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="courses-testimonials">
          <div className="testimonials-header">
            <h2 className="testimonials-heading">Testimonials.</h2>
            <p className="testimonials-subheading">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
            <div className="testimonials-divider"></div>
          </div>

          <div className="testimonials-track">
            {/* Nav Left */}
            <button className="testimonials-nav prev" onClick={handlePrevPage}>
              <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 6H0M0 6L6 0M0 6L6 12" stroke="white" strokeWidth="1"/>
              </svg>
            </button>

            <div className="testimonials-cards">
              {displayedTestimonials.map((testimonial, idx) => (
                <div className="testimonial-card" key={idx}>
                  <div className="testimonial-image-wrapper">
                    <OptimizedImage src={testimonial.image} alt={testimonial.name} className="testimonial-image" loading="lazy" />
                  </div>
                  <div className="testimonial-content">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-quote">{testimonial.quote}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Nav Right */}
            <button className="testimonials-nav next" onClick={handleNextPage}>
              <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6H60M60 6L54 0M60 6L54 12" stroke="white" strokeWidth="1"/>
              </svg>
            </button>
          </div>

          <div className="testimonials-pagination">
            <span className="pagination-text">0{currentTestimonialPage + 1}</span>
            <div className="pagination-line"></div>
            <span className="pagination-text">03</span>
          </div>
        </section>

        {/* NEWSLETTER SECTION */}
        <section className="courses-newsletter">
          <div className="newsletter-content">
            <h3 className="newsletter-heading">SUBSCRIBE TO OUR NEWSLETTER</h3>
            <p className="newsletter-desc">
              Our latest product launches, interesting reads, exclusive interviews and<br />
              more - delivered straight to your inbox every month.
            </p>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter Your Email Address" className="newsletter-input" />
            <button className="newsletter-btn">SUBMIT</button>
          </div>
        </section>
      </main>
    </>
  );
}
