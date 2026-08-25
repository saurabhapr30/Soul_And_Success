/* ================================================== */
/* SHARED TYPE DEFINITIONS                              */
/* ================================================== */

/** Base props all components can accept */
export interface BaseComponentProps {
  className?: string;
  id?: string;
  children?: React.ReactNode;
}

/** SEO metadata for pages */
export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

/** Navigation link */
export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
  children?: NavLink[];
}

/** CTA (Call to Action) data */
export interface CTAData {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'text';
  isExternal?: boolean;
}

/** Image data with accessibility */
export interface ImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/** Section heading with optional subtitle and caption */
export interface SectionHeadingData {
  caption?: string;
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
}

/** Testimonial */
export interface TestimonialData {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: ImageData;
  rating?: number;
}

/** FAQ Item */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

/** Service Card data */
export interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  image?: ImageData;
  href?: string;
  icon?: string;
}

/** Book Card data */
export interface BookCardData {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: ImageData;
  href?: string;
  price?: string;
}

/** Course Card data */
export interface CourseCardData {
  id: string;
  title: string;
  description: string;
  image: ImageData;
  href?: string;
  duration?: string;
  level?: string;
  price?: string;
}

/** Product Card data */
export interface ProductCardData {
  id: string;
  title: string;
  description: string;
  image: ImageData;
  price: string;
  href?: string;
  category?: string;
}

/** Blog Card data */
export interface BlogCardData {
  id: string;
  title: string;
  excerpt: string;
  image: ImageData;
  href: string;
  date: string;
  category?: string;
  readTime?: string;
  author?: {
    name: string;
    avatar?: ImageData;
  };
}

/** Newsletter form */
export interface NewsletterFormData {
  email: string;
}

/** Breadcrumb item */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Social media link */
export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
  ariaLabel: string;
}

/** Footer column */
export interface FooterColumn {
  title: string;
  links: NavLink[];
}
