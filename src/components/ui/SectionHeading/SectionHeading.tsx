import type { SectionHeadingData, BaseComponentProps } from '@/types';
import { cn } from '@/utils';
import { useScrollReveal } from '@/hooks';
import './SectionHeading.css';

/* ================================================== */
/* SECTION HEADING COMPONENT                            */
/* ================================================== */

interface SectionHeadingProps extends BaseComponentProps, SectionHeadingData {}

export function SectionHeading({
  caption,
  title,
  subtitle,
  alignment = 'center',
  className,
  id,
}: SectionHeadingProps) {
  const { ref } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      id={id}
      className={cn(
        'section-heading',
        `section-heading--${alignment}`,
        'reveal',
        className
      )}
    >
      {caption && (
        <span className="section-heading__caption">{caption}</span>
      )}
      <h2 className="section-heading__title">{title}</h2>
      {subtitle && (
        <p className="section-heading__subtitle">{subtitle}</p>
      )}
      <hr className="divider-accent-center" />
    </div>
  );
}
