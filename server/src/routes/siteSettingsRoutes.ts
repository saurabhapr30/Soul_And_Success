import { Router } from 'express';
import * as siteSettingsController from '../controllers/siteSettingsController';

const router = Router();

router
  .route('/')
  .get(siteSettingsController.getAllSiteSettingss)
  .post(siteSettingsController.createSiteSettings);

router
  .route('/:id')
  .get(siteSettingsController.getSiteSettings)
  .patch(siteSettingsController.updateSiteSettings)
  .delete(siteSettingsController.deleteSiteSettings);

export default router;
