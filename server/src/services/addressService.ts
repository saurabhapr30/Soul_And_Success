import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllAddresss = async (query: any) => {
  return await prisma.address.findMany();
};

export const getAddressById = async (id: string) => {
  const data = await prisma.address.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('Address not found');
  return data;
};

export const createAddress = async (data: any) => {
  return await prisma.address.create({ data });
};

export const updateAddress = async (id: string, data: any) => {
  return await prisma.address.update({ where: { id }, data });
};

export const deleteAddress = async (id: string) => {
  return await prisma.address.delete({ where: { id } });
};
