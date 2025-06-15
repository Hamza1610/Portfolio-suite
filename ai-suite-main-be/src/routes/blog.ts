import express from 'express';
import {
  listBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  generateAIBlogContent,
  refineAIBlogContent,
  generateAIMetaTags
} from '../controllers/blogController';

const router = express.Router();

// Regular blog routes
router.get('/', listBlogPosts);
router.get('/:id', getBlogPostById);
router.post('/', createBlogPost);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);

// AI-powered blog routes
router.post('/ai/generate', generateAIBlogContent);
router.post('/ai/refine', refineAIBlogContent);
router.post('/ai/meta-tags', generateAIMetaTags);

export default router; 