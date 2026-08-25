import { Link } from 'react-router-dom';
import type { BaseComponentProps, BlogCardData } from '@/types';
import { cn, formatDate } from '@/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import './BlogCard.css';

/* ================================================== */
/* BLOG CARD COMPONENT                                  */
/* ================================================== */
/* Specialized card for blog post listings.             */
/* Features image, category, date, read time, author.   */
/* ================================================== */

interface BlogCardProps extends BaseComponentProps {
  data: BlogCardData;
}

export function BlogCard({ data, className, id }: BlogCardProps) {
  return (
    <article id={id} className={cn('card card--default card--hoverable blog-card', className)}>
      <Link to={data.href} className="blog-card__link">
        <Card.Image image={data.image} aspectRatio="16/10" />
        <div className="card__body blog-card__body">
          <div className="blog-card__meta">
            {data.category && (
              <Badge className="blog-card__category">{data.category}</Badge>
            )}
            <span className="blog-card__date">
              <Icon name="calendar" size="sm" decorative />
              {formatDate(data.date)}
            </span>
          </div>

          <h3 className="card__title blog-card__title">{data.title}</h3>
          <p className="card__description blog-card__excerpt">{data.excerpt}</p>

          <div className="blog-card__footer">
            {data.author && (
              <div className="blog-card__author">
                {data.author.avatar && (
                  <img
                    src={data.author.avatar.src}
                    alt={data.author.avatar.alt}
                    className="blog-card__author-avatar"
                    width={28}
                    height={28}
                    loading="lazy"
                  />
                )}
                <span className="blog-card__author-name">{data.author.name}</span>
              </div>
            )}
            {data.readTime && (
              <span className="blog-card__read-time">
                <Icon name="clock" size="sm" decorative />
                {data.readTime}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
