import type { BaseComponentProps, ImageData } from '@/types';
import { cn } from '@/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import './Card.css';

/* ================================================== */
/* CARD COMPONENT                                       */
/* ================================================== */
/* Generic base card with compound sub-components.      */
/* Specialized cards (Service, Book, etc.) compose this. */
/* ================================================== */

/* --- Card Root --- */

interface CardProps extends BaseComponentProps {
  /** Visual layout variant */
  variant?: 'default' | 'horizontal';
  /** Wrap in a link element */
  href?: string;
  /** Hover interaction */
  hoverable?: boolean;
}

export function Card({
  children,
  variant = 'default',
  href,
  hoverable = true,
  className,
  id,
}: CardProps) {
  const classes = cn(
    'card',
    `card--${variant}`,
    hoverable && 'card--hoverable',
    className
  );

  if (href) {
    return (
      <a id={id} href={href} className={cn(classes, 'card--linked')}>
        {children}
      </a>
    );
  }

  return (
    <article id={id} className={classes}>
      {children}
    </article>
  );
}

/* --- Card.Image --- */

interface CardImageProps extends BaseComponentProps {
  image: ImageData;
  /** Aspect ratio override */
  aspectRatio?: string;
}

function CardImage({ image, aspectRatio, className }: CardImageProps) {
  return (
    <div
      className={cn('card__image-wrapper', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <OptimizedImage
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="card__image"
        loading="lazy"
      />
    </div>
  );
}

/* --- Card.Body --- */

function CardBody({ children, className }: BaseComponentProps) {
  return (
    <div className={cn('card__body', className)}>
      {children}
    </div>
  );
}

/* --- Card.Caption --- */

function CardCaption({ children, className }: BaseComponentProps) {
  return (
    <span className={cn('card__caption', className)}>
      {children}
    </span>
  );
}

/* --- Card.Title --- */

interface CardTitleProps extends BaseComponentProps {
  as?: 'h2' | 'h3' | 'h4';
}

function CardTitle({ children, as: Tag = 'h3', className }: CardTitleProps) {
  return (
    <Tag className={cn('card__title', className)}>
      {children}
    </Tag>
  );
}

/* --- Card.Description --- */

function CardDescription({ children, className }: BaseComponentProps) {
  return (
    <p className={cn('card__description', className)}>
      {children}
    </p>
  );
}

/* --- Attach sub-components --- */
Card.Image = CardImage;
Card.Body = CardBody;
Card.Caption = CardCaption;
Card.Title = CardTitle;
Card.Description = CardDescription;
