import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as newsletterSubscriberService from '../services/newsletterSubscriberService';

export const getAllNewsletterSubscribers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await newsletterSubscriberService.getAllNewsletterSubscribers(req.query);
  sendSuccessResponse({ res, data });
});

export const getNewsletterSubscriber = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await newsletterSubscriberService.getNewsletterSubscriberById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const createNewsletterSubscriber = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await newsletterSubscriberService.createNewsletterSubscriber(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateNewsletterSubscriber = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await newsletterSubscriberService.updateNewsletterSubscriber(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteNewsletterSubscriber = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await newsletterSubscriberService.deleteNewsletterSubscriber(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
