import express, { Router, Request, Response, NextFunction } from 'express';
import ExtendRequest from '../types/Request';
import passport from 'passport';
import jwt from 'jsonwebtoken';

export default {
    logout: (req: Request, res: Response, next: NextFunction) => {
        req.logout(function (err) {
            if (err) return next(err);
            res.clearCookie('jwtToken');
            res.redirect('http://localhost:3000');
        });
    },

    google: passport.authenticate('google', { scope: ['profile', 'email'] }),

    google_callback: (req: Request, res: Response, next: NextFunction) => {
        const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET || '', { expiresIn: '30d' });
        res.cookie('jwtToken', token, { httpOnly: true, secure: false });
        res.redirect('http://localhost:3000');
    },

    activate: (req: Request, res: Response) => {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ status: 'error', message: 'Token not provided' });
        }

        res.json({ status: 'success', message: 'User activated', token });
    },
};
