import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAllSiteSettingss = async (query: any) => {
  return await prisma.siteSettings.findMany();
};

export const getSiteSettingsById = async (id: string) => {
  const data = await prisma.siteSettings.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('SiteSettings not found');
  return data;
};

export const createSiteSettings = async (data: any) => {
  return await prisma.siteSettings.create({ data });
};

export const updateSiteSettings = async (id: string, data: any) => {
  return await prisma.siteSettings.update({ where: { id }, data });
};

export const deleteSiteSettings = async (id: string) => {
  return await prisma.siteSettings.delete({ where: { id } });
};
