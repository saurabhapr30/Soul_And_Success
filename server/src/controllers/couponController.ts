import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as couponService from '../services/couponService';

export const getAllCoupons = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await couponService.getAllCoupons(req.query);
  sendSuccessResponse({ res, data });
});

export const validateCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.body;
  const data = await couponService.validateCoupon(code);
  sendSuccessResponse({ res, data });
});

export const getCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await couponService.getCouponById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const createCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await couponService.createCoupon(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await couponService.updateCoupon(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await couponService.deleteCoupon(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
