import Express from 'express';
const router = Express.Router();

import isLogged from '../middlewares/auth';
import getUser from '../middlewares/user';

import consultationsController from '../controllers/consultationsController';

router.get('/', consultationsController.index);

// router.use(getUser);

router.get('/get', getUser, consultationsController.get);

// router.use(isLogged);

router.post('/sign', getUser, isLogged, consultationsController.sign);
router.post('/unsign', getUser, isLogged, consultationsController.unsign);
router.get('/signed', getUser, isLogged, consultationsController.signed);

export default router;
