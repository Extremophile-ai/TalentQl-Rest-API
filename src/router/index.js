import { Router } from 'express';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';

const router = new Router();

router.use('/user', userRoutes);
router.use('/posts', postRoutes);

export default router;
