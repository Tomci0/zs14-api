import { NextFunction, Request, Response } from 'express';

import User, { IUser } from '../models/user.model';
import { isValidObjectId, ObjectId } from 'mongoose';

import AppError from '../utils/appError';
import Class from '../models/class.model';
import Codes from '../models/codes.model';

import bcrypt from 'bcrypt';
import AppResponse from '../utils/appResponse';

export default {
    index: (req: Request, res: Response) => {},
    me: (req: Request, res: Response) => {
        res.json(new AppResponse(200, 'User data', req.user));
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, userClass, isAdmin, isTeacher } = req.body;

        if (!name || !email || !userClass) {
            return res.json(new AppError('Missing required fields', 400));
        }

        if (!isValidObjectId(userClass)) {
            return res.json(new AppError('Invalid class id', 400));
        }

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validEmail.test(email)) {
            return res.json(new AppError('Invalid email', 400));
        }

        const isEmailTaken = await User.findOne({ email: email });
        if (isEmailTaken) {
            return res.json(new AppError('Email already taken', 400));
        }

        const isClassExists = await Class.findOne({ _id: userClass });
        if (!isClassExists) {
            return res.json(new AppError('Class does not exist', 400));
        }

        try {
            const user: IUser = new User({
                name: name,
                email: email,
                class: userClass,
                isAdmin: isAdmin,
                isTeacher: isTeacher,
                disabled: true,
            });

            await user.save();

            const token = await Codes.createCode(user._id as ObjectId, 'activate');

            // res.json({
            //     status: 'success',
            //     message: 'User created',
            //     user: user,
            //     token: token.code,
            // });
            res.json(new AppResponse(200, 'User created', { user, token: token.code }));
        } catch (error) {
            return next(new AppError('Error creating user', 500));
        }
    },

    registerUser: async (req: Request, res: Response, next: NextFunction) => {
        const { code, email, password } = req.body;

        if (!code || !email || !password) {
            return next(new AppError('Missing required fields', 400));
        }

        // if (password.length < 8) {
        //     return next(new AppError('Password too short', 400));
        // }

        const isCodeExist = await Codes.findOne({ code: code }).populate('user');

        if (!isCodeExist) {
            return next(new AppError('Wystąpił błąd. Spróbuj ponownie.', 400));
        }

        if (isCodeExist.isExpired()) {
            return next(new AppError('Wystąpił błąd. Spróbuj ponownie.', 400));
        }

        const user = isCodeExist.user as IUser;

        if (!user) {
            return next(new AppError('Wystąpił błąd. Spróbuj ponownie.', 400));
        }

        const isEmailTaken = await User.findOne({ email: email });

        if (isEmailTaken) {
            return next(new AppError('Adres E-Mail jest juz w uzyciu.', 400));
        }

        user.email = email;
        user.password = bcrypt.hashSync(password, 10);
        user.disabled = false;

        user.markModified('email');
        user.markModified('password');
        user.markModified('disabled');

        await user.save();

        await Codes.deleteOne({ code });

        // res.json({
        //     status: 'success',
        //     message: 'User registered',
        //     user: user,
        // });
        res.json(new AppResponse(200, 'User registered', user));
    },
};
