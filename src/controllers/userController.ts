import { NextFunction, Request, Response } from 'express';

import User, { IUser } from '../models/user.model';
import { isValidObjectId, ObjectId } from 'mongoose';

import AppError from '../utils/appError';
import Class from '../models/class.model';
import Codes from '../models/codes.model';

export default {
    index: (req: Request, res: Response) => {},
    me: (req: Request, res: Response) => {
        res.json({
            status: 'success',
            message: 'Welcome to the profile page',
            isLogged: true,
            user: req.user,
        });
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, userClass, isAdmin, isTeacher } = req.body;

        if (!name || !email || !userClass) {
            return next(new AppError('Missing required fields', 400));
        }

        if (!isValidObjectId(userClass)) {
            return next(new AppError('Invalid class id', 400));
        }

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validEmail.test(email)) {
            return next(new AppError('Invalid email', 400));
        }

        const isEmailTaken = await User.findOne({ email: email });
        if (isEmailTaken) {
            return next(new AppError('Email already taken', 400));
        }

        const isClassExists = await Class.findOne({ _id: userClass });
        if (!isClassExists) {
            return next(new AppError('Class does not exist', 400));
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

            // Create new token for user to activate account

            // Codes.createCode(user._id, 'activate');

            const token = await Codes.createCode(user._id as ObjectId, 'activate');

            res.json({
                status: 'success',
                message: 'User created',
                user: user,
            });
        } catch (error) {
            console.log(error);
            return next(new AppError('Error creating user', 500));
        }
    },
};
