import Express from 'express';
const router = Express.Router();

import jwtAuth from '../middlewares/auth';

import UserController from '../controllers/userController';

// LOGIN

router.get('/', UserController.index);
router.post('/create', UserController.create);

router.use(jwtAuth);

// PROTECTED ROUTES

router.get('/me', UserController.me);

export default router;
