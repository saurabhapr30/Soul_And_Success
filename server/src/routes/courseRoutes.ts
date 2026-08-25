import { Router } from 'express';
import * as courseController from '../controllers/courseController';

const router = Router();

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);

router
  .route('/slug/:slug')
  .get(courseController.getCourseBySlug);

router
  .route('/:id')
  .get(courseController.getCourse)
  .put(courseController.updateCourse)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);
router
  .route('/:id/enrollments')
  .get(courseController.getCourseEnrollments);

export default router;
