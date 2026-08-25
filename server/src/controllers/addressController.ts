import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as addressService from '../services/addressService';

export const getAllAddresss = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await addressService.getAllAddresss(req.query);
  sendSuccessResponse({ res, data });
});

export const getAddress = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await addressService.getAddressById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const createAddress = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await addressService.createAddress(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateAddress = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await addressService.updateAddress(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteAddress = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await addressService.deleteAddress(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
