import EbookImage from '@/assets/Ebook.png';
import MerchandiseImage from '@/assets/Merchandise.png';
import LifeCoachingImage from '@/assets/Life-Coaching.png';
import SunflowerImage from '@/assets/sunflower.png';
import ServiceProducts from '@/assets/service-products.png';
import ServiceEbook from '@/assets/service-ebook.png';
import ServiceCoaching from '@/assets/service-coaching.png';

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface ProductReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  details: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
  badge?: string;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}

export const CATEGORIES = [
  'All Products',
  'Books',
  'E-Books',
  'Merchandise',
  'Life Coaching',
  'Self-Love',
  'Accessories'
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    slug: 'read-and-heal-book',
    name: 'Read & Heal Book',
    category: 'Books',
    description: 'A journey to self discovery and healing through words.',
    details: 'This hardcover book is beautifully crafted to guide you through mindful exercises, journal prompts, and self-reflection techniques. Made with premium recycled paper.',
    price: 35.00,
    compareAtPrice: 45.00,
    images: [ServiceEbook, SunflowerImage],
    rating: 4.8,
    reviewCount: 124,
    stock: 50,
    featured: true,
    badge: 'BESTSELLER',
    reviews: [
      { id: 'rev1', name: 'Sarah L.', rating: 5, date: 'October 12, 2025', text: 'This book changed my morning routine. Highly recommended!' },
      { id: 'rev2', name: 'Emma D.', rating: 4, date: 'September 28, 2025', text: 'Beautifully written and very calming.' }
    ]
  },
  {
    id: 'prod_2',
    slug: 'mindfulness-journal',
    name: 'Mindfulness Journal',
    category: 'Merchandise',
    description: 'A daily space to practice gratitude and self-love.',
    details: 'Includes 6 months of daily prompts, gratitude sections, and weekly reflections. Bound in vegan leather with gold foil stamping.',
    price: 28.00,
    images: [MerchandiseImage, ServiceProducts],
    rating: 4.5,
    reviewCount: 89,
    stock: 120,
    variants: [
      { id: 'color', name: 'Color', options: ['Sage Green', 'Warm Beige', 'Charcoal'] }
    ]
  },
  {
    id: 'prod_3',
    slug: 'life-coaching-session',
    name: 'Life Coaching Session',
    category: 'Life Coaching',
    description: 'Programs to help you Heal, Clarify and Create the Life you Desire.',
    details: 'A 60-minute virtual session focused on identifying roadblocks, setting actionable goals, and fostering a mindset of abundance.',
    price: 150.00,
    images: [LifeCoachingImage, ServiceCoaching],
    rating: 5.0,
    reviewCount: 42,
    stock: 10,
    badge: 'LIMITED SPOTS'
  },
  {
    id: 'prod_4',
    slug: 'digital-wellness-workbook',
    name: 'Digital Wellness Workbook',
    category: 'E-Books',
    description: 'Simple Guides and Workbooks for your Personal Growth.',
    details: 'A 50-page interactive PDF focusing on digital detoxing, setting boundaries, and reconnecting with your inner self.',
    price: 15.00,
    compareAtPrice: 20.00,
    images: [EbookImage],
    rating: 4.2,
    reviewCount: 56,
    stock: 999,
  },
  {
    id: 'prod_5',
    slug: 'healing-crystals-kit',
    name: 'Healing Crystals Kit',
    category: 'Accessories',
    description: 'Meaningful Reminders to Inspire your Daily Journey.',
    details: 'A curated set of 5 raw crystals (Amethyst, Rose Quartz, Clear Quartz, Citrine, and Black Tourmaline) with a cotton canvas pouch.',
    price: 45.00,
    images: [ServiceProducts],
    rating: 4.9,
    reviewCount: 210,
    stock: 0,
    badge: 'SOLD OUT'
  },
  {
    id: 'prod_6',
    slug: 'self-love-affirmation-cards',
    name: 'Self-Love Affirmation Cards',
    category: 'Self-Love',
    description: 'Start your day with positivity and intention.',
    details: 'A deck of 52 beautifully illustrated cards, each featuring a unique daily affirmation to boost confidence and inner peace.',
    price: 22.00,
    images: [SunflowerImage, MerchandiseImage],
    rating: 4.7,
    reviewCount: 34,
    stock: 200,
  }
];
