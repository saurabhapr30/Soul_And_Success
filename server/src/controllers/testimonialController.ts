import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as testimonialService from '../services/testimonialService';

export const getAllTestimonials = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await testimonialService.getAllTestimonials(req.query);
  sendSuccessResponse({ res, data });
});

export const getTestimonial = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await testimonialService.getTestimonialById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const createTestimonial = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await testimonialService.createTestimonial(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateTestimonial = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await testimonialService.updateTestimonial(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteTestimonial = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await testimonialService.deleteTestimonial(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
