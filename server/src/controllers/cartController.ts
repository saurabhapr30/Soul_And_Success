import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as cartService from '../services/cartService';

export const getCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;
  const data = await cartService.getCart(userId);
  sendSuccessResponse({ res, data });
});

export const addItemToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;
  const data = await cartService.addItemToCart(userId, req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateCartItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const data = await cartService.updateCartItem(id, quantity);
  sendSuccessResponse({ res, data });
});

export const removeCartItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await cartService.removeCartItem(id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});

export const clearCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;
  await cartService.clearCart(userId);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});

export const mergeCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;
  const { items } = req.body;
  const data = await cartService.mergeCart(userId, items || []);
  sendSuccessResponse({ res, data });
});
