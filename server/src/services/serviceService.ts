import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllServices = async (query: any) => {
  return await prisma.service.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getServiceById = async (id: string) => {
  const data = await prisma.service.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('Service not found');
  return data;
};

export const createService = async (data: any) => {
  const { slug, title, ...rest } = data;
  const generatedSlug = slug || (title || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
  return await prisma.service.create({
    data: {
      title,
      slug: generatedSlug,
      ...rest,
    },
  });
};

export const updateService = async (id: string, data: any) => {
  return await prisma.service.update({ where: { id }, data });
};

export const deleteService = async (id: string) => {
  return await prisma.service.delete({ where: { id } });
};
