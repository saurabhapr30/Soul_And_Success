import type { BaseComponentProps } from '@/types';
import { cn } from '@/utils';
import './DecorativeLeaf.css';

/* ================================================== */
/* DECORATIVE LEAF COMPONENT                            */
/* ================================================== */
/* Positioned botanical/leaf decorative element.        */
/* Uses absolute positioning, never interferes with     */
/* document flow. Supports responsive visibility.       */
/* ================================================== */

type LeafPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface DecorativeLeafProps extends BaseComponentProps {
  /** Image source for the leaf asset */
  src: string;
  /** Corner position */
  position: LeafPosition;
  /** Optional width override */
  width?: string;
  /** Hide below this breakpoint: 'tablet' hides below 1024px, 'mobile' hides below 768px */
  hideBelow?: 'tablet' | 'mobile';
}

export function DecorativeLeaf({
  src,
  position,
  width,
  hideBelow,
  className,
  id,
}: DecorativeLeafProps) {
  return (
    <img
      id={id}
      src={src}
      alt=""
      role="presentation"
      className={cn(
        'decorative-leaf',
        `decorative-leaf--${position}`,
        hideBelow === 'tablet' && 'decorative-leaf--hide-tablet',
        hideBelow === 'mobile' && 'decorative-leaf--hide-mobile',
        className
      )}
      style={width ? { width } : undefined}
      loading="lazy"
    />
  );
}
