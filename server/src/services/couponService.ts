import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const getAllCoupons = async (query: any) => {
  return await prisma.coupon.findMany();
};

export const validateCoupon = async (code: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) throw new NotFoundError('Invalid coupon code');

  if (!coupon.isActive) throw new BadRequestError('Coupon is inactive');

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) throw new BadRequestError('Coupon is not yet active');
  if (coupon.expiresAt && coupon.expiresAt < now) throw new BadRequestError('Coupon has expired');

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new BadRequestError('Coupon usage limit reached');
  }

  return coupon;
};

export const getCouponById = async (id: string) => {
  const data = await prisma.coupon.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('Coupon not found');
  return data;
};

export const createCoupon = async (data: any) => {
  return await prisma.coupon.create({ data });
};

export const updateCoupon = async (id: string, data: any) => {
  return await prisma.coupon.update({ where: { id }, data });
};

export const deleteCoupon = async (id: string) => {
  return await prisma.coupon.delete({ where: { id } });
};
