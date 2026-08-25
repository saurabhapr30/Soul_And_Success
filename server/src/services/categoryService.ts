import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllCategorys = async (query: any) => {
  return await prisma.category.findMany();
};

export const getCategoryById = async (id: string) => {
  const data = await prisma.category.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('Category not found');
  return data;
};

export const createCategory = async (data: any) => {
  return await prisma.category.create({ data });
};

export const updateCategory = async (id: string, data: any) => {
  return await prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id: string) => {
  return await prisma.category.delete({ where: { id } });
};
