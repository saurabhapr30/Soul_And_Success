import { useState, useCallback } from 'react';
import type { BaseComponentProps, TestimonialData } from '@/types';
import { cn } from '@/utils';
import { useScrollReveal } from '@/hooks';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import './Testimonials.css';

/* ================================================== */
/* TESTIMONIALS SECTION COMPONENT                       */
/* ================================================== */
/* Supports grid and slider layouts.                    */
/* Slider uses native scroll with accessible controls.  */
/* ================================================== */

type TestimonialsLayout = 'grid' | 'slider' | 'single';

interface TestimonialsProps extends BaseComponentProps {
  /** Optional eyebrow caption */
  caption?: string;
  /** Section title */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Testimonial items */
  items: TestimonialData[];
  /** Display layout */
  layout?: TestimonialsLayout;
}

export function Testimonials({
  caption,
  title,
  subtitle,
  items,
  layout = 'grid',
  className,
  id,
}: TestimonialsProps) {
  const { ref } = useScrollReveal<HTMLElement>();
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  return (
    <section
      ref={ref}
      id={id}
      className={cn('testimonials', `testimonials--${layout}`, 'reveal', className)}
    >
      <div className="container">
        {(caption || title) && (
          <SectionHeading
            caption={caption}
            title={title || ''}
            subtitle={subtitle}
            alignment="center"
          />
        )}

        {/* Grid Layout */}
        {layout === 'grid' && (
          <div className="testimonials__grid">
            {items.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Single Layout */}
        {layout === 'single' && items.length > 0 && (
          <div className="testimonials__single">
            <TestimonialCard item={items[0]} featured />
          </div>
        )}

        {/* Slider Layout */}
        {layout === 'slider' && (
          <div className="testimonials__slider" role="region" aria-label="Testimonials carousel">
            <div className="testimonials__slide">
              <TestimonialCard item={items[activeIndex]} featured />
            </div>

            {items.length > 1 && (
              <div className="testimonials__controls">
                <button
                  className="testimonials__control"
                  onClick={goToPrev}
                  aria-label="Previous testimonial"
                >
                  <Icon name="chevron-right" size="md" decorative />
                </button>

                <div className="testimonials__dots" role="tablist">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      className={cn(
                        'testimonials__dot',
                        index === activeIndex && 'testimonials__dot--active'
                      )}
                      onClick={() => setActiveIndex(index)}
                      role="tab"
                      aria-selected={index === activeIndex}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  className="testimonials__control testimonials__control--next"
                  onClick={goToNext}
                  aria-label="Next testimonial"
                >
                  <Icon name="chevron-right" size="md" decorative />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ================================================== */
/* TESTIMONIAL CARD (internal)                          */
/* ================================================== */

interface TestimonialCardProps {
  item: TestimonialData;
  featured?: boolean;
}

function TestimonialCard({ item, featured = false }: TestimonialCardProps) {
  return (
    <blockquote className={cn('testimonial-card', featured && 'testimonial-card--featured')}>
      <Icon
        name="quote"
        size="xl"
        className="testimonial-card__quote-icon"
        decorative
      />

      {item.rating && (
        <div className="testimonial-card__rating" aria-label={`${item.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Icon
              key={i}
              name={i < item.rating! ? 'star-filled' : 'star'}
              size="sm"
              className="testimonial-card__star"
              decorative
            />
          ))}
        </div>
      )}

      <p className="testimonial-card__text">{item.quote}</p>

      <footer className="testimonial-card__footer">
        {item.avatar && (
          <img
            src={item.avatar.src}
            alt={item.avatar.alt}
            className="testimonial-card__avatar"
            width={48}
            height={48}
            loading="lazy"
          />
        )}
        <div className="testimonial-card__author-info">
          <cite className="testimonial-card__author">{item.author}</cite>
          {item.role && (
            <span className="testimonial-card__role">{item.role}</span>
          )}
        </div>
      </footer>
    </blockquote>
  );
}
