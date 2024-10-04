import Express from 'express';
const router = Express.Router();

import isLogged from '../middlewares/auth';

import UserController from '../controllers/userController';

// LOGIN

router.get('/', UserController.index);
router.post('/create', UserController.create);
router.post('/registerUser', UserController.registerUser);

router.use(isLogged);

// PROTECTED ROUTES

router.get('/me', UserController.me);

export default router;
