import { useEffect, useCallback } from 'react';
import type { BaseComponentProps } from '@/types';
import { cn } from '@/utils';

/* ================================================== */
/* OVERLAY COMPONENT                                    */
/* ================================================== */
/* Modal backdrop overlay. Uses existing .overlay CSS.  */
/* Closes on click and Escape key.                      */
/* ================================================== */

interface OverlayProps extends BaseComponentProps {
  /** Whether the overlay is visible */
  isActive: boolean;
  /** Callback when overlay is dismissed */
  onClose: () => void;
}

export function Overlay({
  isActive,
  onClose,
  children,
  className,
  id,
}: OverlayProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);

  return (
    <div
      id={id}
      className={cn('overlay', isActive && 'active', className)}
      onClick={onClose}
      role="presentation"
    >
      {children}
    </div>
  );
}
