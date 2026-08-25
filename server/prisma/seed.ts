import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('adminpassword', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@soulandsuccess.com' },
    update: {},
    create: {
      email: 'admin@soulandsuccess.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 2. Create Customer User
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Jane Doe',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      isEmailVerified: true,
    },
  });
  console.log(`Created customer: ${customer.email}`);

  // 3. Seed Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      siteName: 'Soul and Success',
      contactEmail: 'contact@soulandsuccess.com',
      currency: 'INR',
    }
  });

  // 4. Seed Categories
  const catWellness = await prisma.category.upsert({
    where: { slug: 'wellness' },
    update: {},
    create: {
      name: 'Wellness & Healing',
      slug: 'wellness',
      description: 'Crystals, aromatherapy, and ritual tools.',
    }
  });

  const catStationery = await prisma.category.upsert({
    where: { slug: 'journals' },
    update: {},
    create: {
      name: 'Journals & Planners',
      slug: 'journals',
      description: 'Guided planners and reflection journals.',
    }
  });

  const catSelfCare = await prisma.category.upsert({
    where: { slug: 'self-care' },
    update: {},
    create: {
      name: 'Self-Care Rituals',
      slug: 'self-care',
      description: 'Organic oils, candles, and bath salts.',
    }
  });

  // 5. Seed Products
  const productsData = [
    {
      sku: 'WELLNESS-001',
      name: '7-Chakra Healing Crystal Set',
      slug: '7-chakra-healing-crystal-set',
      description: 'Premium natural gemstone set engineered for deep meditation and energy alignment.',
      price: 1499.00,
      stock: 45,
      categoryId: catWellness.id,
      imageUrl: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600',
    },
    {
      sku: 'JOURNAL-001',
      name: 'Soul Guidance Daily Journal',
      slug: 'soul-guidance-daily-journal',
      description: 'Linen-bound luxury prompt journal for mindfulness, gratitude, and goal setting.',
      price: 899.00,
      stock: 100,
      categoryId: catStationery.id,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    },
    {
      sku: 'SELFCARE-001',
      name: 'Aromatherapy Essential Oils Kit',
      slug: 'aromatherapy-essential-oils-kit',
      description: 'Set of 6 pure therapeutic-grade essential oils for stress relief and focus.',
      price: 1999.00,
      stock: 30,
      categoryId: catSelfCare.id,
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600',
    },
    {
      sku: 'SELFCARE-002',
      name: 'Hand-Poured Soy Wax Candle',
      slug: 'hand-poured-soy-wax-candle',
      description: 'Infused with lavender and sandalwood essential oils for high frequency peaceful ambience.',
      price: 799.00,
      stock: 120,
      categoryId: catSelfCare.id,
      imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600',
    },
    {
      sku: 'WELLNESS-002',
      name: 'Mindfulness Mala Beads Bracelet',
      slug: 'mindfulness-mala-beads-bracelet',
      description: '108 natural wooden mala beads with rose quartz accent stone.',
      price: 1299.00,
      stock: 60,
      categoryId: catWellness.id,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
    },
  ];

  for (const p of productsData) {
    const createdProduct = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        price: p.price,
        stock: p.stock,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        price: p.price,
        sku: p.sku,
        stock: p.stock,
        isActive: true,
        images: {
          create: [{ url: p.imageUrl, sortOrder: 0 }],
        },
      },
    });

    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        rating: 5,
        title: 'Transformative quality!',
        comment: `Exceptional product quality. Beautifully crafted and brought great peace to my daily ritual.`,
        isApproved: true,
      },
    }).catch(() => {});
  }

  // 6. Seed E-Books (Book model)
  await prisma.book.upsert({
    where: { slug: 'talk-to-yourself-like-someone-you-love' },
    update: { price: 499.00 },
    create: {
      title: 'Talk To Yourself Like Someone You Love',
      slug: 'talk-to-yourself-like-someone-you-love',
      author: 'Jawedan Sehar',
      description: 'A transformative guide to self-compassion, emotional healing, and personal alignment.',
      price: 499.00,
      format: 'PDF',
      stock: 999,
      isActive: true,
    },
  });

  await prisma.book.upsert({
    where: { slug: 'the-art-of-inner-alignment' },
    update: { price: 699.00 },
    create: {
      title: 'The Art of Inner Alignment',
      slug: 'the-art-of-inner-alignment',
      author: 'Jawedan Sehar',
      description: 'Practical exercises to align your mind, body, and energy with high intention.',
      price: 699.00,
      format: 'EPUB / PDF',
      stock: 999,
      isActive: true,
    },
  });

  // 7. Seed Live Coaching Services (Service model)
  await prisma.service.upsert({
    where: { slug: '1-on-1-transformational-coaching' },
    update: { price: 4999.00 },
    create: {
      title: '1-on-1 Transformational Coaching Session',
      slug: '1-on-1-transformational-coaching',
      description: 'Private 60-minute intensive 1-on-1 coaching session with Jawedan Sehar.',
      shortDescription: '60 min intensive personal mentorship',
      price: 4999.00,
      duration: '60 Mins',
      isActive: true,
    },
  });

  await prisma.service.upsert({
    where: { slug: 'group-mindfulness-workshop' },
    update: { price: 1999.00 },
    create: {
      title: 'Group Mindfulness & Healing Workshop',
      slug: 'group-mindfulness-workshop',
      description: 'Interactive 90-minute live group masterclass on emotional resilience and energy clearing.',
      shortDescription: 'Live group interactive masterclass',
      price: 1999.00,
      duration: '90 Mins',
      isActive: true,
    },
  });

  // 8. Seed Sample Orders
  await prisma.order.upsert({
    where: { orderNumber: 'ORD-2026-1001' },
    update: {},
    create: {
      orderNumber: 'ORD-2026-1001',
      userId: customer.id,
      subtotal: 2398.00,
      discount: 0.00,
      shipping: 0.00,
      tax: 0.00,
      total: 2398.00,
      currency: 'INR',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      shippingAddressSnapshot: {
        fullName: 'Jane Doe',
        addressLine1: '123 Harmony Way',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      },
      billingAddressSnapshot: {
        fullName: 'Jane Doe',
        addressLine1: '123 Harmony Way',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      },
    },
  });

  // 9. Seed Blog Categories and Posts
  const blogCatMindfulness = await prisma.blogCategory.upsert({
    where: { slug: 'mindfulness' },
    update: {},
    create: {
      name: 'Mindfulness',
      slug: 'mindfulness',
      description: 'Articles on living a mindful and present life.',
    }
  });

  const blogCatHealing = await prisma.blogCategory.upsert({
    where: { slug: 'healing' },
    update: {},
    create: {
      name: 'Healing',
      slug: 'healing',
      description: 'Resources for emotional and spiritual healing.',
    }
  });

  const blogTagMeditation = await prisma.blogTag.upsert({
    where: { slug: 'meditation' },
    update: {},
    create: {
      name: 'Meditation',
      slug: 'meditation'
    }
  });

  await prisma.blogPost.upsert({
    where: { slug: 'the-power-of-now' },
    update: {},
    create: {
      title: 'The Power of Now in Daily Life',
      slug: 'the-power-of-now',
      excerpt: 'How to practice presence in a chaotic world.',
      content: '<p>Embracing the present moment is the key to inner peace. It allows us to let go of past regrets and future anxieties.</p><p>Start by simply observing your breath for five minutes a day.</p>',
      authorId: admin.id,
      categoryId: blogCatMindfulness.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      featured: true,
      tags: {
        connect: [{ id: blogTagMeditation.id }]
      }
    }
  });

  await prisma.blogPost.upsert({
    where: { slug: 'healing-your-inner-child' },
    update: {},
    create: {
      title: 'Healing Your Inner Child',
      slug: 'healing-your-inner-child',
      excerpt: 'A journey back to your most authentic self.',
      content: '<p>We all carry wounds from our past. By acknowledging and nurturing our inner child, we can break free from self-sabotaging patterns.</p><p>Take time to listen to what that part of you needs today.</p>',
      authorId: admin.id,
      categoryId: blogCatHealing.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    }
  });

  await prisma.blogPost.upsert({
    where: { slug: 'crystal-healing-basics' },
    update: {},
    create: {
      title: 'Crystal Healing Basics for Beginners',
      slug: 'crystal-healing-basics',
      excerpt: 'An introduction to using crystals for energy balance.',
      content: '<p>Crystals have been used for centuries to promote healing and restore balance. Each stone carries a unique frequency.</p><p>Clear Quartz is a great starting point, known as the master healer.</p>',
      authorId: admin.id,
      categoryId: blogCatHealing.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    }
  });

  console.log('Seeding finished successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
