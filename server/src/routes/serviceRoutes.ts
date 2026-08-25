import { Router } from 'express';
import * as serviceController from '../controllers/serviceController';

const router = Router();

router
  .route('/')
  .get(serviceController.getAllServices)
  .post(serviceController.createService);

router
  .route('/:id')
  .get(serviceController.getService)
  .put(serviceController.updateService)
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

export default router;
