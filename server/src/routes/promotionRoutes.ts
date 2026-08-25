import { Router } from 'express';
import * as promotionController from '../controllers/promotionController';

const router = Router();

router.get('/active', promotionController.getActivePromotions);

router
  .route('/')
  .get(promotionController.getAllPromotions)
  .post(promotionController.createPromotion);

router
  .route('/:id')
  .get(promotionController.getPromotion)
  .patch(promotionController.updatePromotion)
  .delete(promotionController.deletePromotion);

export default router;
