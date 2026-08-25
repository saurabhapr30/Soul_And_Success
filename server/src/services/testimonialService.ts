import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllTestimonials = async (query: any) => {
  return await prisma.testimonial.findMany();
};

export const getTestimonialById = async (id: string) => {
  const data = await prisma.testimonial.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('Testimonial not found');
  return data;
};

export const createTestimonial = async (data: any) => {
  return await prisma.testimonial.create({ data });
};

export const updateTestimonial = async (id: string, data: any) => {
  return await prisma.testimonial.update({ where: { id }, data });
};

export const deleteTestimonial = async (id: string) => {
  return await prisma.testimonial.delete({ where: { id } });
};
