import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as courseService from '../services/courseService';

export const getAllCourses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await courseService.getAllCourses(req.query);
  sendSuccessResponse({ res, data });
});

export const getCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await courseService.getCourseById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const getCourseBySlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await courseService.getCourseBySlug(req.params.slug);
  sendSuccessResponse({ res, data });
});

export const createCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await courseService.createCourse(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const updateCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await courseService.updateCourse(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const deleteCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await courseService.deleteCourse(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});

export const getCourseEnrollments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await courseService.getCourseEnrollments(req.params.id);
  sendSuccessResponse({ res, data });
});
