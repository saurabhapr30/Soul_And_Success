import { Router } from 'express';
import * as couponController from '../controllers/couponController';

const router = Router();

router.post('/validate', couponController.validateCoupon);

router
  .route('/')
  .get(couponController.getAllCoupons)
  .post(couponController.createCoupon);

router
  .route('/:id')
  .get(couponController.getCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

export default router;
