import Express from 'express';
const router = Express.Router();

import dataController from '../controllers/dataController';
import isLogged from '../middlewares/auth';

router.get('/', dataController.index);

router.get('/subjects', isLogged, dataController.getSubjects);

export default router;
