import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as promotionService from '../services/promotionService';

export const getAllPromotions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await promotionService.getAllPromotions(req.query);
  sendSuccessResponse({ res, data });
});

export const getActivePromotions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await promotionService.getActivePromotions();
  sendSuccessResponse({ res, data });
});

export const getPromotion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await promotionService.getPromotionById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const createPromotion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await promotionService.createPromotion(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updatePromotion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await promotionService.updatePromotion(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deletePromotion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await promotionService.deletePromotion(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
