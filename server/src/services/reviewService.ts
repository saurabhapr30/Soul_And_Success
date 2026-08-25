import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllReviews = async (query: any) => {
  return await prisma.review.findMany();
};

export const getReviewById = async (id: string) => {
  const data = await prisma.review.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('Review not found');
  return data;
};

export const createReview = async (data: any) => {
  return await prisma.review.create({ data });
};

export const updateReview = async (id: string, data: any) => {
  return await prisma.review.update({ where: { id }, data });
};

export const deleteReview = async (id: string) => {
  return await prisma.review.delete({ where: { id } });
};
