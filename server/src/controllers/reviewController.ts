import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as reviewService from '../services/reviewService';

export const getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await reviewService.getAllReviews(req.query);
  sendSuccessResponse({ res, data });
});

export const getReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await reviewService.getReviewById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  req.body.userId = (req as any).user.id;
  const data = await reviewService.createReview(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await reviewService.updateReview(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await reviewService.deleteReview(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
