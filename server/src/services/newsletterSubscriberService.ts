import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllNewsletterSubscribers = async (query: any) => {
  return await prisma.newsletterSubscriber.findMany();
};

export const getNewsletterSubscriberById = async (id: string) => {
  const data = await prisma.newsletterSubscriber.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('NewsletterSubscriber not found');
  return data;
};

export const createNewsletterSubscriber = async (data: any) => {
  return await prisma.newsletterSubscriber.create({ data });
};

export const updateNewsletterSubscriber = async (id: string, data: any) => {
  return await prisma.newsletterSubscriber.update({ where: { id }, data });
};

export const deleteNewsletterSubscriber = async (id: string) => {
  return await prisma.newsletterSubscriber.delete({ where: { id } });
};
