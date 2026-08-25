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
          
          {/* Hero Row: Intro & Portrait */}
          <div className="contact-page__hero-row">
            {/* 3. Main Editorial Intro */}
            <div className="contact-page__intro">
              <h2 className="contact-page__intro-heading">LETS TALK!</h2>
              <p className="contact-page__intro-body">
                At Soul &amp; Success, we're here to help you navigate your{' '}
                <br className="desktop-br"/>
                journey towards peace, clarity, and success. Whether you have{' '}
                <br className="desktop-br"/>
                questions about our services, need guidance on your next step,{' '}
                <br className="desktop-br"/>
                or want to explore how we can help you heal deeply and live{' '}
                <br className="desktop-br"/>
                with purpose, we'd love to hear from you!
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
              {success && <div style={{color: 'green'}}>Message sent successfully!</div>}
              {error && <div style={{color: 'red'}}>{error}</div>}
            </div>

            <form className="contact-page__form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                className="contact-page__input contact-page__input--name" 
                placeholder="Name" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="tel" 
                className="contact-page__input contact-page__input--phone" 
                placeholder="Phone" 
                required={false}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <input 
                type="email" 
                className="contact-page__input contact-page__input--email" 
                placeholder="Email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <textarea 
                className="contact-page__textarea" 
                placeholder="Message" 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
              
              <button type="submit" className="contact-page__submit" disabled={loading}>
                {loading ? 'SUBMITTING...' : 'SUBMIT'}
                <span className="contact-page__submit-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.71 10.71l-4 4c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41L13.17 13H8c-.55 0-1-.45-1-1s.45-1 1-1h5.17l-1.88-1.88c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l4 4c.39.39.39 1.02 0 1.41z" />
                  </svg>
                </span>
              </button>
            </form>
          </div>

          {/* 8. Contact Details */}
          <div className="contact-page__details">
            <p>JAWEDAN SEHAR</p>
            <p className="mt">EMAIL<br/>JAW.SEHAR@GMAIL.COM</p>
            <p className="mt">ADDRESS<br/>INDIA</p>
          </div>

        </div>
      </main>
    </>
  );
}
