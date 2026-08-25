import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '@/constants';
import { useScrollPosition, useIsMobile, useLockBodyScroll } from '@/hooks';
import { cn } from '@/utils';
import { useCart } from '@/context/CartContext';
import logoImg from '@/assets/logo.jpg';
import './Navbar.css';

/* ================================================== */
/* NAVBAR COMPONENT                                     */
/* ================================================== */

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled } = useScrollPosition(50);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { getItemCount } = useCart();

  useLockBodyScroll(isMobileMenuOpen);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      id="site-header"
      className={cn(
        'navbar',
        isScrolled && 'navbar--scrolled',
        isMobileMenuOpen && 'navbar--menu-open'
      )}
    >
      <div className="container navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={closeMobileMenu}>
          <img src={logoImg} alt="" className="navbar__logo-icon" aria-hidden="true" />
          <div className="navbar__logo-text">
            <span className="navbar__logo-wordmark">Soul And Success</span>
            <span className="navbar__logo-tagline">Find Your Inner Compass</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar__nav" aria-label="Main navigation">
          <ul className="navbar__list">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="navbar__item">
                <Link
                  to={link.href}
                  className={cn(
                    'navbar__link',
                    location.pathname === link.href && 'navbar__link--active'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/shop/cart" className="navbar__cart-indicator" aria-label="Shopping Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="navbar__cart-count">{getItemCount()}</span>
          </Link>
          <Link to="/book-session" className="navbar__btn">
            BOOK A SESSION
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button
            id="mobile-menu-toggle"
            className={cn('navbar__hamburger', isMobileMenuOpen && 'navbar__hamburger--open')}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </button>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <>
            {/* Overlay */}
            <div 
              className={cn('navbar__mobile-overlay', isMobileMenuOpen && 'navbar__mobile-overlay--open')}
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            
            {/* Drawer */}
            <div
              className={cn(
                'navbar__mobile-menu',
                isMobileMenuOpen && 'navbar__mobile-menu--open'
              )}
            >
              <nav className="navbar__mobile-nav" aria-label="Mobile navigation">
                <ul className="navbar__mobile-list">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href} className="navbar__mobile-item">
                      <Link
                        to={link.href}
                        className={cn(
                          'navbar__mobile-link',
                          location.pathname === link.href && 'navbar__mobile-link--active'
                        )}
                        onClick={closeMobileMenu}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  
                  <li className="navbar__mobile-item" style={{ marginTop: '20px' }}>
                    <Link
                      to="/shop/cart"
                      className="navbar__mobile-link"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                      onClick={closeMobileMenu}
                    >
                      Shopping Cart
                      <span style={{ 
                        background: 'var(--color-primary)', 
                        color: '#FFF', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: 700 
                      }}>{getItemCount()}</span>
                    </Link>
                  </li>
                  <li className="navbar__mobile-item" style={{ marginTop: '20px' }}>
                    <Link
                      to="/book-session"
                      className="navbar__mobile-link"
                      style={{ fontWeight: 700, color: 'var(--color-primary)' }}
                      onClick={closeMobileMenu}
                    >
                      BOOK A SESSION
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
