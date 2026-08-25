/* ================================================== */
/* DESIGN SYSTEM CONSTANTS                              */
/* ================================================== */
/* JavaScript-side reference for design tokens.         */
/* Used in components that need programmatic access.    */
/* ================================================== */

export const BREAKPOINTS = {
  sm: 390,
  md: 768,
  lg: 1024,
  xl: 1440,
  '2xl': 1600,
} as const;

export const ANIMATION = {
  duration: {
    fast: 150,
    base: 300,
    slow: 500,
  },
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px',
} as const;

export const LAYOUT = {
  maxWidth: 1280,
  fullWidth: 1920,
  contentPadding: 24,
  gridColumns: 12,
  gridGutter: 24,
} as const;
