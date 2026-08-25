import { Router } from 'express';
import * as blogPostController from '../controllers/blogPostController';

const router = Router();

router
  .route('/')
  .get(blogPostController.getAllBlogPosts)
  .post(blogPostController.createBlogPost);

router
  .route('/categories')
  .get(blogPostController.getAllBlogCategories);

router
  .route('/slug/:slug')
  .get(blogPostController.getBlogPostBySlug);

router
  .route('/:id')
  .get(blogPostController.getBlogPost)
  .put(blogPostController.updateBlogPost)
  .patch(blogPostController.updateBlogPost)
  .delete(blogPostController.deleteBlogPost);

export default router;
