import { useEffect, useState } from 'react';

/* ================================================== */
/* useScrollPosition                                    */
/* ================================================== */
/* Tracks scroll position for navbar transparency,      */
/* parallax, and scroll-dependent UI changes.           */
/* ================================================== */

interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | null;
  isScrolled: boolean;
}

export function useScrollPosition(threshold = 50): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: null,
    isScrolled: false,
  });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setPosition({
            x: window.scrollX,
            y: currentY,
            direction: currentY > lastY ? 'down' : 'up',
            isScrolled: currentY > threshold,
          });
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return position;
}
