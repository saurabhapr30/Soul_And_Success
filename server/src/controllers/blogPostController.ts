import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as blogPostService from '../services/blogPostService';

export const getAllBlogPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await blogPostService.getAllBlogPosts(req.query);
  sendSuccessResponse({ res, data });
});

export const getBlogPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await blogPostService.getBlogPostById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const getBlogPostBySlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await blogPostService.getBlogPostBySlug(req.params.slug);
  sendSuccessResponse({ res, data });
});

export const getAllBlogCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await blogPostService.getAllBlogCategories();
  sendSuccessResponse({ res, data });
});

export const createBlogPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await blogPostService.createBlogPost(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateBlogPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await blogPostService.updateBlogPost(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteBlogPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await blogPostService.deleteBlogPost(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
