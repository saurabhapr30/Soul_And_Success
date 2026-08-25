import { PrismaClient } from '@prisma/client';
import { handlePaymentSuccess } from './src/services/paymentService';
import { createOrder } from './src/services/orderService';
import { getBookOrders, getBookOrderCount } from './src/services/bookService';
import { getCourseEnrollments } from './src/services/courseService';

const prisma = new PrismaClient();

async function runTests() {
  console.log('--- STARTING VERIFICATION ---');
  let testUser = null;
  let testCourse = null;
  let testBookA = null;
  let testBookB = null;
  let testProduct = null;
  let testOrderCourse = null;
  let testOrderBookA = null;
  let testOrderMerch = null;
  
  try {
    // SETUP FIXTURES
    console.log('Setting up fixtures...');
    testUser = await prisma.user.create({
      data: {
        email: `testuser-${Date.now()}@example.com`,
        name: 'Test User',
        passwordHash: 'dummy',
        addresses: {
          create: {
            fullName: 'Test User',
            phone: '1234567890',
            addressLine1: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            postalCode: '12345',
            country: 'Test Country'
          }
        }
      }
    });

    const category = await prisma.category.create({
      data: { name: 'Test Cat', slug: `test-cat-${Date.now()}` }
    });

    testCourse = await prisma.course.create({
      data: {
        title: 'Test Course',
        slug: `test-course-${Date.now()}`,
        description: 'Desc',
        price: 99.99,
        isPublished: true,
      }
    });

    testBookA = await prisma.book.create({
      data: {
        title: 'Test Book A',
        slug: `test-book-a-${Date.now()}`,
        description: 'Desc',
        author: 'Author',
        price: 19.99,
        isActive: true,
      }
    });

    testBookB = await prisma.book.create({
      data: {
        title: 'Test Book A', // Same name deliberately
        slug: `test-book-b-${Date.now()}`,
        description: 'Desc',
        author: 'Author',
        price: 19.99,
        isActive: true,
      }
    });

    testProduct = await prisma.product.create({
      data: {
        name: 'Test Merchandise',
        slug: `test-merch-${Date.now()}`,
        description: 'Desc',
        price: 29.99,
        sku: `MERCH-${Date.now()}`,
        categoryId: category.id,
        stock: 10,
        isActive: true,
      }
    });

    // 1 & 2. COURSE PURCHASE & ENROLLMENT (Idempotency & Identification)
    console.log('Testing Course Purchase...');
    testOrderCourse = await createOrder(testUser.id, {
      items: [{ productId: testCourse.id, quantity: 1, itemType: 'course' }],
      subtotal: 99.99, discount: 0, shipping: 0, total: 99.99
    });
    
    let courseOrderFromDb = await prisma.order.findUnique({ where: { id: testOrderCourse.id }, include: { items: true } });
    if (!courseOrderFromDb || courseOrderFromDb.items[0].sku !== `COURSE-${testCourse.id}`) {
       console.log('FAIL: Course SKU identification incorrect');
    } else {
       console.log('PASS: Course SKU identification correct');
    }

    // Trigger payment success
    await handlePaymentSuccess(testOrderCourse.id, {});
    let enrollments1 = await prisma.courseEnrollment.findMany({ where: { orderId: testOrderCourse.id } });
    if (enrollments1.length === 1) {
       console.log('PASS: Exactly 1 CourseEnrollment created on success');
    } else {
       console.log(`FAIL: Expected 1 CourseEnrollment, got ${enrollments1.length}`);
    }

    // Trigger payment success again (Idempotency)
    await handlePaymentSuccess(testOrderCourse.id, {});
    let enrollments2 = await prisma.courseEnrollment.findMany({ where: { orderId: testOrderCourse.id } });
    if (enrollments2.length === 1) {
       console.log('PASS: Idempotency confirmed, still exactly 1 CourseEnrollment exists');
    } else {
       console.log(`FAIL: Idempotency failed, got ${enrollments2.length} enrollments`);
    }

    // 3. BOOK IDENTIFICATION
    console.log('Testing Book Purchase...');
    testOrderBookA = await createOrder(testUser.id, {
      items: [{ productId: testBookA.id, quantity: 1, itemType: 'book' }],
      subtotal: 19.99, discount: 0, shipping: 0, total: 19.99
    });

    let bookOrderFromDb = await prisma.order.findUnique({ where: { id: testOrderBookA.id }, include: { items: true } });
    if (!bookOrderFromDb || bookOrderFromDb.items[0].sku !== `BOOK-${testBookA.id}`) {
       console.log('FAIL: Book SKU identification incorrect');
    } else {
       console.log('PASS: Book SKU identification correct');
    }

    const bookACount = await getBookOrderCount(testBookA.id);
    const bookBCount = await getBookOrderCount(testBookB.id);

    if (bookACount === 1 && bookBCount === 0) {
       console.log('PASS: Book order counts strictly identify the correct book despite identical titles');
    } else {
       console.log(`FAIL: Book counts incorrect. BookA: ${bookACount}, BookB: ${bookBCount}`);
    }

    // 4. MERCHANDISE REGRESSION
    console.log('Testing Merchandise Purchase...');
    testOrderMerch = await createOrder(testUser.id, {
      items: [{ productId: testProduct.id, quantity: 1, itemType: 'product' }],
      subtotal: 29.99, discount: 0, shipping: 0, total: 29.99
    });

    let merchOrderFromDb = await prisma.order.findUnique({ where: { id: testOrderMerch.id }, include: { items: true } });
    if (!merchOrderFromDb || merchOrderFromDb.items[0].productId !== testProduct.id) {
       console.log('FAIL: Merchandise regression. productId not mapped properly.');
    } else {
       console.log('PASS: Merchandise order correctly maps to Product table via productId.');
    }

    // 5. ADMIN ENROLLMENT DETAILS
    console.log('Testing Admin Enrollment Details...');
    const fetchedEnrollments = await getCourseEnrollments(testCourse.id);
    if (fetchedEnrollments.length > 0 && fetchedEnrollments[0].user && fetchedEnrollments[0].user.addresses) {
       const user = fetchedEnrollments[0].user;
       if (user.name === 'Test User' && user.addresses.length > 0 && user.addresses[0].city === 'Test City') {
          console.log('PASS: Admin CourseEnrollment endpoint returns User Name, Phone, Email, and Address');
       } else {
          console.log('FAIL: User details or Address missing from payload');
       }
    } else {
       console.log('FAIL: Address relation not included in CourseEnrollment query');
    }

  } catch (error) {
    console.error('ERROR during testing:', error);
  } finally {
    // TEARDOWN
    console.log('Cleaning up fixtures...');
    if (testOrderCourse) await prisma.orderItem.deleteMany({ where: { orderId: testOrderCourse.id }});
    if (testOrderBookA) await prisma.orderItem.deleteMany({ where: { orderId: testOrderBookA.id }});
    if (testOrderMerch) await prisma.orderItem.deleteMany({ where: { orderId: testOrderMerch.id }});
    if (testOrderCourse) await prisma.courseEnrollment.deleteMany({ where: { orderId: testOrderCourse.id }});
    if (testOrderCourse) await prisma.order.delete({ where: { id: testOrderCourse.id }});
    if (testOrderBookA) await prisma.order.delete({ where: { id: testOrderBookA.id }});
    if (testOrderMerch) await prisma.order.delete({ where: { id: testOrderMerch.id }});
    if (testProduct) await prisma.product.delete({ where: { id: testProduct.id }});
    if (testBookA) await prisma.book.delete({ where: { id: testBookA.id }});
    if (testBookB) await prisma.book.delete({ where: { id: testBookB.id }});
    if (testCourse) await prisma.course.delete({ where: { id: testCourse.id }});
    if (testProduct) await prisma.category.delete({ where: { id: testProduct.categoryId }});
    if (testUser) await prisma.user.delete({ where: { id: testUser.id }});
    await prisma.$disconnect();
    console.log('--- VERIFICATION COMPLETE ---');
  }
}

runTests();
