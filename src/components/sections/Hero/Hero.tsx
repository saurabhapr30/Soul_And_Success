import type { BaseComponentProps, CTAData, ImageData, BreadcrumbItem } from '@/types';
import { cn } from '@/utils';
import { useScrollReveal } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import './Hero.css';

/* ================================================== */
/* HERO SECTION COMPONENT                               */
/* ================================================== */
/* Supports multiple layout patterns found across the   */
/* Figma pages: centered, split, image-led, minimal.    */
/* ================================================== */

type HeroLayout = 'centered' | 'split' | 'image-led' | 'minimal';

interface HeroProps extends BaseComponentProps {
  /** Layout variant */
  layout?: HeroLayout;
  /** Optional caption / eyebrow text */
  caption?: string;
  /** Main heading */
  title: string;
  /** Optional subtitle / description */
  subtitle?: string;
  /** Primary call-to-action */
  primaryCTA?: CTAData;
  /** Secondary call-to-action */
  secondaryCTA?: CTAData;
  /** Hero image */
  image?: ImageData;
  /** Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[];
  /** Use editorial (Agatho) for subtitle */
  editorialSubtitle?: boolean;
  /** Background variant */
  background?: 'primary' | 'section' | 'alternate';
}

export function Hero({
  layout = 'centered',
  caption,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  image,
  breadcrumbs,
  editorialSubtitle = false,
  background = 'primary',
  className,
  id,
}: HeroProps) {
  const { ref } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        'hero',
        `hero--${layout}`,
        `hero--bg-${background}`,
        'reveal',
        className
      )}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="container hero__breadcrumbs">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      <div className={cn(
        'container',
        layout === 'split' ? 'hero__grid' : 'hero__content-wrapper'
      )}>
        {/* Content */}
        <div className="hero__content">
          {caption && (
            <span className="hero__caption">{caption}</span>
          )}
          <h1 className="hero__title">{title}</h1>
          {subtitle && (
            <p className={cn(
              'hero__subtitle',
              editorialSubtitle && 'hero__subtitle--editorial'
            )}>
              {subtitle}
            </p>
          )}
          {(primaryCTA || secondaryCTA) && (
            <div className="hero__actions">
              {primaryCTA && (
                <Button
                  variant={primaryCTA.variant || 'primary'}
                  href={primaryCTA.href}
                  isExternal={primaryCTA.isExternal}
                >
                  {primaryCTA.text}
                </Button>
              )}
              {secondaryCTA && (
                <Button
                  variant={secondaryCTA.variant || 'secondary'}
                  href={secondaryCTA.href}
                  isExternal={secondaryCTA.isExternal}
                >
                  {secondaryCTA.text}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Image (split and image-led layouts) */}
        {image && (layout === 'split' || layout === 'image-led') && (
          <div className="hero__image-wrapper">
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="hero__image"
            />
          </div>
        )}
      </div>

      {/* Full-width image for image-led (below content) */}
      {image && layout === 'centered' && (
        <div className="container hero__image-container">
          <div className="hero__image-wrapper hero__image-wrapper--centered">
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="hero__image"
            />
          </div>
        </div>
      )}
    </section>
  );
}
