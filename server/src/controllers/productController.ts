import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as productService from '../services/productService';

export const getAllProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.getAllProducts(req.query);
  sendSuccessResponse({ res, data });
});

export const getProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.getProductById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const getProductBySlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.getProductBySlug(req.params.slug);
  sendSuccessResponse({ res, data });
});

export const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.createProduct(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.updateProduct(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await productService.deleteProduct(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});

export const getProductOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.getProductOrders(req.params.id);
  sendSuccessResponse({ res, data });
});
