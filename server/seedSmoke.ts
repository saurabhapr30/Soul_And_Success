import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function seed() {
  const course = await prisma.course.findFirst();
  if (!course) return;
  const user = await prisma.user.findFirst() || await prisma.user.create({
    data: {
      email: 'smoke@example.com',
      name: 'Smoke Tester',
      passwordHash: 'dummy',
      addresses: {
        create: {
          fullName: 'Smoke Tester',
          phone: '1234567890',
          addressLine1: '456 Smoke Ave',
          city: 'Smoke City',
          state: 'Smoke State',
          postalCode: '99999',
          country: 'Smoke Country'
        }
      }
    }
  });
  
  // Make sure we have the address included in user object for phone
  await prisma.user.update({
    where: { id: user.id },
    data: { phone: '1234567890' }
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: `SMOKE-${Date.now()}`,
      userId: user.id,
      subtotal: 99.99,
      total: 99.99,
      paymentStatus: 'PAID',
      shippingAddressSnapshot: {},
      billingAddressSnapshot: {},
      items: {
        create: {
          sku: `COURSE-${course.id}`,
          quantity: 1,
          unitPrice: 99.99,
          total: 99.99,
          productName: course.title,
        }
      }
    }
  });

  await prisma.courseEnrollment.create({
    data: {
      userId: user.id,
      courseId: course.id,
      orderId: order.id,
      status: 'ACTIVE',
      progress: 0
    }
  });
  console.log('Seeded course enrollment for:', course.title);
}
seed().finally(() => prisma.$disconnect());
