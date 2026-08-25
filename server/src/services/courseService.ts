import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllCourses = async (query: any) => {
  return await prisma.course.findMany({
    include: {
      category: true,
      _count: { select: { enrollments: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getCourseById = async (id: string) => {
  const data = await prisma.course.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('Course not found');
  return data;
};

export const getCourseBySlug = async (slug: string) => {
  const data = await prisma.course.findUnique({ where: { slug } });
  if (!data) throw new NotFoundError('Course not found');
  return data;
};

export const createCourse = async (data: any) => {
  const { id: _id, createdAt, updatedAt, category, modules, enrollments, ...safe } = data;
  if (safe.title && !safe.slug) {
    safe.slug = safe.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }
  if (Array.isArray(safe.images)) {
    if (!safe.thumbnail && safe.images.length > 0) {
      safe.thumbnail = safe.images[0];
    }
  } else if (safe.thumbnail) {
    safe.images = [safe.thumbnail];
  }
  return await prisma.course.create({ data: safe });
};

export const updateCourse = async (id: string, data: any) => {
  const { id: _id, createdAt, updatedAt, category, modules, enrollments, ...safe } = data;
  if (Array.isArray(safe.images)) {
    if (safe.images.length > 0) {
      safe.thumbnail = safe.images[0];
    } else {
      safe.thumbnail = null;
    }
  } else if (safe.thumbnail) {
    safe.images = [safe.thumbnail];
  }
  return await prisma.course.update({ where: { id }, data: safe });
};

export const deleteCourse = async (id: string) => {
  return await prisma.course.delete({ where: { id } });
};

export const getCourseEnrollments = async (id: string) => {
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { courseId: id },
    include: { 
      user: {
        include: { addresses: true }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  });
  return enrollments;
};
