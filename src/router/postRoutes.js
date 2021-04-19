import { Router } from 'express';
import { PostController } from '../controller/index';
import Authentication from '../middleware/auth';

const router = Router();

const {
  createNewPost,
  updatePost,
  getPost,
  removePost
} = PostController;

const { authenticate } = Authentication;

router.patch('/add_new_post', authenticate, createNewPost);
router.get('/:postId', authenticate, getPost);
router.patch('/update_post/:postId', authenticate, updatePost);
router.delete('/delete_post/:postId', authenticate, removePost);

export default router;
