import { Router } from 'express';
import * as newsletterSubscriberController from '../controllers/newsletterSubscriberController';

const router = Router();

router
  .route('/')
  .get(newsletterSubscriberController.getAllNewsletterSubscribers)
  .post(newsletterSubscriberController.createNewsletterSubscriber);

router
  .route('/:id')
  .get(newsletterSubscriberController.getNewsletterSubscriber)
  .patch(newsletterSubscriberController.updateNewsletterSubscriber)
  .delete(newsletterSubscriberController.deleteNewsletterSubscriber);

export default router;
