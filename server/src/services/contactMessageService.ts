import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllContactMessages = async (query: any) => {
  return await prisma.contactMessage.findMany();
};

export const getContactMessageById = async (id: string) => {
  const data = await prisma.contactMessage.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('ContactMessage not found');
  return data;
};

export const createContactMessage = async (data: any) => {
  return await prisma.contactMessage.create({ data });
};

export const updateContactMessage = async (id: string, data: any) => {
  return await prisma.contactMessage.update({ where: { id }, data });
};

export const deleteContactMessage = async (id: string) => {
  return await prisma.contactMessage.delete({ where: { id } });
};
