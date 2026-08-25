import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';

const router = Router();

router
  .route('/')
  .get(categoryController.getAllCategorys)
  .post(categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default router;
