import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { PromoBanner } from '@/components/layout/PromoBanner/PromoBanner';

/* ================================================== */
/* ROOT LAYOUT                                          */
/* ================================================== */
/* Wraps all pages with Navbar + Footer.                */
/* Scrolls to top on route change.                      */
/* ================================================== */

export function RootLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <PromoBanner />
      <Navbar />
      <main id="main-content" className="app-layout__main">
        <Outlet />
      </main>
      {pathname !== '/' && <Footer />}
    </div>
  );
}
