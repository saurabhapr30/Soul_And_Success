const { PrismaClient } = require('./server/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Testing DB round-trips for dynamic info fields...');

  const bestOffers = ['Offer one', 'Offer two', 'Offer three'];
  const termsAndConditions = ['Condition one', 'Condition two'];
  const productDetails = ['Detail one', 'Detail two', 'Detail three'];

  try {
    // 1. PRODUCT
    const product = await prisma.product.create({
      data: {
        name: 'Test Product A',
        slug: 'test-product-a',
        description: 'Test product for verification',
        price: 99.99,
        sku: 'TEST-SKU-A',
        bestOffers,
        termsAndConditions,
        productDetails,
        category: {
          connectOrCreate: {
            where: { slug: 'general' },
            create: { name: 'General', slug: 'general' }
          }
        }
      }
    });

    const fetchedProduct = await prisma.product.findUnique({ where: { id: product.id } });
    console.log('Product Round-Trip:', fetchedProduct.bestOffers.length === 3 && fetchedProduct.termsAndConditions.length === 2 && fetchedProduct.productDetails.length === 3 ? 'PASS' : 'FAIL');

    // 2. COURSE
    const course = await prisma.course.create({
      data: {
        title: 'Test Course A',
        slug: 'test-course-a',
        description: 'Test course for verification',
        price: 199.99,
        bestOffers,
        termsAndConditions,
        productDetails
      }
    });

    const fetchedCourse = await prisma.course.findUnique({ where: { id: course.id } });
    console.log('Course Round-Trip:', fetchedCourse.bestOffers.length === 3 && fetchedCourse.termsAndConditions.length === 2 && fetchedCourse.productDetails.length === 3 ? 'PASS' : 'FAIL');

    // 3. BOOK
    const book = await prisma.book.create({
      data: {
        title: 'Test Book A',
        slug: 'test-book-a',
        author: 'Test Author',
        description: 'Test book for verification',
        price: 29.99,
        bestOffers,
        termsAndConditions,
        productDetails
      }
    });

    const fetchedBook = await prisma.book.findUnique({ where: { id: book.id } });
    console.log('Book Round-Trip:', fetchedBook.bestOffers.length === 3 && fetchedBook.termsAndConditions.length === 2 && fetchedBook.productDetails.length === 3 ? 'PASS' : 'FAIL');

    // Cross-product isolation check
    const productB = await prisma.product.create({
      data: {
        name: 'Test Product B',
        slug: 'test-product-b',
        description: 'Test product B',
        price: 99.99,
        sku: 'TEST-SKU-B',
        bestOffers: ['Offer B'],
        termsAndConditions: [],
        productDetails: [],
        category: { connect: { slug: 'general' } }
      }
    });

    const fetchedProductB = await prisma.product.findUnique({ where: { id: productB.id } });
    console.log('Product Isolation Check (Product A vs B):', fetchedProduct.bestOffers.length !== fetchedProductB.bestOffers.length && fetchedProductB.bestOffers[0] === 'Offer B' ? 'PASS' : 'FAIL');

    // Clean up
    await prisma.product.deleteMany({ where: { id: { in: [product.id, productB.id] } } });
    await prisma.course.delete({ where: { id: course.id } });
    await prisma.book.delete({ where: { id: book.id } });
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
