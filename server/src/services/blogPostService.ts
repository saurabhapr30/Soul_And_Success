import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllBlogPosts = async (query: any) => {
  return await prisma.blogPost.findMany({
    include: {
      category: true,
      author: true,
      tags: true
    }
  });
};

export const getBlogPostById = async (id: string) => {
  const data = await prisma.blogPost.findUnique({ 
    where: { id },
    include: {
      category: true,
      author: true,
      tags: true
    }
  });
  if (!data) throw new NotFoundError('BlogPost not found');
  return data;
};

export const getBlogPostBySlug = async (slug: string) => {
  const data = await prisma.blogPost.findUnique({ 
    where: { slug },
    include: {
      category: true,
      author: true,
      tags: true
    }
  });
  if (!data) throw new NotFoundError('BlogPost not found');
  return data;
};

const DEFAULT_BLOG_CATEGORIES = [
  { name: 'Relationships', slug: 'relationships' },
  { name: 'The Inner Work', slug: 'the-inner-work' },
  { name: 'Attraction', slug: 'attraction' },
  { name: 'Communication', slug: 'communication' },
  { name: 'Dating', slug: 'dating' },
  { name: 'Feminine Energy', slug: 'feminine-energy' },
  { name: 'Intimacy', slug: 'intimacy' },
  { name: 'Masculine Energy', slug: 'masculine-energy' },
];

export const getAllBlogCategories = async () => {
  for (const cat of DEFAULT_BLOG_CATEGORIES) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
  }
  return await prisma.blogCategory.findMany({
    orderBy: { name: 'asc' },
  });
};

const resolveCategoryId = async (categoryId?: string): Promise<string> => {
  if (categoryId) {
    const existing = await prisma.blogCategory.findFirst({
      where: {
        OR: [
          { id: categoryId },
          { name: { equals: categoryId, mode: 'insensitive' } },
          { slug: categoryId.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        ],
      },
    });
    if (existing) return existing.id;

    const created = await prisma.blogCategory.create({
      data: {
        name: categoryId,
        slug: categoryId.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      },
    });
    return created.id;
  }

  const defaultCat = await prisma.blogCategory.findFirst({
    where: { slug: 'relationships' },
  });
  if (defaultCat) return defaultCat.id;

  const firstCat = await prisma.blogCategory.findFirst();
  if (firstCat) return firstCat.id;

  const newCat = await prisma.blogCategory.create({
    data: { name: 'Relationships', slug: 'relationships' },
  });
  return newCat.id;
};

export const createBlogPost = async (data: any) => {
  let { categoryId, authorId, tags, ...rest } = data;
  
  categoryId = await resolveCategoryId(categoryId);
  
  if (!authorId) {
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (adminUser) {
       authorId = adminUser.id;
    } else {
       const firstUser = await prisma.user.findFirst();
       authorId = firstUser?.id;
    }
  }

  if (!rest.slug && rest.title) {
    rest.slug = rest.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }

  const tagsInput = tags && tags.length > 0 ? {
    connectOrCreate: tags.map((t: any) => {
      const name = typeof t === 'string' ? t : t.name;
      return {
        where: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      };
    })
  } : undefined;

  const { seoTitle, seoDescription, seoKeywords, canonicalUrl, galleryImages, ...coreData } = rest;
  const postData = {
    ...coreData,
    categoryId,
    authorId,
    ...(tagsInput && { tags: tagsInput }),
    ...(seoTitle !== undefined && { seoTitle }),
    ...(seoDescription !== undefined && { seoDescription }),
    ...(seoKeywords !== undefined && { seoKeywords }),
    ...(canonicalUrl !== undefined && { canonicalUrl }),
    ...(galleryImages !== undefined && { galleryImages }),
  };

  return await prisma.blogPost.create({ 
    data: postData,
    include: {
      category: true,
      author: true,
      tags: true,
    },
  });
};

export const updateBlogPost = async (id: string, data: any) => {
  let { seoTitle, seoDescription, seoKeywords, canonicalUrl, galleryImages, tags, categoryId, ...rest } = data;
  
  if (categoryId !== undefined) {
    categoryId = await resolveCategoryId(categoryId);
  }

  const tagsInput = tags ? {
    set: [], // Clear existing relations
    connectOrCreate: tags.map((t: any) => {
      const name = typeof t === 'string' ? t : t.name;
      return {
        where: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      };
    })
  } : undefined;

  const updateData = {
    ...rest,
    ...(categoryId && { categoryId }),
    ...(tagsInput && { tags: tagsInput }),
    ...(seoTitle !== undefined && { seoTitle }),
    ...(seoDescription !== undefined && { seoDescription }),
    ...(seoKeywords !== undefined && { seoKeywords }),
    ...(canonicalUrl !== undefined && { canonicalUrl }),
    ...(galleryImages !== undefined && { galleryImages }),
  };
  return await prisma.blogPost.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      author: true,
      tags: true,
    },
  });
};

export const deleteBlogPost = async (id: string) => {
  return await prisma.blogPost.delete({ where: { id } });
};
