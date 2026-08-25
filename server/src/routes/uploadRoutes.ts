import { Router, Request, Response, NextFunction } from 'express';
import { uploadImage, fileUploadService } from '../services/fileUploadService';
import { imageOptimizationService } from '../services/imageOptimizationService';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import { BadRequestError } from '../utils/errors';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

// Endpoint for admin to upload an image
// We expect a form-data field named 'image'
router.post(
  '/image',
  protect,
  restrictTo('ADMIN'),
  uploadImage.single('image'),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const file = (req as any).file;
    if (!file) {
      return next(new BadRequestError('Please upload an image file.'));
    }

    const fileUrl = fileUploadService.getFileUrl(req, file.filename);

    // Automatically optimize uploaded image and generate responsive variants
    const optimizationResult = await imageOptimizationService.optimizeUploadedImage(
      file.path,
      file.filename
    );

    sendSuccessResponse({
      res,
      statusCode: 201,
      data: {
        url: fileUrl,
        filename: file.filename,
        optimizedUrl: optimizationResult.optimizedUrl,
        srcSet: optimizationResult.srcSet,
        variants: optimizationResult.variants,
        width: optimizationResult.width,
        height: optimizationResult.height,
      },
    });
  })
);

export default router;
