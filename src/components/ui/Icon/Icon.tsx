import type { BaseComponentProps } from '@/types';
import { cn } from '@/utils';
import './Icon.css';

/* ================================================== */
/* ICON COMPONENT                                       */
/* ================================================== */
/* SVG sprite-based icon. References /icons.svg.        */
/* Uses currentColor so color is inherited from CSS.    */
/* ================================================== */

interface IconProps extends BaseComponentProps {
  /** Icon name matching the symbol id in /icons.svg (without 'icon-' prefix) */
  name: string;
  /** Size token: sm=16, md=20, lg=24, xl=32 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Accessible label. If omitted, icon is treated as decorative. */
  ariaLabel?: string;
  /** Force decorative mode (aria-hidden, no role) even if ariaLabel is set */
  decorative?: boolean;
}

export function Icon({
  name,
  size = 'md',
  ariaLabel,
  decorative = false,
  className,
  id,
}: IconProps) {
  const isDecorative = decorative || !ariaLabel;

  return (
    <svg
      id={id}
      className={cn('icon', `icon--${size}`, className)}
      aria-hidden={isDecorative ? true : undefined}
      aria-label={!isDecorative ? ariaLabel : undefined}
      role={!isDecorative ? 'img' : undefined}
      focusable="false"
    >
      <use href={`/icons.svg#icon-${name}`} />
    </svg>
  );
}
