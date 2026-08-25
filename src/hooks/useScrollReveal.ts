import { useEffect, useRef, useState } from 'react';
import { ANIMATION } from '@/constants/design';

/* ================================================== */
/* useScrollReveal                                      */
/* ================================================== */
/* IntersectionObserver hook for scroll-triggered       */
/* reveal animations. Adds 'revealed' class when        */
/* element enters viewport.                             */
/* ================================================== */

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {}
) {
  const {
    threshold = ANIMATION.threshold,
    rootMargin = ANIMATION.rootMargin,
    triggerOnce = true,
  } = options;

  const ref = useRef<T>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          element.classList.add('revealed');

          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsRevealed(false);
          element.classList.remove('revealed');
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isRevealed };
}
