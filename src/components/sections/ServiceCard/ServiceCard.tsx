import type { BaseComponentProps, ServiceCardData } from '@/types';
import { cn } from '@/utils';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import './ServiceCard.css';

/* ================================================== */
/* SERVICE CARD COMPONENT                               */
/* ================================================== */
/* Specialized card for service offerings.              */
/* Composes the base Card component.                    */
/* ================================================== */

interface ServiceCardProps extends BaseComponentProps {
  data: ServiceCardData;
}

export function ServiceCard({ data, className, id }: ServiceCardProps) {
  return (
    <Card
      id={id}
      href={data.href}
      hoverable
      className={cn('service-card', className)}
    >
      {data.image && (
        <Card.Image image={data.image} aspectRatio="4/3" />
      )}
      <Card.Body>
        {data.icon && (
          <Icon name={data.icon} size="lg" className="service-card__icon" decorative />
        )}
        <Card.Title>{data.title}</Card.Title>
        <Card.Description>{data.description}</Card.Description>
      </Card.Body>
    </Card>
  );
}
