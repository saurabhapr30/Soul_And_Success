import { Router } from 'express';
import * as productController from '../controllers/productController';

const router = Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route('/slug/:slug')
  .get(productController.getProductBySlug);

router
  .route('/:id')
  .get(productController.getProduct)
  .put(productController.updateProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);
router
  .route('/:id/orders')
  .get(productController.getProductOrders);

export default router;
