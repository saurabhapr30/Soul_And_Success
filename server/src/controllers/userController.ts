import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as userService from '../services/userService';

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await userService.getAllUsers(req.query);
  sendSuccessResponse({ res, data });
});

export const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await userService.getUserById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await userService.createUser(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await userService.updateUser(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await userService.deleteUser(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
