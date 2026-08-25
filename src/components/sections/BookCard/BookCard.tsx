import type { BaseComponentProps, BookCardData } from '@/types';
import { cn } from '@/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import './BookCard.css';

/* ================================================== */
/* BOOK CARD COMPONENT                                  */
/* ================================================== */
/* Specialized card for book listings.                  */
/* Features prominent cover image with author + price.  */
/* ================================================== */

interface BookCardProps extends BaseComponentProps {
  data: BookCardData;
}

export function BookCard({ data, className, id }: BookCardProps) {
  return (
    <Card
      id={id}
      hoverable
      className={cn('book-card', className)}
    >
      <Card.Image
        image={data.coverImage}
        className="book-card__cover"
        aspectRatio="3/4"
      />
      <Card.Body className="book-card__body">
        <Card.Title>{data.title}</Card.Title>
        <span className="book-card__author">{data.author}</span>
        <Card.Description>{data.description}</Card.Description>
        <div className="book-card__footer">
          {data.price && (
            <span className="book-card__price">{data.price}</span>
          )}
          {data.href && (
            <Button variant="text" href={data.href} size="sm">
              Learn More
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
