import Express from 'express';
const router = Express.Router();

import isLogged from '../middlewares/auth';

import UserController from '../controllers/userController';
import getUser from '../middlewares/user';

// LOGIN

router.get('/', UserController.index);
router.post('/create', UserController.create);
router.post('/registerUser', UserController.registerUser);

// router.use(isLogged);

// PROTECTED ROUTES

router.get('/all', isLogged, UserController.usersAll);
router.get('/count', UserController.usersCount);
router.get('/me', getUser, UserController.me);

export default router;
