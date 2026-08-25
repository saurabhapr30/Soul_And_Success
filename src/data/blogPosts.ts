export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  featured?: boolean;
}

import blogFeatured from '@/assets/blog-featured.png';
import sunflower from '@/assets/sunflower.png';
import leaves from '@/assets/leaves.jpg';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'unveiling-some-lifes-secrets',
    title: "Unveiling Some Life's Secrets Which You Must Know",
    excerpt: 'Get Clarity on Life and Create the Results You want To Achieve In Major Areas Of Life Like Relationships, Wealth, Career and Health',
    category: 'The "Inner Work"',
    image: blogFeatured,
    author: 'Jawedan Sehar',
    date: 'Jan 12, 2026',
    featured: true,
  },
  {
    id: '2',
    slug: 'how-to-heal-emotionally-without-losing-yourself-1',
    title: 'HOW TO HEAL EMOTIONALLY WITHOUT LOSING YOURSELF',
    excerpt: "Emotional healing isn't about forgetting the past—it's about creating peace with it. Discover simple practices that help you let go of emotional baggage and reconnect with yourself.",
    category: 'Relationships',
    image: leaves, // Fallback for Empty chair
    author: 'Jawedan Sehar',
    date: 'Jan 12, 2026',
  },
  {
    id: '3',
    slug: 'how-to-heal-emotionally-without-losing-yourself-2',
    title: 'HOW TO HEAL EMOTIONALLY WITHOUT LOSING YOURSELF',
    excerpt: "Emotional healing isn't about forgetting the past—it's about creating peace with it. Discover simple practices that help you let go of emotional baggage and reconnect with yourself.",
    category: 'The "Inner Work"',
    image: sunflower, // Fallback for scarcity
    author: 'Jawedan Sehar',
    date: 'Jan 12, 2026',
  },
  {
    id: '4',
    slug: 'how-to-heal-emotionally-without-losing-yourself-3',
    title: 'HOW TO HEAL EMOTIONALLY WITHOUT LOSING YOURSELF',
    excerpt: "Emotional healing isn't about forgetting the past—it's about creating peace with it. Discover simple practices that help you let go of emotional baggage and reconnect with yourself.",
    category: 'Attraction',
    image: leaves, // Fallback for Empty chair
    author: 'Jawedan Sehar',
    date: 'Jan 12, 2026',
  },
  {
    id: '5',
    slug: 'how-to-heal-emotionally-without-losing-yourself-4',
    title: 'HOW TO HEAL EMOTIONALLY WITHOUT LOSING YOURSELF',
    excerpt: "Emotional healing isn't about forgetting the past—it's about creating peace with it. Discover simple practices that help you let go of emotional baggage and reconnect with yourself.",
    category: 'Communication',
    image: sunflower, // Fallback for scarcity
    author: 'Jawedan Sehar',
    date: 'Jan 12, 2026',
  },
  {
    id: '6',
    slug: 'how-to-heal-emotionally-without-losing-yourself-5',
    title: 'HOW TO HEAL EMOTIONALLY WITHOUT LOSING YOURSELF',
    excerpt: "Emotional healing isn't about forgetting the past—it's about creating peace with it. Discover simple practices that help you let go of emotional baggage and reconnect with yourself.",
    category: 'Dating',
    image: leaves, // Fallback for Empty chair
    author: 'Jawedan Sehar',
    date: 'Jan 12, 2026',
  },
  {
    id: '7',
    slug: 'how-to-heal-emotionally-without-losing-yourself-6',
    title: 'HOW TO HEAL EMOTIONALLY WITHOUT LOSING YOURSELF',
    excerpt: "Emotional healing isn't about forgetting the past—it's about creating peace with it. Discover simple practices that help you let go of emotional baggage and reconnect with yourself.",
    category: 'Feminine Energy',
    image: sunflower, // Fallback for scarcity
    author: 'Jawedan Sehar',
    date: 'Jan 12, 2026',
  }
];

export const BLOG_CATEGORIES = [
  'Relationships',
  'The "Inner Work"',
  'Attraction',
  'Communication',
  'Dating',
  'Feminine Energy',
  'Intimacy',
  'Masculine Energy'
];
