import { useEffect } from 'react';
import { SEOHead } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Link } from 'react-router-dom';

import skyImage from '@/assets/services.webp';
import bannerLeaves from '@/assets/services-banner-leaves.webp';

import lifeCoachingImg from '@/assets/Life-Coaching.webp';
import ebookImg from '@/assets/service-card-ebook.webp';
import merchImg from '@/assets/Merchandise.webp';

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

          <div className="services-page__cards">
            {/* Card 1: Life Coaching */}
            <div className="services-card">
              <div className="services-card__image-wrapper services-card__image-wrapper--blue">
                <OptimizedImage src={lifeCoachingImg} alt="Life Coaching" className="services-card__image services-card__image--coaching" loading="lazy" />
              </div>
              <div className="services-card__content">
                <div className="services-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="7" r="2.5"></circle>
                    <circle cx="9.5" cy="10.5" r="2.5"></circle>
                    <circle cx="14.5" cy="10.5" r="2.5"></circle>
                    <path d="M12 13v8"></path>
                    <path d="M12 17c-2 0-3-1-3-3 2 0 3 1 3 3z"></path>
                    <path d="M12 17c2 0 3-1 3-3-2 0-3 1-3 3z"></path>
                  </svg>
                </div>
                <h3 className="services-card__title" style={{ textTransform: 'uppercase' }}>Life Coaching</h3>
                <p className="services-card__desc">Programs to help you Heal, Clarify and Create the Life you Desire.</p>
                <div className="services-card__btn-wrapper">
                  <span className="services-card__btn-chevron" aria-hidden="true">&gt;</span>
                  <Link to="/courses" className="services-card__btn">
                    <span className="services-card__btn-text">WORK WITH ME</span>
                    <span className="services-card__btn-icon">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5H13M9 1L13 5L9 9" stroke="#000000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: E-Books */}
            <div className="services-card">
              <div className="services-card__image-wrapper services-card__image-wrapper--beige">
                <OptimizedImage src={ebookImg} alt="E-Books" className="services-card__image services-card__image--ebook-card" loading="lazy" />
              </div>
              <div className="services-card__content">
                <div className="services-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.3">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="services-card__title" style={{ textTransform: 'uppercase' }}>E-Books</h3>
                <p className="services-card__desc">Simple Guides and Workbooks for your Personal Growth.</p>
                <div className="services-card__btn-wrapper">
                  <span className="services-card__btn-chevron" aria-hidden="true">&gt;</span>
                  <Link to="/books" className="services-card__btn">
                    <span className="services-card__btn-text">BUY NOW</span>
                    <span className="services-card__btn-icon">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5H13M9 1L13 5L9 9" stroke="#000000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Merchandise */}
            <div className="services-card">
              <div className="services-card__image-wrapper services-card__image-wrapper--grey">
                <OptimizedImage src={merchImg} alt="Merchandise" className="services-card__image services-card__image--merch-card" loading="lazy" />
              </div>
              <div className="services-card__content">
                <div className="services-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.3">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <h3 className="services-card__title" style={{ textTransform: 'uppercase' }}>Merchandise</h3>
                <p className="services-card__desc">Meaningful Reminders to Inspire your Daily Journey.</p>
                <div className="services-card__btn-wrapper">
                  <span className="services-card__btn-chevron" aria-hidden="true">&gt;</span>
                  <Link to="/shop" className="services-card__btn">
                    <span className="services-card__btn-text">SHOP NOW</span>
                    <span className="services-card__btn-icon">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5H13M9 1L13 5L9 9" stroke="#000000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
