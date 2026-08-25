import { useEffect } from 'react';
import type { SEOProps } from '@/types';

/* ================================================== */
/* SEO HEAD COMPONENT                                   */
/* ================================================== */
/* Sets document title and meta tags dynamically.       */
/* ================================================== */

const SITE_NAME = 'SandS';

export function SEOHead({
  title,
  description,
  canonical,
  ogImage,
}: SEOProps) {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setOgMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    setOgMeta('og:title', `${title} | ${SITE_NAME}`);
    setOgMeta('og:description', description);
    setOgMeta('og:type', 'website');

    if (ogImage) {
      setOgMeta('og:image', ogImage);
    }

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, canonical, ogImage]);

  return null;
}
