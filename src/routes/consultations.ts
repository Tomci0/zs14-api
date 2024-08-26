import Express from 'express';
const router = Express.Router();

import consultationsController from '../controllers/consultationsController';

router.get('/', consultationsController.index);

router.get('/get', consultationsController.get);

export default router;
