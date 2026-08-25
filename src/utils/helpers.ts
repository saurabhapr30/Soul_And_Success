/* ================================================== */
/* UTILITY FUNCTIONS                                    */
/* ================================================== */

/**
 * Merges class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a number to Indian Rupees (INR) with no fractional digits.
 */
export function formatINR(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numValue);
}

/**
 * Formats a date string into a human-readable format.
 */
export function formatDate(dateString: string, locale = 'en-US'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncates text to a maximum length with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Generates a slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Smooth scroll to an element by ID.
 */
export function scrollToElement(elementId: string, offset = 80): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Debounce function for scroll/resize handlers.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
