import Express from 'express';
const router = Express.Router();

import isLogged from '../middlewares/auth';
import getUser from '../middlewares/user';

import consultationsController from '../controllers/consultationsController';

router.get('/', consultationsController.index);

router.use(getUser);

router.get('/get', consultationsController.get);

router.use(isLogged);

router.post('/sign', consultationsController.sign);
router.post('/unsign', consultationsController.unsign);
router.get('/signed', consultationsController.signed);

export default router;
