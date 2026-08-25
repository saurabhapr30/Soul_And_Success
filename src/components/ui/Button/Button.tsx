import type { BaseComponentProps } from '@/types';
import { cn } from '@/utils';
import './Button.css';

/* ================================================== */
/* BUTTON COMPONENT                                     */
/* ================================================== */

interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isExternal?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  isExternal = false,
  type = 'button',
  disabled = false,
  onClick,
  className,
  id,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled && 'btn--disabled',
    className
  );

  if (href) {
    return (
      <a
        id={id}
        href={href}
        className={classes}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      id={id}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
