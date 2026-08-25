import { useState, useCallback, useId } from 'react';
import type { BaseComponentProps, FAQItem } from '@/types';
import { cn } from '@/utils';
import { useScrollReveal } from '@/hooks';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import './FAQ.css';

/* ================================================== */
/* FAQ SECTION COMPONENT                                */
/* ================================================== */
/* Accessible accordion with proper ARIA attributes,    */
/* keyboard navigation, and smooth animation.           */
/* ================================================== */

interface FAQProps extends BaseComponentProps {
  /** Optional eyebrow caption */
  caption?: string;
  /** Section title */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** FAQ items */
  items: FAQItem[];
  /** Allow multiple items to be open simultaneously */
  allowMultiple?: boolean;
}

export function FAQ({
  caption,
  title,
  subtitle,
  items,
  allowMultiple = false,
  className,
  id,
}: FAQProps) {
  const { ref } = useScrollReveal<HTMLElement>();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = useCallback(
    (itemId: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
          next.add(itemId);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, itemId: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(itemId);
      }
    },
    [toggleItem]
  );

  return (
    <section
      ref={ref}
      id={id}
      className={cn('faq', 'reveal', className)}
    >
      <div className="container">
        {(caption || title) && (
          <SectionHeading
            caption={caption}
            title={title || ''}
            subtitle={subtitle}
            alignment="center"
          />
        )}

        <div className="faq__list" role="list">
          {items.map((item) => (
            <FAQAccordionItem
              key={item.id}
              item={item}
              isOpen={openItems.has(item.id)}
              onToggle={toggleItem}
              onKeyDown={handleKeyDown}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================== */
/* FAQ ACCORDION ITEM (internal)                        */
/* ================================================== */

interface FAQAccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
}

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  onKeyDown,
}: FAQAccordionItemProps) {
  const panelId = useId();
  const triggerId = useId();

  return (
    <div className={cn('faq-item', isOpen && 'faq-item--open')} role="listitem">
      <button
        id={triggerId}
        className="faq-item__trigger"
        onClick={() => onToggle(item.id)}
        onKeyDown={(e) => onKeyDown(e, item.id)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="faq-item__question">{item.question}</span>
        <Icon
          name={isOpen ? 'minus' : 'plus'}
          size="md"
          className="faq-item__icon"
          decorative
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="faq-item__panel"
        hidden={!isOpen}
      >
        <div className="faq-item__answer">
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
}
