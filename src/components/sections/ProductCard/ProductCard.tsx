import type { BaseComponentProps, ProductCardData } from '@/types';
import { cn } from '@/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import './ProductCard.css';

/* ================================================== */
/* PRODUCT CARD COMPONENT                               */
/* ================================================== */
/* Specialized card for shop/product listings.          */
/* Shows image, category badge, title, and price.       */
/* ================================================== */

interface ProductCardProps extends BaseComponentProps {
  data: ProductCardData;
}

export function ProductCard({ data, className, id }: ProductCardProps) {
  return (
    <Card
      id={id}
      href={data.href}
      hoverable
      className={cn('product-card', className)}
    >
      <Card.Image image={data.image} aspectRatio="1/1" />
      <Card.Body className="product-card__body">
        {data.category && (
          <Badge className="product-card__category">{data.category}</Badge>
        )}
        <Card.Title as="h3">{data.title}</Card.Title>
        <span className="product-card__price">{data.price}</span>
      </Card.Body>
    </Card>
  );
}
