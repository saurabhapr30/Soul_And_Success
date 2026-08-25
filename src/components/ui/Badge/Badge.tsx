import type { BaseComponentProps } from '@/types';
import { cn } from '@/utils';

/* ================================================== */
/* BADGE COMPONENT                                      */
/* ================================================== */
/* Uses existing .badge CSS from components.css.        */
/* ================================================== */

interface BadgeProps extends BaseComponentProps {
  /** Visual variant */
  variant?: 'default' | 'filled';
}

export function Badge({
  children,
  variant = 'default',
  className,
  id,
}: BadgeProps) {
  return (
    <span
      id={id}
      className={cn(
        'badge',
        variant === 'filled' && 'badge--filled',
        className
      )}
    >
      {children}
    </span>
  );
}
