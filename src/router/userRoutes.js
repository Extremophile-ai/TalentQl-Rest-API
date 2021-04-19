import { Router } from 'express';
import { UserController } from '../controller/index';
// import Authentication from '../middleware/auth';

const router = Router();

const {
  createUser,
  login,
} = UserController;

// const { authenticate } = Authentication;

router.post('/signup', createUser);
router.post('/login', login);
// router.get('/users', getUsers);
// router.get('/user', authenticate, getUser);

export default router;
