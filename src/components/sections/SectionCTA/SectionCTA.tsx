import type { BaseComponentProps, CTAData } from '@/types';
import { cn } from '@/utils';
import { useScrollReveal } from '@/hooks';
import { CTA } from '@/components/ui/CTA';
import './SectionCTA.css';

/* ================================================== */
/* SECTION CTA COMPONENT                                */
/* ================================================== */
/* Full-width call-to-action section for use between    */
/* page sections. Wraps the CTA component with section  */
/* backgrounds and spacing.                             */
/* ================================================== */

type SectionCTABackground = 'primary' | 'alternate' | 'dark';

interface SectionCTAProps extends BaseComponentProps {
  /** Optional eyebrow caption */
  caption?: string;
  /** Main heading */
  heading: string;
  /** Optional description */
  description?: string;
  /** Primary action */
  primaryCTA?: CTAData;
  /** Secondary action */
  secondaryCTA?: CTAData;
  /** Background variant */
  background?: SectionCTABackground;
  /** Content alignment */
  alignment?: 'center' | 'left';
}

export function SectionCTA({
  caption,
  heading,
  description,
  primaryCTA,
  secondaryCTA,
  background = 'alternate',
  alignment = 'center',
  className,
  id,
}: SectionCTAProps) {
  const { ref } = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        'section-cta',
        `section-cta--${background}`,
        'reveal',
        className
      )}
    >
      <div className="container section-cta__container">
        <CTA
          caption={caption}
          heading={heading}
          description={description}
          primaryAction={primaryCTA}
          secondaryAction={secondaryCTA}
          alignment={alignment}
        />
      </div>
    </section>
  );
}
