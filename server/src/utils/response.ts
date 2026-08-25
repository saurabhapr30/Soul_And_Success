import { Response } from 'express';

interface SuccessResponseParams<T> {
  res: Response;
  data?: T;
  message?: string;
  statusCode?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const sendSuccessResponse = <T>({
  res,
  data,
  message = 'Success',
  statusCode = 200,
  pagination,
}: SuccessResponseParams<T>) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(pagination && { pagination }),
  });
};
