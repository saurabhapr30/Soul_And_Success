import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as contactMessageService from '../services/contactMessageService';

export const getAllContactMessages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await contactMessageService.getAllContactMessages(req.query);
  sendSuccessResponse({ res, data });
});

export const getContactMessage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await contactMessageService.getContactMessageById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const createContactMessage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await contactMessageService.createContactMessage(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateContactMessage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await contactMessageService.updateContactMessage(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteContactMessage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await contactMessageService.deleteContactMessage(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
