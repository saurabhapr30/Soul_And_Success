import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllBooks = async (query: any) => {
  return await prisma.book.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getBookById = async (id: string) => {
  const data = await prisma.book.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('Book not found');
  return data;
};

export const getBookBySlug = async (slug: string) => {
  const data = await prisma.book.findUnique({ where: { slug } });
  if (!data) throw new NotFoundError('Book not found');
  return data;
};

export const createBook = async (data: any) => {
  const { slug, title, ...rest } = data;
  const generatedSlug = slug || (title || 'book').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
  const bookData: any = {
    title,
    slug: generatedSlug,
    ...rest,
  };
  if (Array.isArray(bookData.images)) {
    if (!bookData.coverImage && bookData.images.length > 0) {
      bookData.coverImage = bookData.images[0];
    }
  } else if (bookData.coverImage) {
    bookData.images = [bookData.coverImage];
  }
  return await prisma.book.create({
    data: bookData,
  });
};

export const updateBook = async (id: string, data: any) => {
  // Strip relational / unknown fields Prisma doesn't accept as scalars
  const {
    id: _id, createdAt, updatedAt,
    category, // strip relation object, keep categoryId scalar only
    ...safe
  } = data;
  if (Array.isArray(safe.images)) {
    if (safe.images.length > 0) {
      safe.coverImage = safe.images[0];
    } else {
      safe.coverImage = null;
    }
  } else if (safe.coverImage) {
    safe.images = [safe.coverImage];
  }
  return await prisma.book.update({ where: { id }, data: safe });
};

export const deleteBook = async (id: string) => {
  return await prisma.book.delete({ where: { id } });
};

export const getBookOrders = async (id: string) => {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return [];
  const orderItems = await prisma.orderItem.findMany({
    where: { sku: { contains: `BOOK-${id}` } },
    include: {
      order: { include: { user: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return orderItems;
};

export const getBookOrderCount = async (id: string): Promise<number> => {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return 0;
  return await prisma.orderItem.count({ where: { sku: { contains: `BOOK-${id}` } } });
};
