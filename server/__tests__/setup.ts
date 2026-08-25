import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Setup before all tests (e.g. database connection if needed)
});

afterAll(async () => {
  await prisma.$disconnect();
});
