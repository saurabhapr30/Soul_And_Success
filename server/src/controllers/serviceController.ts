import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as serviceService from '../services/serviceService';

export const getAllServices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await serviceService.getAllServices(req.query);
  sendSuccessResponse({ res, data });
});

export const getService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await serviceService.getServiceById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await serviceService.createService(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await serviceService.updateService(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await serviceService.deleteService(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
