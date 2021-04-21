import { Router } from 'express';
import { UserController } from '../controller/index';
import Authentication from '../middleware/auth';

const router = Router();
const { authenticate } = Authentication;

const {
  createUser,
  login,
  updateProfile,
  postFeeds,
  viewPost
} = UserController;

router.post('/signup', createUser);
router.post('/login', login);
router.patch('/profile/update', authenticate, updateProfile);
router.get('/post/feeds', authenticate, postFeeds);
router.get('/post/:postId', authenticate, viewPost);

export default router;
