import { Router } from 'express';
import * as testimonialController from '../controllers/testimonialController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router
  .route('/')
  .get(testimonialController.getAllTestimonials)
  .post(protect, restrictTo('ADMIN'), testimonialController.createTestimonial);

router
  .route('/:id')
  .get(testimonialController.getTestimonial)
  .put(protect, restrictTo('ADMIN'), testimonialController.updateTestimonial)
  .patch(protect, restrictTo('ADMIN'), testimonialController.updateTestimonial)
  .delete(protect, restrictTo('ADMIN'), testimonialController.deleteTestimonial);

export default router;
