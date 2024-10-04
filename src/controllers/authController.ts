import express, { Router, Request, Response, NextFunction } from 'express';
import ExtendRequest from '../types/Request';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import AppResponse from '../utils/appResponse';
import AppError from '../utils/appError';

import Registration, { IRegistration } from '../models/registration.model';
import Codes, { ICodes } from '../models/codes.model';

export default {
    logout: (req: Request, res: Response, next: NextFunction) => {
        req.logout(function (err) {
            if (err) return next(err);
            res.clearCookie('jwtToken');
            return res.json(new AppResponse(200, 'Pomyślnie zostałeś wylogowany.'));
        });
    },

    google: passport.authenticate('google', { scope: ['profile', 'email'] }),

    google_callback: (req: Request, res: Response, next: NextFunction) => {
        const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET || '', { expiresIn: '30d' });
        res.cookie('jwtToken', token, { httpOnly: true, secure: false });
        res.redirect('http://localhost:3000');
    },

    login: (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (err: Error, user: IUser, options: any) => {
            if (err) {
                return next(err);
            }

            if (user) {
                const token = jwt.sign({ user }, process.env.JWT_SECRET || '', { expiresIn: '30d' });
                res.cookie('jwtToken', token, { httpOnly: true, secure: false });
                return res.json(new AppResponse(401, 'Successfully logged in', user));
            }
        })(req, res);
    },

    activate: async (req: Request, res: Response) => {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ status: 'error', message: 'Token not provided' });
        }

        res.json({ status: 'success', message: 'User activated', token });
    },

    verifyCode: async (req: Request, res: Response, next: NextFunction) => {
        const { code } = req.params;

        if (code.length !== 6) {
            return next(new AppError('Podałeś niepoprawny kod.', 400));
        }

        const result = await Codes.findOne({ code }).populate('user');

        if (!result) {
            return next(new AppError('Podałeś niepoprawny kod.', 400));
        }

        if (result.type !== 'activate') {
            return next(new AppError('Podałeś niepoprawny kod.', 400));
        }

        if (result.isExpired()) {
            return next(new AppError('Ten kod wysasł. Zgłoś się do wychowawcy po nowy kod.', 400));
        }

        return res.json(new AppResponse(200, 'Registration found', result));
    },
};
