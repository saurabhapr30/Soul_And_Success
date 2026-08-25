import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllUsers = async (query: any) => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: string) => {
  const data = await prisma.user.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('User not found');
  return data;
};

export const createUser = async (data: any) => {
  return await prisma.user.create({ data });
};

export const updateUser = async (id: string, data: any) => {
  return await prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({ where: { id } });
};
