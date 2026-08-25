import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const createOrder = async (userId: string | null, orderData: any) => {
  const { items, shippingAddress, billingAddress, couponCode, subtotal: clientSubtotal, discount: clientDiscount, shipping: clientShipping, total: clientTotal } = orderData;

  if (!items || items.length === 0) {
    throw new BadRequestError('Order must contain at least one item');
  }

  return await prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const orderItemsToCreate = [];

    // 1. Verify items and calculate subtotal
    for (const item of items) {
      const itemType = item.itemType || 'product'; // 'product', 'book', or 'service'

      let itemName: string;
      let itemPrice: number;
      let itemSku: string;

      if (itemType === 'book') {
        // Look up in Book table
        const book = await tx.book.findUnique({ where: { id: item.productId } });
        if (!book || !book.isActive) {
          throw new BadRequestError(`Book "${item.productId}" is not available`);
        }
        itemName = book.title;
        itemPrice = Number(book.price);
        itemSku = `BOOK-${book.id}`;
        // Digital products: no stock decrement needed for e-books
      } else if (itemType === 'service') {
        // Look up in Service table
        const service = await tx.service.findUnique({ where: { id: item.productId } });
        if (!service || !service.isActive) {
          throw new BadRequestError(`Service "${item.productId}" is not available`);
        }
        itemName = service.title;
        itemPrice = Number(service.price || 0);
        itemSku = `SVC-${service.id.substring(0, 8)}`;
        // Services: no stock decrement
      } else if (itemType === 'course') {
        if (!userId) {
          throw new BadRequestError('You must be logged in to enroll in a course.');
        }
        // Look up in Course table
        const course = await tx.course.findUnique({ where: { id: item.productId } });
        if (!course || !course.isPublished) {
          throw new BadRequestError(`Course "${item.productId}" is not available`);
        }
        itemName = course.title;
        itemPrice = Number(course.price);
        itemSku = `COURSE-${course.id}`;
        // Courses: no stock decrement
      } else {
        // Default: look up in Product table
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || !product.isActive) {
          throw new BadRequestError(`Product ${item.productId} is not available`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestError(`Insufficient stock for product ${product.name}`);
        }

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } }
        });

        itemName = product.name;
        itemPrice = Number(product.price);
        itemSku = product.sku;
      }

      const total = itemPrice * item.quantity;
      subtotal += total;

      orderItemsToCreate.push({
        // Only set productId for actual Product table items
        productId: itemType === 'product' ? item.productId : null,
        productName: itemName,
        sku: itemSku,
        quantity: item.quantity,
        unitPrice: itemPrice,
        total
      });
    }

    // 2. Coupon logic
    let discount = 0;
    let couponId = null;
    if (couponCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
      if (!coupon || !coupon.isActive) {
        throw new BadRequestError('Invalid coupon');
      }
      if (coupon.minimumOrderValue && subtotal < Number(coupon.minimumOrderValue)) {
        throw new BadRequestError(`Minimum order value for this coupon is ${coupon.minimumOrderValue}`);
      }

      if (coupon.type === 'PERCENTAGE') {
        discount = subtotal * (Number(coupon.value) / 100);
        if (coupon.maximumDiscount && discount > Number(coupon.maximumDiscount)) {
          discount = Number(coupon.maximumDiscount);
        }
      } else {
        discount = Number(coupon.value);
      }

      // Update coupon usage
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } }
      });
      couponId = coupon.id;
    }

    // 3. Calculate shipping server-side
    let requiresShipping = false;
    for (const item of items) {
      if (!item.itemType || item.itemType === 'product') {
        requiresShipping = true;
        break;
      }
    }
    
    const shipping = requiresShipping ? ((subtotal - discount) > 1000 ? 0 : ((subtotal - discount) > 0 ? 99 : 0)) : 0;
    const tax = 0; // No tax applied for now

    const total = Math.max(0, subtotal - discount) + shipping + tax;

    // 4. Create Order
    const order = await tx.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        couponId,
        shippingAddressSnapshot: shippingAddress || {},
        billingAddressSnapshot: billingAddress || {},
        items: {
          create: orderItemsToCreate
        }
      },
      include: {
        items: true
      }
    });

    // 5. If user is logged in, clear their cart
    if (userId) {
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    return order;
  });
};

export const getOrderById = async (id: string, userId?: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payment: true }
  });

  if (!order) throw new NotFoundError('Order not found');
  
  if (userId && order.userId !== userId) {
      throw new BadRequestError('Not authorized to view this order');
  }

  return order;
};

export const getUserOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });
};

export const getAllOrders = async (query: any) => {
  return await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });
};
