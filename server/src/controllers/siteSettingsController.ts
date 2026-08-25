import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as siteSettingsService from '../services/siteSettingsService';

export const getAllSiteSettingss = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await siteSettingsService.getAllSiteSettingss(req.query);
  sendSuccessResponse({ res, data });
});

export const getSiteSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await siteSettingsService.getSiteSettingsById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const createSiteSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await siteSettingsService.createSiteSettings(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateSiteSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await siteSettingsService.updateSiteSettings(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteSiteSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await siteSettingsService.deleteSiteSettings(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
