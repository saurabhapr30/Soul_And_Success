import { useState } from 'react';
import { Button, Input, SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks';
import { cn } from '@/utils';
import './Newsletter.css';

/* ================================================== */
/* NEWSLETTER SECTION COMPONENT                         */
/* ================================================== */

interface NewsletterProps {
  caption?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function Newsletter({
  caption = 'Stay Connected',
  title = 'Join Our Newsletter',
  subtitle = 'Receive insights, inspiration, and exclusive updates delivered to your inbox.',
  className,
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { ref } = useScrollReveal<HTMLElement>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section
      ref={ref}
      className={cn('newsletter', 'reveal', className)}
    >
      <div className="container newsletter__container">
        <SectionHeading
          caption={caption}
          title={title}
          subtitle={subtitle}
          alignment="center"
        />

        {isSubmitted ? (
          <div className="newsletter__success">
            <p className="newsletter__success-text">
              Thank you for subscribing! We'll be in touch soon.
            </p>
          </div>
        ) : (
          <form
            id="newsletter-form"
            className="newsletter__form"
            onSubmit={handleSubmit}
          >
            <Input
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
