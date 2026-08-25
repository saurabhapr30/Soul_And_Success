import { Link } from 'react-router-dom';
import { SEOHead, Button } from '@/components/ui';

/* ================================================== */
/* 404 NOT FOUND PAGE                                   */
/* ================================================== */

export function NotFoundPage() {
  return (
    <>
      <SEOHead
        title="Page Not Found"
        description="The page you are looking for does not exist."
      />
      <section className="section" style={{ paddingTop: 'calc(var(--space-14) + var(--space-12))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="text-caption" style={{ marginBottom: 'var(--space-4)', display: 'block' }}>
            404
          </span>
          <h1 className="text-display-xl">Page Not Found</h1>
          <p className="text-body-lg" style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
