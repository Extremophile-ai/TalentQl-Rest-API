import { Router } from 'express';
import { UserController } from '../controller/index';

const router = Router();

const {
  createUser,
  login,
} = UserController;

router.post('/signup', createUser);
router.post('/login', login);

export default router;
