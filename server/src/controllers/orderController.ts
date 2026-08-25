import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as orderService from '../services/orderService';

export const getAllOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await orderService.getAllOrders(req.query);
  sendSuccessResponse({ res, data });
});

export const getOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.role === 'ADMIN' ? undefined : (req as any).user?.id;
  const data = await orderService.getOrderById(req.params.id, userId);
  sendSuccessResponse({ res, data });
});

export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id || null;
  const data = await orderService.createOrder(userId, req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const getUserOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.id;
  const data = await orderService.getUserOrders(userId);
  sendSuccessResponse({ res, data });
});
