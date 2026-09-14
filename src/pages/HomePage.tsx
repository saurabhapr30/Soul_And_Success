import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SEOHead, Button, Icon, SectionHeading } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useScrollReveal } from '@/hooks';
import { cn, resolveImageUrl, resolveOptimizedImageUrl } from '@/utils';
import api from '../services/api';

import heroPortrait from '@/assets/hero-portrait-actual.webp';
import introPortrait from '@/assets/intro-portrait-actual.webp';
import signatureImg from '@/assets/signature.png';
import leavesImg from '@/assets/leaves.webp';
import serviceCoaching from '../assets/Life-Coaching.webp';
import serviceEbook from '../assets/Ebook.webp';
import serviceProducts from '../assets/Merchandise.webp';
import blogFeatured from '@/assets/blog-featured.webp';
import whatsappIcon from '@/assets/whatsapp.png';
import logoImg from '@/assets/logo.webp';
import leafSvg from '@/assets/leaf.svg';

import './HomePage.css';

/* ================================================== */
/* HOME PAGE                                            */
/* ================================================== */
/* Reproduces the supplied Figma home page reference.   */
/* Composed of page-specific sections using existing    */
/* components and design tokens.                        */
/* ================================================== */

export function HomePage() {
  return (
    <>
      <SEOHead
        title="Soul & Success — Find Your Inner Compass"
        description="Discover balance, clarity, and purposeful living with Soul & Success. Coaching, courses, books, and resources for personal transformation."
      />

      <div className="home-page">
        {/* The 1920px reference wrapper */}
        <div className="home-container">
          {/* Main Background */}
          <div className="home-bg" />

          {/* SECTION 1: HERO */}
          <section className="home-hero">
            <div className="home-hero__image-wrapper">
              <OptimizedImage
                src={heroPortrait}
                alt="Jawedan Seher"
                className="home-hero__image"
                priority={true}
                decoding="async"
              />
            </div>
            
            <div className="home-hero__signature-block">
              <img src={signatureImg} alt="Jawedan Sehar Signature" className="home-hero__signature home-hero__signature--desktop" />
              <h2 className="home-hero__signature home-hero__signature--mobile">Jawedan Sehar</h2>
              <p className="home-hero__signature-title">Certified Life Coach</p>
              <p className="home-hero__signature-subtitle">YOUR ACCOUNTABILITY COACH</p>
            </div>
            
            <div className="home-hero__curve" aria-hidden="true">
              <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path d="M0,120 C480,0 960,0 1440,120 L1440,120 L0,120 Z" fill="#FBFAF8"></path>
              </svg>
            </div>

            <div className="home-hero__text-block">
              <span className="home-hero__caption">SOUL AND SUCCESS</span>
              <h1 className="home-hero__title">
                FIND YOUR<br />INNER COMPASS
              </h1>
              
              <div className="home-hero__divider">
                <div className="home-hero__divider-line"></div>
                <div className="home-hero__divider-diamond"></div>
                <div className="home-hero__divider-line"></div>
              </div>

              <p className="home-hero__subtitle">
                HEAL. GROW. MANIFEST. TRANSFORM.
              </p>
              <p className="home-hero__description">
                Life coaching to help you heal, grow and create a life that feels aligned with your soul.
              </p>
              <div className="home-hero__actions">
                <button className="home-hero__btn-primary">START YOUR JOURNEY</button>
                <button className="home-hero__btn-secondary">
                  <Icon name="youtube" size="sm" decorative /> Watch Intro
                </button>
              </div>
            </div>
          </section>

          {/* OVERLAPPING PODCAST CARD */}
          {/* Stop here for Phase 2 validation */}
        </div>

        {/* Phase 3: Section 2 (You're Not Alone) */}
        <div className="home-section-2">
          <div className="home-section-2__container">
            <div className="home-section-2__content">
              <h2 className="home-section-2__title">YOU'RE NOT ALONE</h2>
              <div className="home-section-2__divider-row">
                <div className="home-section-2__divider-line" />
                <span className="home-section-2__divider-heart">♡</span>
                <div className="home-section-2__divider-line" />
              </div>
              <span className="home-section-2__caption">COACHING FOR EVERY PART OF YOUR JOURNEY.</span>
              <div className="home-section-2__grid" data-node-id="20:432">
                {[
                  {
                    title: 'Heal',
                    lines: ['Release, restore and feel', 'complete.'],
                    variant: 'serif',
                    icon: (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    )
                  },
                  {
                    title: 'Grow',
                    lines: ['Build clarity and', 'confidence.'],
                    variant: 'script',
                    icon: (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path d="M2 22l8-8" />
                      </svg>
                    )
                  },
                  {
                    title: 'Manifest',
                    lines: ['Align with your', 'dream life.'],
                    variant: 'serif',
                    icon: (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                        <circle cx="18" cy="6" r="1.2" fill="#BC957B" />
                        <circle cx="6" cy="18" r="0.9" fill="#BC957B" />
                      </svg>
                    )
                  },
                  {
                    title: 'Thrive',
                    lines: ['Create habits', 'that last.'],
                    variant: 'script',
                    icon: (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12l3 3 5-5" />
                      </svg>
                    )
                  },
                  {
                    title: 'Self Love',
                    lines: ['Nurture  self', 'compassion.'],
                    variant: 'serif',
                    icon: (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2" />
                      </svg>
                    )
                  },
                  {
                    title: 'Balance',
                    lines: ['Find peace in mind, body', 'and soul.'],
                    variant: 'script',
                    icon: (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="7" r="2.5" />
                        <circle cx="12" cy="17" r="2.5" />
                        <circle cx="7" cy="12" r="2.5" />
                        <circle cx="17" cy="12" r="2.5" />
                        <circle cx="12" cy="12" r="1.5" fill="#BC957B" />
                        <path d="M12 19.5v2.5" />
                      </svg>
                    )
                  }
                ].map((item) => (
                  <div className="home-section-2__column" key={item.title}>
                    <div className="home-section-2__icon">{item.icon}</div>
                    <h3 className={`home-section-2__item-title home-section-2__item-title--${item.variant}`}>
                      {item.title}
                    </h3>
                    <p className="home-section-2__item-desc">
                      {item.lines.map((line, lIdx) => (
                        <span key={lIdx}>{line}</span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 4: Section 3 (Meet the Founder) */}
        <section className="home-section-3">
          <div className="home-section-inner-1920">
            <div className="home-section-3__group">
              <OptimizedImage src={introPortrait} alt="Jawedan Sehar" className="home-section-3__portrait" loading="lazy" />
              <span className="home-section-3__label">Meet The Founder</span>
              <h2 className="home-section-3__script">Hey Iam Jawedan</h2>
              <h3 className="home-section-3__subtitle">and I’m so happy to meet you!</h3>
              <div className="home-section-3__bio">
                <p className="home-section-3__bio-p1">
                  I am a Certified Life Coach, Law Of Attraction Expert, NLP Practitioner and Ho'oponopono &amp; EFT Healer. I help you transform your life with clarity, compassion and purpose.
                </p>
                <p className="home-section-3__bio-p2">
                  With years of leadership experience in the IT industry, I combine practical thinking with emotional healing to help you create lasting transformation.
                </p>
                <p className="home-section-3__bio-p3">
                  My approach is simple yet powerful to help you heal, grow and manifest the life you truly deserve. You are capable of more than you think.
                </p>
              </div>
              <button className="home-section-3__cta">LEARN MORE</button>
            </div>
          </div>
        </section>

        {/* Phase 5: Section 4 (How I Can Support You) */}
        <section className="home-section-4">
          <div className="home-section-4__container">
            <div className="home-section-4__header">
              <h2 className="home-section-4__title">How I Can Support You</h2>
              <div className="home-section-4__divider">
                <div className="home-section-4__line"></div>
                <div className="home-section-4__diamond"></div>
                <div className="home-section-4__line"></div>
              </div>
            </div>
            
            <div className="home-section-4__grid">
              {/* Card 1: Life Coaching */}
              <div className="home-section-4__card">
                <div className="home-section-4__card-img-wrapper">
                  <OptimizedImage src={serviceCoaching} alt="Life Coaching" className="home-section-4__card-img-1" loading="lazy" />
                </div>
                <div className="home-section-4__card-content">
                  <svg className="home-section-4__icon" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.3">
                    <path d="M12 22C12 22 4 16 4 10C4 6 7 3 12 3C17 3 20 6 20 10C20 16 12 22 12 22Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <h3 className="home-section-4__card-title">LIFE COACHING</h3>
                  <p className="home-section-4__card-desc">Programs to help you Heal, Clarify and Create the Life you Desire.</p>
                  <Link to="/services" className="home-section-4__cta">
                    <span className="home-section-4__cta-chevron">&gt;</span>
                    <span className="home-section-4__cta-text">WORK WITH ME</span>
                    <span className="home-section-4__cta-arrow">→</span>
                  </Link>
                </div>
              </div>

              {/* Card 2: E-Book */}
              <div className="home-section-4__card">
                <div className="home-section-4__card-img-wrapper">
                  <OptimizedImage src={serviceEbook} alt="E-Book" className="home-section-4__card-img-2" loading="lazy" />
                </div>
                <div className="home-section-4__card-content">
                  <svg className="home-section-4__icon" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.3">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  <h3 className="home-section-4__card-title">E-BOOK</h3>
                  <p className="home-section-4__card-desc">Simple yet powerful E-Books for your Personal Growth.</p>
                  <Link to="/books" className="home-section-4__cta">
                    <span className="home-section-4__cta-chevron">&gt;</span>
                    <span className="home-section-4__cta-text">BUY NOW</span>
                    <span className="home-section-4__cta-arrow">→</span>
                  </Link>
                </div>
              </div>

              {/* Card 3: Merchandise */}
              <div className="home-section-4__card">
                <div className="home-section-4__card-img-wrapper">
                  <OptimizedImage src={serviceProducts} alt="Merchandise" className="home-section-4__card-img-3" loading="lazy" />
                </div>
                <div className="home-section-4__card-content">
                  <svg className="home-section-4__icon" viewBox="0 0 24 24" fill="none" stroke="#BC957B" strokeWidth="1.3">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <h3 className="home-section-4__card-title">MERCHANDISE</h3>
                  <p className="home-section-4__card-desc">Meaningful Reminders to Inspire your Daily Journey.</p>
                  <Link to="/shop" className="home-section-4__cta">
                    <span className="home-section-4__cta-chevron">&gt;</span>
                    <span className="home-section-4__cta-text">SHOP NOW</span>
                    <span className="home-section-4__cta-arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Podcasts & Videos (Child of Section 4) */}
          <div className="home-podcast-card">
            <div className="home-podcast-card__text">
              <span className="home-podcast-card__label">LISTEN & GROW</span>
              <h2 className="home-podcast-card__title">Podcasts & Videos</h2>
              <p className="home-podcast-card__desc">Real conversations and powerful insights on life, healing, mindset and success.</p>
              <button className="home-podcast-card__btn">CONNECT WITH ME</button>
            </div>
            <div className="home-podcast-card__socials">
              <div className="home-podcast-card__social home-podcast-card__social--spotify">
                <div className="home-podcast-card__icon-wrapper">
                  <Icon name="spotify" size="xl" />
                </div>
                <div className="home-podcast-card__social-name">Spotify</div>
                <div className="home-podcast-card__social-action">Listen Now</div>
              </div>
              <div className="home-podcast-card__social home-podcast-card__social--youtube">
                <div className="home-podcast-card__icon-wrapper">
                  <Icon name="youtube" size="xl" />
                </div>
                <div className="home-podcast-card__social-name">YouTube</div>
                <div className="home-podcast-card__social-action">Subscribe Now</div>
              </div>
              <div className="home-podcast-card__social home-podcast-card__social--instagram">
                <div className="home-podcast-card__icon-wrapper">
                  <Icon name="instagram" size="xl" />
                </div>
                <div className="home-podcast-card__social-name">Instagram</div>
                <div className="home-podcast-card__social-action">Follow Me</div>
              </div>
              <div className="home-podcast-card__social home-podcast-card__social--facebook">
                <div className="home-podcast-card__icon-wrapper">
                  <Icon name="facebook" size="xl" />
                </div>
                <div className="home-podcast-card__social-name">Facebook</div>
                <div className="home-podcast-card__social-action">Follow Me</div>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 6: Section 6 — My Latest Blogs (Live from API) */}
        <HomeBlogSlider />

        {/* Phase 7: YouTube Section */}
        <section className="home-youtube">
          <div className="home-youtube__pills">
            <div className="home-youtube__pill home-youtube__pill--purple">
              <span className="home-youtube__text">YOUTUBE</span>
              <div className="home-youtube__line" />
            </div>
            <div className="home-youtube__pill home-youtube__pill--green">
              <span className="home-youtube__text">YOUTUBE</span>
              <div className="home-youtube__line" />
            </div>
            <div className="home-youtube__pill home-youtube__pill--red">
              <span className="home-youtube__text">YOUTUBE</span>
              <div className="home-youtube__line" />
            </div>
          </div>
        </section>

        {/* Phase 8: Journey CTA Banner (Node 20:739) */}
        <section className="home-section-6" data-node-id="20:739">
          {/* Logo (image 3) */}
          <img src={logoImg} alt="Soul & Success" className="home-section-6__logo" />

          {/* Center Text Block (div.flex-1) */}
          <div className="home-section-6__text-block">
            <h2 className="home-section-6__title">
              <span>YOUR JOURNEY TOWARDS PEACE,</span>
              <span>CLARITY AND SUCCESS BEGINS TODAY.</span>
            </h2>
            <p className="home-section-6__desc">LET'S TAKE THE FIRST STEP TOGETHER.</p>
          </div>

          {/* Right CTA Block (div.text-right) */}
          <div className="home-section-6__right">
            <Link to="/courses" className="home-section-6__cta-btn">
              <span>CHOOSE YOUR PROGRAM</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <p className="home-section-6__cta-sub">Begin your transformation today.</p>
          </div>

          {/* Decorative Leaf Flourish (Component 1) */}
          <img src={leafSvg} alt="" className="home-section-6__leaf" aria-hidden="true" />
        </section>



          {/* FOOTER */}
          <footer className="home-section-7">
            {/* Top Row: Brand + Link Columns */}
            <div className="home-section-7__top">
              <div className="home-section-7__brand">
                <div className="home-section-7__brand-header">
                  <img src={logoImg} alt="Soul And Success" className="home-section-7__logo" />
                  <div>
                    <h2 className="home-section-7__brand-title">SOUL AND SUCCESS</h2>
                    <p className="home-section-7__brand-subtitle">FIND YOUR INNER COMPASS</p>
                  </div>
                </div>
                <div className="home-section-7__brand-socials">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Icon name="instagram" size="sm" decorative />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Icon name="facebook" size="sm" decorative />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <Icon name="youtube" size="sm" decorative />
                  </a>
                  <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" aria-label="Spotify" style={{ color: '#1DB954' }}>
                    <Icon name="spotify" size="sm" decorative />
                  </a>
                </div>
              </div>

              <div className="home-section-7__links">
                <div className="home-section-7__link-col">
                  <h3 className="home-section-7__link-heading">Quick Links</h3>
                  <ul className="home-section-7__link-list">
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/blog">Resources</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                  </ul>
                </div>
                <div className="home-section-7__link-col">
                  <h3 className="home-section-7__link-heading">Services</h3>
                  <ul className="home-section-7__link-list">
                    <li><Link to="/services">Life Coaching</Link></li>
                    <li><Link to="/services">NLP Coaching</Link></li>
                    <li><Link to="/services">Healing Sessions</Link></li>
                    <li><Link to="/services">Law Of Attraction Mastery</Link></li>
                  </ul>
                </div>
                <div className="home-section-7__link-col">
                  <h3 className="home-section-7__link-heading">Resources</h3>
                  <ul className="home-section-7__link-list">
                    <li><Link to="/books">E-Books</Link></li>
                    <li><Link to="/blog">Free Blogs</Link></li>
                    <li><Link to="/shop">Merchandise</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Middle Row: Subscribe + Contact + WhatsApp */}
            <div className="home-section-7__middle">
              <div className="home-section-7__subscribe">
                <h3 className="home-section-7__subscribe-heading">Stay Connected</h3>
                <p className="home-section-7__subscribe-desc">Get tips and inspiration straight to your inbox.</p>
                <div className="home-section-7__subscribe-form">
                  <input type="email" placeholder="Your email address" className="home-section-7__subscribe-input" />
                  <button className="home-section-7__subscribe-btn" aria-label="Subscribe">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="home-section-7__contact">
                <h3 className="home-section-7__contact-heading">Contact Us</h3>
                <div className="home-section-7__contact-row">
                  <Icon name="mail" size="sm" decorative />
                  <span>jaw.sehar@gmail.com</span>
                </div>
                <div className="home-section-7__contact-row">
                  <Icon name="map-pin" size="sm" decorative />
                  <span>India</span>
                </div>
              </div>

              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="home-section-7__whatsapp">
                <img src={whatsappIcon} alt="WhatsApp" className="home-section-7__whatsapp-icon" />
              </a>
            </div>

            {/* Bottom Bar */}
            <div className="home-section-7__bottom-bar">
              <div className="home-section-7__copyright">
                © 2026 Soul And Success. All rights reserved.
              </div>
              <div className="home-section-7__legal">
                <span>Privacy Policy</span>
                <span className="home-section-7__separator">|</span>
                <span>Terms &amp; Conditions</span>
              </div>
            </div>
          </footer>
        </div>
      </>
    );
  }

/* ================================================== */
/* PAIN POINTS — "You're Not Alone"                     */
/* ================================================== */

const PAIN_POINTS = [
  { icon: 'user', label: 'Fear' },
  { icon: 'star', label: 'Stress' },
  { icon: 'clock', label: 'Mindset' },
  { icon: 'search', label: 'Therapy' },
  { icon: 'star-filled', label: 'Self-Care' },
  { icon: 'calendar', label: 'Balance' },
];

export function HomePainPoints() {
  const { ref } = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={cn('home-pain-points', 'reveal')}>
      <div className="container">
        <SectionHeading
          caption="We understand your struggles"
          title="You're Not Alone"
          subtitle="Whatever you're facing right now, know that it's okay. We're here to help you navigate life's challenges with compassion and clarity."
          alignment="center"
        />

        <div className="home-pain-points__icons">
          {PAIN_POINTS.map((item) => (
            <div key={item.label} className="home-pain-points__item">
              <Icon
                name={item.icon}
                size="lg"
                className="home-pain-points__item-icon"
                decorative
              />
              <span className="home-pain-points__item-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================== */
/* INTRO — "Hey, I'm Jameelah"                         */
/* ================================================== */

export function HomeIntro() {
  const { ref } = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={cn('home-intro', 'reveal')}>
      <div className="container">
        <div className="home-intro__card">
          {/* Content */}
          <div className="home-intro__content">
            <span className="home-intro__caption">About the Founder</span>
            <h2 className="home-intro__name">Hey, I'm Jawedan Seher</h2>
            <p className="home-intro__tagline">and I'm so happy to meet you.</p>
            <p className="home-intro__text">
              As a coach, author, life-skills facilitator and entrepreneur,
              I empower individuals and families to discover their authentic
              path to happiness and success.
            </p>
            <p className="home-intro__text">
              With a rich understanding of diverse cultures and
              a deep passion for personal development,
              I bring a unique, compassionate perspective to every conversation.
              My goal is to help you create a life filled with purpose, peace,
              and meaningful connections.
            </p>
            <img 
              src={signatureImg} 
              alt="Jawedan Seher Signature" 
              className="home-intro__signature" 
              style={{ maxWidth: '12rem', marginTop: 'var(--space-2)', marginBottom: 'var(--space-6)' }} 
            />
            <Button variant="primary" href="/about">
              Read More
            </Button>
          </div>

          {/* Image */}
          <div className="home-intro__image-col">
            <img
              src={introPortrait}
              alt="Jawedan Seher — life coach, author, and facilitator"
              className="home-intro__image"
              width={640}
              height={760}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================== */
/* ================================================== */
/* SERVICES — "How I Can Support You"                   */
/* ================================================== */
/* ================================================== */

const HOME_SERVICES = [
  {
    id: 'coaching',
    title: 'Life Coaching',
    description: 'Clarity-focused coaching sessions to help you break through barriers and move towards the life you envision.',
    image: serviceCoaching,
    href: '/services',
  },
  {
    id: 'ebook',
    title: 'E-Books',
    description: 'Curated self-help guides and workbooks designed to support your personal growth journey.',
    image: serviceEbook,
    href: '/books',
  },
  {
    id: 'products',
    title: 'Shop Products',
    description: 'Handpicked wellness products, journals, and lifestyle essentials curated for intentional living.',
    image: serviceProducts,
    href: '/shop',
  },
];

export function HomeServices() {
  const { ref } = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={cn('home-services', 'reveal')}>
      <div className="container">
        <SectionHeading
          caption="What we offer"
          title="How I Can Support You"
          alignment="center"
        />

        <div className="home-services__grid">
          {HOME_SERVICES.map((service) => (
            <Link
              key={service.id}
              to={service.href}
              className="home-services__card"
            >
              <div className="home-services__card-image-wrapper">
                <img
                  src={service.image}
                  alt={service.title}
                  className="home-services__card-image"
                  loading="lazy"
                />
              </div>
              <div className="home-services__card-body">
                <h3 className="home-services__card-title">{service.title}</h3>
                <p className="home-services__card-desc">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================== */
/* SOCIALS BAR — "Podcasts & Socials"                   */
/* ================================================== */

const SOCIAL_BAR_LINKS = [
  { icon: 'youtube', href: 'https://youtube.com', label: 'YouTube' },
  { icon: 'instagram', href: 'https://instagram.com', label: 'Instagram' },
  { icon: 'facebook', href: 'https://facebook.com', label: 'Facebook' },
  { icon: 'pinterest', href: 'https://pinterest.com', label: 'Pinterest' },
];

export function HomeSocials() {
  const { ref } = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={cn('home-socials', 'reveal')}>
      <div className="container home-socials__container">
        <span className="home-socials__label">Podcasts &amp; Socials</span>
        <div className="home-socials__links">
          {SOCIAL_BAR_LINKS.map((link) => (
            <a
              key={link.icon}
              href={link.href}
              className="home-socials__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${link.label}`}
            >
              <Icon name={link.icon} size="lg" decorative />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================== */
/* HOME BLOG SLIDER (live from API)                    */
/* ================================================== */

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: string;
  category?: { name: string } | null;
}
function HomeBlogSlider() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    api.get('/blog?limit=20&status=PUBLISHED')
      .then(r => {
        const data = r.data?.data ?? r.data;
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(() => {});
  }, []);

  if (!posts.length) return null;

  const post = posts[idx];
  const prev = () => setIdx(i => (i - 1 + posts.length) % posts.length);
  const next = () => setIdx(i => (i + 1) % posts.length);

  const imgSrc = resolveOptimizedImageUrl(post.featuredImage) || resolveImageUrl(post.featuredImage) || null;
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <section className="home-section-blog" style={imgSrc ? { backgroundImage: `url(${imgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
      {/* Left label overlay */}
      <div className="home-section-blog__overlay">
        <h3 className="home-section-blog__title">MY LATEST BLOGS</h3>
        <p className="home-section-blog__desc">
          BLOGS AND RESOURCES WHICH WILL HELP YOU TO DECODE LIFE'S SECRETS
        </p>
      </div>

      {/* Right panel — live blog data */}
      <div className="home-section-blog__panel">
        {post.category && (
          <span className="home-section-blog__cat">{post.category.name.toUpperCase()}</span>
        )}
        <h2 className="home-section-blog__panel-title">{post.title}</h2>
        {post.excerpt && (
          <p className="home-section-blog__panel-desc">{post.excerpt}</p>
        )}
        {dateStr && <p className="home-section-blog__date">{dateStr}</p>}
        <Link to={`/blog/${post.slug}`} className="home-section-blog__read-more">READ MORE</Link>
      </div>

      {/* Prev arrow */}
      <button
        type="button"
        className="home-section-blog__arrow home-section-blog__arrow--left"
        onClick={prev}
        aria-label="Previous blog post"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        type="button"
        className="home-section-blog__arrow home-section-blog__arrow--right"
        onClick={next}
        aria-label="Next blog post"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="home-section-blog__dots">
        {posts.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`home-section-blog__dot${i === idx ? ' home-section-blog__dot--active' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Go to blog ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

const LATEST_BLOGS = [
  { title: "The Power of Mindfulness", date: "August 15, 2026" },
  { title: "Finding Your Purpose", date: "August 10, 2026" },
  { title: "Overcoming Daily Stress", date: "August 5, 2026" },
];

export function HomeBlog() {
  const { ref } = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={cn('home-blog', 'reveal')}>
      <div className="container">
        <div className="home-blog__grid">
          {/* Latest Blog List Card */}
          <div className="home-blog__latest-card">
            <h2 className="home-blog__latest-title">My Latest Blogs</h2>
            <ul className="home-blog__latest-list">
              {LATEST_BLOGS.map((blog) => (
                <li key={blog.title} className="home-blog__latest-item">
                  <h3 className="home-blog__latest-item-title">{blog.title}</h3>
                  <span className="home-blog__latest-item-meta">{blog.date}</span>
                </li>
              ))}
            </ul>
            <Button variant="text" href="/blog">
              View All Posts
            </Button>
          </div>

          {/* Featured Blog Card */}
          <Link to="/blog/unveiling-lifes-secrets" className="home-blog__featured-card">
            <OptimizedImage
              src={blogFeatured}
              alt="Close-up of a green leaf — unveiling life's secrets"
              className="home-blog__featured-image"
              loading="lazy"
            />
            <div className="home-blog__featured-overlay">
              <span className="badge home-blog__featured-category">Wellness</span>
              <h3 className="home-blog__featured-title">
                Unveiling Some Life's Secrets: What You Must Know
              </h3>
              <p className="home-blog__featured-excerpt">
                Discover the fundamental truths about personal growth that most people overlook on their journey.
              </p>
              <span className="btn btn--text btn--sm home-blog__featured-readmore" style={{ color: 'var(--color-soft-white)' }}>
                Read More
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================== */
/* TESTIMONIALS                                         */
/* ================================================== */

const HOME_TESTIMONIALS = [
  {
    id: 'testimonial-1',
    quote: 'Working with Jawedan completely transformed how I approach challenges. I finally feel in control of my own narrative.',
    author: 'Sarah M.',
    role: 'Life Coaching Client',
  },
  {
    id: 'testimonial-2',
    quote: 'The courses are incredibly well-structured and deeply insightful. Every module helped me unlock a new perspective.',
    author: 'Priya K.',
    role: 'Online Course Student',
  },
  {
    id: 'testimonial-3',
    quote: 'I found clarity and peace I didn\'t think was possible. Jawedan\'s guidance is gentle yet profoundly impactful.',
    author: 'Amina R.',
    role: 'Coaching Program',
  },
];

export function HomeTestimonials() {
  const { ref } = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={cn('home-testimonials', 'reveal')}>
      <div className="container">
        <SectionHeading
          caption="What our clients say"
          title="Testimonials"
          alignment="center"
        />

        <div className="home-testimonials__grid">
          {HOME_TESTIMONIALS.map((item) => (
            <blockquote key={item.id} className="home-testimonial-card">
              <Icon name="quote" size="xl" className="testimonial-card__quote-icon" decorative />
              <p className="home-testimonial-card__quote">{item.quote}</p>
              <footer>
                <cite className="home-testimonial-card__author">{item.author}</cite>
                <span className="home-testimonial-card__role">{item.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================== */
/* CTA — "Your Journey Begins Today"                    */
/* ================================================== */

export function HomeCTA() {
  const { ref } = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className={cn('home-cta', 'reveal')}>
      <div className="container home-cta__container">
        <div className="home-cta__content">
          <span className="home-cta__caption">Take the first step</span>
          <h2 className="home-cta__heading">
            Your Journey Towards Peace, Clarity and Success Begins Today
          </h2>
          <p className="home-cta__text">
            Whether you're looking for one-on-one coaching, a self-paced course,
            or simply a community that understands — we're here for you.
          </p>
          <Button variant="primary" href="/contact">
            Get Started
          </Button>
        </div>

        <div className="home-cta__image-wrapper">
          <OptimizedImage
            src={leavesImg}
            alt="Botanical leaves — growth and renewal"
            className="home-cta__image"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
