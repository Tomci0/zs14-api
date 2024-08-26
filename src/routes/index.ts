import Express from 'express';
const router = Express.Router();

import indexController from '../controllers/indexController';

router.get('/', indexController);

export default router;
