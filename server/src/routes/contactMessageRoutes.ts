import { Router } from 'express';
import * as contactMessageController from '../controllers/contactMessageController';

const router = Router();

router
  .route('/')
  .get(contactMessageController.getAllContactMessages)
  .post(contactMessageController.createContactMessage);

router
  .route('/:id')
  .get(contactMessageController.getContactMessage)
  .patch(contactMessageController.updateContactMessage)
  .delete(contactMessageController.deleteContactMessage);

export default router;
