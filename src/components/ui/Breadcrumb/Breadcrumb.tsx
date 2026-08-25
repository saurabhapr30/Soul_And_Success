import { Link } from 'react-router-dom';
import type { BreadcrumbItem, BaseComponentProps } from '@/types';
import { cn } from '@/utils';
import './Breadcrumb.css';

/* ================================================== */
/* BREADCRUMB COMPONENT                                 */
/* ================================================== */

interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items, className, id }: BreadcrumbProps) {
  return (
    <nav id={id} className={cn('breadcrumb', className)} aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => (
          <li key={item.label} className="breadcrumb__item">
            {index > 0 && <span className="breadcrumb__separator">/</span>}
            {item.href && index < items.length - 1 ? (
              <Link to={item.href} className="breadcrumb__link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumb__current" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
