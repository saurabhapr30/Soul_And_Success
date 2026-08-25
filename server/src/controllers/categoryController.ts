import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as categoryService from '../services/categoryService';

export const getAllCategorys = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await categoryService.getAllCategorys(req.query);
  sendSuccessResponse({ res, data });
});

export const getCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await categoryService.getCategoryById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await categoryService.createCategory(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await categoryService.updateCategory(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await categoryService.deleteCategory(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
