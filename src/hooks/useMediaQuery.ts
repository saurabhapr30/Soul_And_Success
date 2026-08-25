import { useEffect, useState } from 'react';
import { BREAKPOINTS } from '@/constants/design';

/* ================================================== */
/* useMediaQuery                                        */
/* ================================================== */
/* Reactive media query hook for responsive logic.      */
/* ================================================== */

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    mql.addEventListener('change', handler);
    setMatches(mql.matches);

    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/* --- Convenience hooks --- */

export function useIsMobile(): boolean {
  // We treat everything below lg (1024px) as mobile/tablet for UI toggle purposes like Navbar
  return useMediaQuery(`(max-width: ${BREAKPOINTS.lg - 1}px)`);
}

export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`
  );
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}
