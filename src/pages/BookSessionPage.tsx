import { Link } from 'react-router-dom';
import { SEOHead, Button } from '@/components/ui';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import portraitImg from '@/assets/intro-portrait-actual.webp';
import './BookSessionPage.css';

/* ================================================== */
/* BOOK A SESSION - COMING SOON PAGE                    */
/* ================================================== */

export function BookSessionPage() {
  return (
    <>
      <SEOHead
        title="Book a Session | Soul & Success"
        description="One-to-one coaching sessions with Jawedan Sehar are coming soon. Begin your journey toward peace, clarity and success."
      />
      <main className="book-session-page">
        <div className="book-session-page__container">
          
          <div className="book-session-page__text-main">
            <span className="book-session-page__eyebrow">
              SOON, YOUR TIME IS COMING
            </span>
            <h1 className="book-session-page__title">
              BOOK YOUR<br />
              INNER JOURNEY
            </h1>
            <p className="book-session-page__body">
              Personal coaching sessions are being prepared with care.<br className="desktop-only" />
              Soon, you'll be able to book a one-to-one session with Jawedan<br className="desktop-only" />
              and take the next step toward peace, clarity and success.
            </p>
          </div>

          <div className="book-session-page__image-col">
            <OptimizedImage 
              src={portraitImg} 
              alt="Portrait of Jawedan Sehar" 
              className="book-session-page__portrait" 
              priority={true}
              decoding="async"
            />
          </div>

          <div className="book-session-page__bottom-content">
            <div className="book-session-page__decorative-line"></div>

            <div className="book-session-page__panel">
              <h2 className="book-session-page__panel-title">BOOKING OPENS SOON</h2>
              <p className="book-session-page__panel-body">
                We're creating a thoughtful space for meaningful one-to-one conversations.
                Session booking will be available shortly.
              </p>
            </div>

            <div className="book-session-page__actions">
              <Link to="/contact">
                <Button variant="primary">
                  GET IN TOUCH
                </Button>
              </Link>
              <Link to="/" className="book-session-page__link">
                BACK TO HOME
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
