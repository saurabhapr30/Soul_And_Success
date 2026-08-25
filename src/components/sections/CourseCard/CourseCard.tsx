import type { BaseComponentProps, CourseCardData } from '@/types';
import { cn } from '@/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import './CourseCard.css';

/* ================================================== */
/* COURSE CARD COMPONENT                                */
/* ================================================== */
/* Specialized card for course offerings.               */
/* Displays duration, level badges, and pricing.        */
/* ================================================== */

interface CourseCardProps extends BaseComponentProps {
  data: CourseCardData;
}

export function CourseCard({ data, className, id }: CourseCardProps) {
  return (
    <Card
      id={id}
      hoverable
      className={cn('course-card', className)}
    >
      <Card.Image image={data.image} aspectRatio="16/10" />
      <Card.Body className="course-card__body">
        <div className="course-card__meta">
          {data.level && <Badge>{data.level}</Badge>}
          {data.duration && (
            <span className="course-card__duration">
              <Icon name="clock" size="sm" decorative />
              {data.duration}
            </span>
          )}
        </div>
        <Card.Title>{data.title}</Card.Title>
        <Card.Description>{data.description}</Card.Description>
        <div className="course-card__footer">
          {data.price && (
            <span className="course-card__price">{data.price}</span>
          )}
          {data.href && (
            <Button variant="text" href={data.href} size="sm">
              View Course
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
