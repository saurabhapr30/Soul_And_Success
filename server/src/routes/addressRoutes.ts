import { Router } from 'express';
import * as addressController from '../controllers/addressController';

const router = Router();

router
  .route('/')
  .get(addressController.getAllAddresss)
  .post(addressController.createAddress);

router
  .route('/:id')
  .get(addressController.getAddress)
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

export default router;
