import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as bookService from '../services/bookService';

export const getAllBooks = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await bookService.getAllBooks(req.query);
  sendSuccessResponse({ res, data });
});

export const getBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await bookService.getBookById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const getBookBySlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await bookService.getBookBySlug(req.params.slug);
  sendSuccessResponse({ res, data });
});

export const createBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await bookService.createBook(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await bookService.updateBook(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteBook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await bookService.deleteBook(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});

export const getBookOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await bookService.getBookOrders(req.params.id);
  sendSuccessResponse({ res, data });
});

