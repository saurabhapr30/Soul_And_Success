import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/ui';
import logoImg from '@/assets/logo.jpg';
import whatsappIcon from '@/assets/Whatsapp.png';
import { newsletterService } from '@/services/newsletterService';
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await newsletterService.subscribe(email);
      setStatus('success');
      setMessage('Successfully subscribed!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to subscribe');
    }
  };

  return (
    <footer className="site-footer">
      {/* Top Row: Brand + Link Columns */}
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <div className="site-footer__brand-header">
            <img src={logoImg} alt="Soul And Success" className="site-footer__logo" />
            <div>
              <h2 className="site-footer__brand-title">SOUL AND SUCCESS</h2>
              <p className="site-footer__brand-subtitle">FIND YOUR INNER COMPASS</p>
            </div>
          </div>
          <div className="site-footer__brand-socials">
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

        <div className="site-footer__links">
          <div className="site-footer__link-col">
            <h3 className="site-footer__link-heading">Quick Links</h3>
            <ul className="site-footer__link-list">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/blog">Resources</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="site-footer__link-col">
            <h3 className="site-footer__link-heading">Services</h3>
            <ul className="site-footer__link-list">
              <li><Link to="/services">Life Coaching</Link></li>
              <li><Link to="/services">NLP Coaching</Link></li>
              <li><Link to="/services">Healing Sessions</Link></li>
              <li><Link to="/services">Law Of Attraction Mastery</Link></li>
            </ul>
          </div>
          <div className="site-footer__link-col">
            <h3 className="site-footer__link-heading">Resources</h3>
            <ul className="site-footer__link-list">
              <li><Link to="/books">E-Books</Link></li>
              <li><Link to="/blog">Free Blogs</Link></li>
              <li><Link to="/shop">Merchandise</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Middle Row: Subscribe + Contact + WhatsApp */}
      <div className="site-footer__middle">
        <div className="site-footer__subscribe">
          <h3 className="site-footer__subscribe-heading">Stay Connected</h3>
          <p className="site-footer__subscribe-desc">Get tips and inspiration straight to your inbox.</p>
          <form className="site-footer__subscribe-form" onSubmit={handleSubscribe}>
            <input 
               type="email" 
               placeholder="Your email address" 
               className="site-footer__subscribe-input" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               disabled={status === 'loading'}
            />
            <button className="site-footer__subscribe-btn" aria-label="Subscribe" disabled={status === 'loading'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </button>
          </form>
          {status === 'success' && <p style={{ color: '#4ade80', fontSize: '0.875rem', marginTop: '0.5rem' }}>{message}</p>}
          {status === 'error' && <p style={{ color: '#f87171', fontSize: '0.875rem', marginTop: '0.5rem' }}>{message}</p>}
        </div>

        <div className="site-footer__contact">
          <h3 className="site-footer__contact-heading">Contact Us</h3>
          <div className="site-footer__contact-row">
            <Icon name="mail" size="sm" decorative />
            <span>jaw.sehar@gmail.com</span>
          </div>
          <div className="site-footer__contact-row">
            <Icon name="map-pin" size="sm" decorative />
            <span>India</span>
          </div>
        </div>

        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="site-footer__whatsapp">
          <img src={whatsappIcon} alt="WhatsApp" className="site-footer__whatsapp-icon" />
        </a>
      </div>

      {/* Bottom Bar */}
      <div className="site-footer__bottom-bar">
        <div className="site-footer__copyright">
          © {currentYear} Soul And Success. All rights reserved.
        </div>
        <div className="site-footer__legal">
          <span>Privacy Policy</span>
          <span className="site-footer__separator">|</span>
          <span>Terms &amp; Conditions</span>
        </div>
      </div>
    </footer>
  );
}
