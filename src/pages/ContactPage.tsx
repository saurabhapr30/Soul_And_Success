import { useState, useRef, useEffect } from 'react';
import { SEOHead } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import signatureImg from '@/assets/signature.png';
import portraitImg from '@/assets/intro-portrait-actual.webp';
import { contactService } from '@/services/contactService';
import './ContactPage.css';

/* ================================================== */
/* CONTACT PAGE                                       */
/* ================================================== */

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const containerRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width >= 1024) {
          setScale(width / 1920);
        } else {
          setScale(1);
        }
      }
    };

    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial scale
    updateScale();

    return () => resizeObserver.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contactService.submitContact({
        name: formData.name,
        email: formData.email,
        message: `Phone: ${formData.phone}\n\n${formData.message}`
      });
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Us | SandS"
        description="Get in touch with SandS. We'd love to hear from you."
      />
      <main className="contact-page" ref={containerRef}>
        <div
          className="contact-page-inner"
          style={{
            transform: scale !== 1 ? `scale(${scale})` : 'none',
            transformOrigin: 'top left'
          }}
        >

          {/* Watermark */}
          <div className="contact-page__watermark">Need Content </div>

          {/* Hero Row: Intro & Portrait */}
          <div className="contact-page__hero-row">
            {/* 3. Main Editorial Intro */}
            <div className="contact-page__intro">
              <h2 className="contact-page__intro-heading">
                <span style={{ color: '#000000' }}>LETS</span>
                <span style={{ color: '#996E5A' }}>{' TALK !'}</span>
              </h2>
              <p className="contact-page__intro-body">
                at ad4you.in, we're here to help you grow your business with data-driven digital marketing solutions tailored to your unique needs. whether you have questions about our services, need guidance on your next marketing campaign, or want to explore how we can help take your brand to the next level, we’d love to hear from you!
              </p>
            </div>

            {/* 1. Portrait */}
            <OptimizedImage
              src={portraitImg}
              alt="Jawedan Sehar"
              className="contact-page__portrait"
              priority={true}
              decoding="async"
            />
          </div>

          {/* 2. Signature */}
          <img
            src={signatureImg}
            alt="Jawedan Sehar Signature"
            className="contact-page__signature"
          />

          {/* 5. Contact Form Panel */}
          <div className="contact-page__form-panel">
            <h1 className="contact-page__form-title">CONTACT US</h1>

            <div className="contact-page__form-status">
              {success && <div style={{ color: 'green' }}>Message sent successfully!</div>}
              {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>

            <form className="contact-page__form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="contact-page__input contact-page__input--name"
                placeholder="Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="tel"
                className="contact-page__input contact-page__input--phone"
                placeholder="Phone"
                required={false}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="email"
                className="contact-page__input contact-page__input--email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <textarea
                className="contact-page__textarea"
                placeholder="Message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>

              <button type="submit" className="contact-page__submit" disabled={loading}>
                {loading ? 'SUBMITTING...' : 'SUBMIT'}
                <span className="contact-page__submit-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16l4-4-4-4"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                </span>
              </button>
            </form>
          </div>

          {/* 8. Contact Details */}
          <div className="contact-page__details">
            <p>JAWEDAN SEHAR</p>
            <p className="mt">EMAIL<br />JAW.SEHAR@GMAIL.COM</p>
            <p className="mt">ADDRESS<br />INDIA</p>
          </div>

        </div>
      </main>
    </>
  );
}
