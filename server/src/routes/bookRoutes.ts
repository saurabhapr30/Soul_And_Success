import { Router } from 'express';
import * as bookController from '../controllers/bookController';

const router = Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.createBook);

router
  .route('/slug/:slug')
  .get(bookController.getBookBySlug);

router
  .route('/:id')
  .get(bookController.getBook)
  .put(bookController.updateBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);
router
  .route('/:id/orders')
  .get(bookController.getBookOrders);

export default router;

