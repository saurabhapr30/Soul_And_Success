import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

const mapProduct = (product: any) => ({
  ...product,
  price: Number(product.price),
  compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
  category: product.category?.name || 'Uncategorized',
  images: product.images?.length ? product.images.map((img: any) => img.url) : [],
  variants: product.variants?.map((v: any) => ({
    ...v,
    price: Number(v.price),
    options: v.attributes ? Object.values(v.attributes) : []
  })) || []
});

export const getAllProducts = async (query: any) => {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      category: true,
      variants: true,
      reviews: true,
      _count: { select: { orderItems: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return products.map(mapProduct);
};

export const getProductById = async (id: string) => {
  const data = await prisma.product.findUnique({ 
    where: { id },
    include: {
      images: true,
      category: true,
      variants: true,
      reviews: true
    }
  });
  if (!data) throw new NotFoundError('Product not found');
  return mapProduct(data);
};

export const getProductBySlug = async (slug: string) => {
  const data = await prisma.product.findUnique({ 
    where: { slug },
    include: {
      images: true,
      category: true,
      variants: true,
      reviews: true
    }
  });
  if (!data) throw new NotFoundError('Product not found');
  return mapProduct(data);
};

export const createProduct = async (data: any) => {
  const { images, price, stock, categoryId, slug, sku, ...rest } = data;

  let targetCategoryId = categoryId;
  if (!targetCategoryId) {
    const firstCat = await prisma.category.findFirst();
    if (firstCat) {
      targetCategoryId = firstCat.id;
    } else {
      const newCat = await prisma.category.create({
        data: { name: 'General', slug: 'general' }
      });
      targetCategoryId = newCat.id;
    }
  }

  const generatedSlug = slug || (rest.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
  const generatedSku = sku || 'SKU-' + Date.now().toString().slice(-6);

  const createData: any = {
    ...rest,
    slug: generatedSlug,
    sku: generatedSku,
    categoryId: targetCategoryId,
    price: price || 0,
    stock: stock || 0,
  };

  if (images && Array.isArray(images) && images.length > 0) {
    createData.images = {
      create: images.map((url: string, index: number) => ({
        url,
        sortOrder: index,
      })),
    };
  }

  const product = await prisma.product.create({
    data: createData,
    include: {
      images: true,
      category: true,
      variants: true,
      reviews: true
    }
  });
  return mapProduct(product);
};

export const updateProduct = async (id: string, data: any) => {
  const { id: _id, createdAt, updatedAt, images, price, stock, category, categoryId, ...rest } = data;

  const updateData: any = { ...rest };
  if (price !== undefined) updateData.price = price;
  if (stock !== undefined) updateData.stock = stock;

  if (images && Array.isArray(images)) {
    updateData.images = {
      deleteMany: {},
      create: images.map((url: string, index: number) => ({
        url,
        sortOrder: index,
      })),
    };
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      images: true,
      category: true,
      variants: true,
      reviews: true
    }
  });
  return mapProduct(product);
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.delete({ where: { id } });
};

export const getProductOrders = async (id: string) => {
  const orderItems = await prisma.orderItem.findMany({
    where: { productId: id },
    include: {
      order: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return orderItems;
};
