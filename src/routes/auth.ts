import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = express.Router();

import authController from '../controllers/authController';

router.get('/google', authController.google);
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    authController.google_callback
);
router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/verifyCode/:code', authController.verifyCode);

router.get('/activate', authController.activate);

export default router;
