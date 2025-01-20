import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = express.Router();

import indexController from '../controllers/radioController';

import isLogged from '../middlewares/auth';

router.get('/', indexController.index);

router.post('/add-song', isLogged, indexController.addSong);
router.get('/get-verifications', isLogged, indexController.getVerifications);
router.get('/get-queue', isLogged, indexController.getQueue);

export default router;
