import { Router } from 'express';
import * as orderController from '../controllers/orderController';

const router = Router();

router
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder);

export default router;
