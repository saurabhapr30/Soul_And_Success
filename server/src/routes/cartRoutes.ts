import { Router } from 'express';
import * as cartController from '../controllers/cartController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect); // All cart routes require auth

router
  .route('/')
  .get(cartController.getCart)
  .post(cartController.addItemToCart)
  .delete(cartController.clearCart);

router.post('/merge', cartController.mergeCart);

router
  .route('/:id')
  .patch(cartController.updateCartItem)
  .delete(cartController.removeCartItem);

export default router;
