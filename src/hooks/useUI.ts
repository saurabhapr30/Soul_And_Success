import { useCallback, useEffect, useState } from 'react';

/* ================================================== */
/* useLockBodyScroll                                    */
/* ================================================== */
/* Locks body scrolling (for modals, mobile menus).     */
/* ================================================== */

export function useLockBodyScroll(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift from scrollbar removal
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
}

/* ================================================== */
/* useToggle                                            */
/* ================================================== */
/* Simple boolean toggle hook.                          */
/* ================================================== */

export function useToggle(
  initialState = false
): [boolean, () => void, (value: boolean) => void] {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((s) => !s), []);
  return [state, toggle, setState];
}
