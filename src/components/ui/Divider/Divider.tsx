import type { BaseComponentProps } from '@/types';
import { cn } from '@/utils';

/* ================================================== */
/* DIVIDER COMPONENT                                    */
/* ================================================== */

interface DividerProps extends BaseComponentProps {
  variant?: 'default' | 'accent' | 'accent-center';
}

export function Divider({
  variant = 'default',
  className,
}: DividerProps) {
  const variantClass =
    variant === 'accent'
      ? 'divider-accent'
      : variant === 'accent-center'
        ? 'divider-accent-center'
        : 'divider';

  return <hr className={cn(variantClass, className)} />;
}
