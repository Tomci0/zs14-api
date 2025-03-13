import { Request, Response } from 'express';
import Subject from '../models/subject.model';
import AppResponse from '../utils/appResponse';
import AppError from '../utils/appError';

export default {
    index: function (req: Request, res: Response) {
        return res.json({
            status: 'success',
        });
    },

    getSubjects: async function (req: Request, res: Response) {
        try {
            const subjects = await Subject.find();

            console.log(subjects);

            return res.json(new AppResponse(200, 'Successfily getting subjects', subjects));
        } catch (e) {
            console.error(e);
            return res.json(new AppError('Wystapil blad', 500));
        }
    },
};
