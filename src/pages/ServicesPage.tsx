import { useEffect } from 'react';
import { SEOHead } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Link } from 'react-router-dom';

import skyImage from '@/assets/services.webp';
import bannerLeaves from '@/assets/services-banner-leaves.webp';

import lifeCoachingImg from '@/assets/Life-Coaching.webp';
import ebookImg from '@/assets/service-card-ebook.webp';
import merchImg from '@/assets/Merchandise.webp';

import iconLifeCoaching from '@/assets/lifecoaching.svg';
import iconEbook from '@/assets/ebook.svg';
import iconMerch from '@/assets/merchandise.svg';

import './HomePage.css';
import './ServicesPage.css';

export function ServicesPage() {
  // Ensure we start at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEOHead
        title="Services | Soul & Success"
        description="Explore our coaching services, e-books, and merchandise."
      />

      <div className="services-page">
        {/* HERO SECTION */}
        <section className="services-page__hero">
          <OptimizedImage src={skyImage} alt="Starry night sky silhouette" className="services-page__hero-img" priority={true} decoding="async" />
        </section>

        {/* BANNER SECTION */}
        <section className="services-page__banner">
          <OptimizedImage src={bannerLeaves} alt="Botanical leaves background" className="services-page__banner-bg" loading="lazy" />
          <div className="services-page__banner-overlay"></div>

          <div className="services-page__banner-content">
            <div className="services-page__banner-line"></div>
            <h1 className="services-page__banner-title">My Services</h1>
            <div className="services-page__banner-line"></div>
          </div>
        </section>

        {/* SERVICES CONTENT AREA */}
        <section className="services-page__content">
          {/* Full-width Top Background Line */}
          <div className="services-page__top-line"></div>

          {/* Decorative Leaf SVG on the top right */}
          <div className="services-page__leaf-decoration" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M58.6667 106.667C49.3017 106.695 40.2681 103.203 33.3575 96.8821C26.4469 90.5616 22.1641 81.8748 21.3586 72.5444C20.5531 63.2141 23.2837 53.9218 29.0088 46.5105C34.734 39.0992 43.0354 34.1102 52.2667 32.5332C82.6667 26.6665 90.6667 23.8932 101.333 10.6665C106.667 21.3332 112 32.9598 112 53.3332C112 82.6665 86.5067 106.667 58.6667 106.667Z"
                stroke="#E2D0C3"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6666 112C10.6666 96 20.5333 83.4133 37.76 80C50.6666 77.44 64 69.3333 69.3333 64"
                stroke="#E2D0C3"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Divider above cards */}
          <div className="services-page__divider" aria-hidden="true">
            <div className="services-page__divider-line" />
            <svg className="services-page__divider-diamond" width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 12C7 12 1 8 1 4C1 2.34315 2.34315 1 4 1C5.30622 1 6.41746 1.83481 6.85424 3C6.94079 3.22694 7.05921 3.22694 7.14576 3C7.58254 1.83481 8.69378 1 10 1C11.6569 1 13 2.34315 13 4C13 8 7 12 7 12Z" fill="none" stroke="#C4B0A4" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <div className="services-page__divider-line" />
          </div>

          <div className="home-section-4__grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {/* Card 1: Life Coaching */}
              <div className="home-section-4__card">
                <div className="home-section-4__card-img-wrapper">
                  <OptimizedImage src={lifeCoachingImg} alt="Life Coaching" className="home-section-4__card-img-1" loading="lazy" />
                </div>
                <div className="home-section-4__card-content">
                  <img src={iconLifeCoaching} alt="Life Coaching Icon" className="home-section-4__icon" />
                  <h3 className="home-section-4__card-title">Life Coaching</h3>
                  <p className="home-section-4__card-desc">Programs to help you Heal, Clarify and Create the Life you Desire.</p>
                  <Link to="/courses" className="home-section-4__cta">
                    <span className="home-section-4__cta-chevron">&gt;</span>
                    <span className="home-section-4__cta-pill">
                      <span className="home-section-4__cta-text">WORK WITH ME</span>
                      <span className="home-section-4__cta-arrow">➔</span>
                    </span>
                  </Link>
                </div>
              </div>

              {/* Card 2: E-Book */}
              <div className="home-section-4__card">
                <div className="home-section-4__card-img-wrapper home-section-4__card-img-wrapper--ebook">
                  <OptimizedImage src={ebookImg} alt="E-Book" className="home-section-4__card-img-2" loading="lazy" />
                </div>
                <div className="home-section-4__card-content">
                  <img src={iconEbook} alt="E-Book Icon" className="home-section-4__icon" />
                  <h3 className="home-section-4__card-title">E-Books</h3>
                  <p className="home-section-4__card-desc">Simple Guides and Workbooks for your Personal Growth.</p>
                  <Link to="/books" className="home-section-4__cta">
                    <span className="home-section-4__cta-chevron">&gt;</span>
                    <span className="home-section-4__cta-pill">
                      <span className="home-section-4__cta-text">BUY NOW</span>
                      <span className="home-section-4__cta-arrow">➔</span>
                    </span>
                  </Link>
                </div>
              </div>

              {/* Card 3: Merchandise */}
              <div className="home-section-4__card">
                <div className="home-section-4__card-img-wrapper home-section-4__card-img-wrapper--merch">
                  <OptimizedImage src={merchImg} alt="Merchandise" className="home-section-4__card-img-3" loading="lazy" />
                </div>
                <div className="home-section-4__card-content">
                  <img src={iconMerch} alt="Merchandise Icon" className="home-section-4__icon" />
                  <h3 className="home-section-4__card-title">Merchandise</h3>
                  <p className="home-section-4__card-desc">Meaningful Reminders to Inspire your Daily Journey.</p>
                  <Link to="/shop" className="home-section-4__cta">
                    <span className="home-section-4__cta-chevron">&gt;</span>
                    <span className="home-section-4__cta-pill">
                      <span className="home-section-4__cta-text">SHOP NOW</span>
                      <span className="home-section-4__cta-arrow">➔</span>
                    </span>
                  </Link>
                </div>
              </div>
          </div>
        </section>
      </div>
    </>
  );
}
