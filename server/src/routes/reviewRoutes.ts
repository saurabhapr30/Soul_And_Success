import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(protect, reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(protect, reviewController.updateReview)
  .delete(protect, reviewController.deleteReview);

export default router;
