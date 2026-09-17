import { Link } from 'react-router-dom';
import './AboutPage.css';
import { SEOHead } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import heroPortrait from '@/assets/standing.webp';
import introPortrait from '@/assets/standing.webp';
import leavesBg from '@/assets/aboutpage.webp';
import sunflowerImg from '@/assets/sunflower.webp';
import cert1 from '@/assets/c10c4670cec388d76e39915f5c2c5be405c9a1f1 (1).webp';
import cert2 from '@/assets/ec32dcf401f07d2768855691dea06044c8171c3b (1).webp';
import signatureImg from '@/assets/signature.png';
import logoIcon from '@/assets/logo.webp';
import leafSvg from '@/assets/leaf.svg';

export function AboutPage() {
  return (
    <>
      <SEOHead
        title="About - Soul And Success"
        description="Learn more about Jawedan Sehar and the mission behind Soul And Success."
      />
      <div className="about-page">

        {/* HERO SECTION */}
        <section className="about-hero">
          <div className="about-hero__container">
            <div className="about-hero__content">
              <img src={signatureImg} alt="Jawedan Sehar Signature" className="about-hero__signature" />
              <div className="about-hero__line" aria-hidden="true" />
              <h2 className="about-hero__title">Certified Life Coach</h2>
              <p className="about-hero__subtitle">Your Accountability Coach</p>
            </div>
            <div className="about-hero__image-wrapper">
              <OptimizedImage src={heroPortrait} alt="Jawedan Sehar" className="about-hero__image" priority={true} decoding="async" />
              <div className="about-hero__image-overlay" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* CERTIFICATION STRIP */}
        <section className="about-certifications">
          <div className="about-certifications__track">
            <div className="about-certifications__wrapper">
              <OptimizedImage src={cert1} alt="Certification" className="about-certifications__card" loading="lazy" />
            </div>
            <div className="about-certifications__wrapper">
              <OptimizedImage src={cert2} alt="Certification" className="about-certifications__card about-certifications__card--carolina" loading="lazy" />
            </div>
            <div className="about-certifications__wrapper">
              <OptimizedImage src={cert1} alt="Certification" className="about-certifications__card" loading="lazy" />
            </div>
            <div className="about-certifications__wrapper">
              <OptimizedImage src={cert2} alt="Certification" className="about-certifications__card about-certifications__card--carolina" loading="lazy" />
            </div>
            <div className="about-certifications__wrapper" aria-hidden="true">
              <OptimizedImage src={cert1} alt="Certification" className="about-certifications__card" loading="lazy" />
            </div>
            <div className="about-certifications__wrapper" aria-hidden="true">
              <OptimizedImage src={cert2} alt="Certification" className="about-certifications__card about-certifications__card--carolina" loading="lazy" />
            </div>
          </div>
        </section>

        {/* HEY I'M JAWEDAN SECTION */}
        <section className="about-founder">
          <div className="about-founder__container">
            <div className="about-founder__content">
              <div className="about-founder__leaf-deco">
                <img src={leafSvg} alt="" className="about-founder__leaf-img" aria-hidden="true" />
              </div>
              <h2 className="about-founder__heading">Hey Iam Jawedan</h2>
              <div className="about-founder__text">
                <p>I am a Certified Life Coach, Law of Attraction Expert, NLP Practitioner and Ho'oponopono & EFT Healer. I help you transform your life with clarity, compassion and purpose.</p>
                <p>With years of leadership experience in the IT industry, I combine practical thinking with emotional healing to help you create lasting transformation.</p>
                <p>My approach is simple yet powerful to help you heal, grow and manifest the life you truly deserve.</p>
                <p>You are capable of more than you think.</p>
              </div>
            </div>
            <div className="about-founder__image-wrapper">
              <div className="about-founder__image-bg"></div>
              <OptimizedImage src={introPortrait} alt="Jawedan Sehar Standing" className="about-founder__image" loading="lazy" />
            </div>
          </div>
        </section>

        {/* BROKEN DIVIDER */}
        <div className="about-page__broken-divider" aria-hidden="true">
          <div className="about-page__broken-divider-line" />
          <img src={leafSvg} alt="" className="about-page__broken-divider-icon" />
          <div className="about-page__broken-divider-line" />
        </div>

        {/* MY MISSION SECTION */}
        <section className="about-mission">
          <div className="about-mission__container">
            <div className="about-mission__visual">
              <OptimizedImage src={sunflowerImg} alt="Mission Botanical" className="about-mission__image" loading="lazy" />
            </div>
            <div className="about-mission__content">
              <div className="about-mission__label-container">
                <div className="about-mission__line"></div>
                <span className="about-mission__label">MY MISSION</span>
                <div className="about-mission__line"></div>
              </div>
              <h2 className="about-mission__heading">From Healing To Success.</h2>
              <div className="about-mission__text">
                <p>Soul & Success was born from a deep desire to help individuals navigate the complexities of life. After experiencing my own journey of transformation, I realized the power of emotional healing and how it directly impacts our ability to succeed in life. My mission is to provide you with the tools, strategies and support you need to overcome obstacles and step into your power.</p>
                <p>Every person has the potential to live a life they love. Through coaching, mentoring, and healing practices, I help you uncover that potential. Whether you're feeling stuck, overwhelmed, or simply ready for the next level, I am here to guide you. True success is not just about professional achievements; it's about finding peace, joy, and fulfillment in every aspect of your life.</p>
              </div>
            </div>
          </div>
        </section>

        {/* MY JOURNEY STORY */}
        <section className="about-journey">
          <div className="about-journey__container">
            <div className="about-journey__header-container">
              <div className="about-journey__line"></div>
              <h2 className="about-journey__heading" data-node-id="293:683">Meet Jawedan Sehar</h2>
              <div className="about-journey__line"></div>
            </div>
            <div className="about-journey__content-wrapper">
              <div className="about-journey__watermark">NEED CONTENT</div>
              <div className="about-journey__columns">
                <div className="about-journey__column">
                  <p>From the corporate world of IT to becoming a Life Coach, my journey has been one of continuous learning and growth. Like many, I experienced challenges, stress, and moments of feeling lost. However, these experiences became the catalyst for my transformation. I discovered the profound impact of mindset, emotional intelligence, and spiritual practices on our overall well-being.</p>
                  <p>Over the years, I dedicated myself to studying various modalities, including NLP, Ho'oponopono, EFT, and the Law of Attraction. These tools not only helped me heal but also empowered me to create a life of purpose and passion. I realized that my true calling was to share these powerful techniques with others, helping them navigate their own journeys of self-discovery and empowerment.</p>
                  <p>Every person has the potential to live a life they love. Through coaching, mentoring, and healing practices, I help you uncover that potential. Whether you're feeling stuck, overwhelmed, or simply ready for the next level, I am here to guide you.</p>
                </div>
                <div className="about-journey__column">
                  <p>Today, I am incredibly grateful to combine my corporate leadership experience with my coaching expertise. This unique blend allows me to offer practical, actionable strategies grounded in emotional and spiritual healing. I work with individuals from all walks of life, helping them overcome limiting beliefs, heal past traumas, and step confidently into their desired future.</p>
                  <p>My approach is compassionate, intuitive, and results-oriented. I believe that true transformation happens from the inside out. When we heal our inner world, our outer reality naturally aligns with our deepest desires. I am committed to providing a safe, supportive space for you to explore, heal, and grow. Let's embark on this beautiful journey of transformation together.</p>
                  <p>True success is not just about professional achievements; it's about finding peace, joy, and fulfillment in every aspect of your life. Let's make it a reality together.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTANICAL QUOTE SECTION */}
        <section className="about-quote">
          <div className="about-quote__background">
            <OptimizedImage src={leavesBg} alt="Botanical Leaves" className="about-quote__image" loading="lazy" />
            <div className="about-quote__overlay"></div>
          </div>
          <div className="about-quote__container">
            <div className="about-quote__content">
              <span className="about-quote__marks">“</span>
              <p className="about-quote__text">
                Welcome To Soul And Success. Let's Begin<br />
                Your Journey Toward Healing, Growth, And<br />
                Lasting Transformation Together.
              </p>
            </div>
          </div>
        </section>

        {/* JOURNEY CTA */}
        <section className="about-cta" data-node-id="546:383">
          <div className="about-cta__container">
            <div className="about-cta__card">
              {/* Logo */}
              <img src={logoIcon} alt="Soul & Success" className="about-cta__logo" />

              {/* Center Text Block */}
              <div className="about-cta__text-block">
                <h3 className="about-cta__title">
                  <span>YOUR JOURNEY TOWARDS PEACE,</span>
                  <span>CLARITY AND SUCCESS BEGINS TODAY.</span>
                </h3>
                <p className="about-cta__desc">LET'S TAKE THE FIRST STEP TOGETHER.</p>
              </div>

              {/* Right CTA Block */}
              <div className="about-cta__right">
                <Link to="/courses" className="about-cta__cta-btn">
                  <span>CHOOSE YOUR PROGRAM</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <p className="about-cta__cta-sub">Begin your transformation today.</p>
              </div>

              {/* Decorative Leaf Flourish */}
              <img src={leafSvg} alt="" className="about-cta__leaf" aria-hidden="true" />
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
