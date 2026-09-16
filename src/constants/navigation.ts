import type { NavLink, FooterColumn, SocialLink } from '@/types';

/* ================================================== */
/* NAVIGATION CONSTANTS                                 */
/* ================================================== */

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Books', href: '/books' },
  { label: 'Merchandise', href: '/shop' },
  { label: 'Resources', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Books', href: '/books' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Shop', href: '/shop' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: 'Instagram',
    href: 'https://instagram.com',
    icon: 'instagram',
    ariaLabel: 'Follow us on Instagram',
  },
  {
    platform: 'Facebook',
    href: 'https://facebook.com',
    icon: 'facebook',
    ariaLabel: 'Follow us on Facebook',
  },
  {
    platform: 'Pinterest',
    href: 'https://pinterest.com',
    icon: 'pinterest',
    ariaLabel: 'Follow us on Pinterest',
  },
  {
    platform: 'YouTube',
    href: 'https://youtube.com',
    icon: 'youtube',
    ariaLabel: 'Subscribe on YouTube',
  },
];
