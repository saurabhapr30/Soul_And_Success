import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const getCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true, variant: true }
      }
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true, variant: true } } }
    });
  }

  return cart;
};

export const addItemToCart = async (userId: string, itemData: { productId: string, variantId?: string, quantity: number }) => {
  const { productId, variantId, quantity } = itemData;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new NotFoundError('Product not available');
  if (product.stock < quantity) throw new BadRequestError('Not enough stock available');

  const cart = await getCart(userId);

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: variantId || null }
  });

  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  } else {
    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId,
        quantity,
        unitPrice: product.price
      }
    });
  }
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { product: true } });
  if (!item) throw new NotFoundError('Cart item not found');

  if (item.product.stock < quantity) {
    throw new BadRequestError('Not enough stock available');
  }

  return await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity }
  });
};

export const removeCartItem = async (itemId: string) => {
  return await prisma.cartItem.delete({ where: { id: itemId } });
};

export const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    return await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
};

export const mergeCart = async (userId: string, guestItems: any[]) => {
   const cart = await getCart(userId);
   
   for (const item of guestItems) {
      await addItemToCart(userId, { productId: item.productId, variantId: item.variantId, quantity: item.quantity }).catch(() => {
          // Silently ignore if product is out of stock during merge
      });
   }
   
   return await getCart(userId);
};
