import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllPromotions = async (query: any) => {
  return await prisma.promotion.findMany();
};

export const getActivePromotions = async () => {
  const now = new Date();
  return await prisma.promotion.findMany({
    where: {
      isActive: true,
      startsAt: { lte: now },
      endsAt: { gte: now }
    }
  });
};

export const getPromotionById = async (id: string) => {
  const data = await prisma.promotion.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('Promotion not found');
  return data;
};

export const createPromotion = async (data: any) => {
  return await prisma.promotion.create({ data });
};

export const updatePromotion = async (id: string, data: any) => {
  return await prisma.promotion.update({ where: { id }, data });
};

export const deletePromotion = async (id: string) => {
  return await prisma.promotion.delete({ where: { id } });
};
