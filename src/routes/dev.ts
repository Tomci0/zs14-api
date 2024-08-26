import express, { Request, Response } from 'express';
const router = express.Router();

import devController from '../controllers/devController';

router.get('/', devController.index);

router.get('/setup', devController.setup);

export default router;
