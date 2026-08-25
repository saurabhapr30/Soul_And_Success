import type { BaseComponentProps, CTAData } from '@/types';
import { cn } from '@/utils';
import { Button } from '@/components/ui/Button';
import './CTA.css';

/* ================================================== */
/* CTA (Call to Action) COMPONENT                       */
/* ================================================== */
/* Reusable CTA block with flexible alignment,          */
/* background variants, and one or two action buttons.  */
/* ================================================== */

interface CTAProps extends BaseComponentProps {
  /** Optional caption above the heading */
  caption?: string;
  /** Main heading */
  heading: string;
  /** Optional description below the heading */
  description?: string;
  /** Primary action button */
  primaryAction?: CTAData;
  /** Secondary action button */
  secondaryAction?: CTAData;
  /** Content alignment */
  alignment?: 'center' | 'left';
}

export function CTA({
  caption,
  heading,
  description,
  primaryAction,
  secondaryAction,
  alignment = 'center',
  className,
  id,
}: CTAProps) {
  return (
    <div
      id={id}
      className={cn(
        'cta',
        `cta--${alignment}`,
        className
      )}
    >
      {caption && (
        <span className="cta__caption">{caption}</span>
      )}
      <h2 className="cta__heading">{heading}</h2>
      {description && (
        <p className="cta__description">{description}</p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="cta__actions">
          {primaryAction && (
            <Button
              variant={primaryAction.variant || 'primary'}
              href={primaryAction.href}
              isExternal={primaryAction.isExternal}
            >
              {primaryAction.text}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || 'secondary'}
              href={secondaryAction.href}
              isExternal={secondaryAction.isExternal}
            >
              {secondaryAction.text}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
