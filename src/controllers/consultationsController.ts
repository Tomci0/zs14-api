import { Request, Response, NextFunction, Router } from 'express';
const router = Router();

import { Query, Document, isValidObjectId, ObjectId } from 'mongoose';

import AppError from '../utils/appError';
import AppResponse from '../utils/appResponse';

import Consultation from '../models/consultation.model';
import APIFeatures from '../utils/appFeatures';

import { ETime } from '../types/enums';
import { IConsultationModel } from '../models/consultation.model';
import { IConsultation, IScope } from '../types/types';
import { ISubject } from '../models/subject.model';
import { IBuilding } from '../models/building.model';
import { IRoom } from '../models/room.model';
import { IScopeModel } from '../models/scope.model';

import { IUser } from '../types/types';
import Registration, { IRegistration } from '../models/registration.model';
import { sign } from 'crypto';
import path from 'path';

export default {
    async index(req: Request, res: Response) {
        res.json({
            status: 'success',
            path: '/api/v1/consultations/',
            endpoints: [
                {
                    method: 'GET',
                    url: '/api/v1/consultations/get',
                    description: 'Get consultations',
                    queries: [
                        {
                            name: 'id',
                            description: 'Consultation id',
                            type: 'ObjectId',
                        },
                        {
                            name: 'min_date',
                            description: 'Minimum date',
                            type: 'Date',
                        },
                        {
                            name: 'max_date',
                            description: 'Maximum date',
                            type: 'Date',
                        },
                        {
                            name: 'teacher',
                            description: 'Teacher id',
                            type: 'ObjectId',
                        },
                        {
                            name: 'subject',
                            description: 'Subject id',
                            type: 'ObjectId',
                        },
                        {
                            name: 'page',
                            description: 'Page number',
                            type: 'Number',
                        },
                        {
                            name: 'limit',
                            description: 'Number of results per page',
                            type: 'Number',
                        },
                        {
                            name: 'sort',
                            description: 'Sort results',
                            type: 'String',
                        },
                        {
                            name: 'fields',
                            description: 'Fields to return',
                            type: 'String',
                        },
                    ],
                },
            ],
        });
    },

    async get(req: Request, res: Response, next: NextFunction) {
        const { id, min_date, max_date, date, teacher, subject } = req.query;
        const user = req.user as IUser;

        if (min_date) {
            const date = new Date(min_date.toString());
            if (isNaN(date.getTime())) {
                return next(new AppError('Invalid date_min format', 400));
            }
        }

        if (max_date) {
            const date = new Date(max_date.toString());
            if (isNaN(date.getTime())) {
                return next(new AppError('Invalid date_max format', 400));
            }
        }

        if (date) {
            const check_date = new Date(date.toString());
            if (isNaN(check_date.getTime())) {
                return next(new AppError('Invalid date format', 400));
            }
        }

        if (id && !isValidObjectId(id.toString())) {
            return next(new AppError('Invalid id format', 400));
        }

        if (teacher && !isValidObjectId(teacher.toString())) {
            return next(new AppError('Invalid teacher format', 400));
        }

        if (subject && !isValidObjectId(subject.toString())) {
            return next(new AppError('Invalid subject format', 400));
        }

        let query = {};

        if (id) query = { ...query, _id: id };
        if (min_date || max_date) {
            let dateQuery = {};
            if (min_date) dateQuery = { ...dateQuery, $gte: min_date };
            if (max_date) dateQuery = { ...dateQuery, $lte: max_date };
            query = { ...query, date: dateQuery };
        }
        if (date) query = { ...query, date };
        if (teacher) query = { ...query, teacher };
        if (subject) query = { ...query, subject };

        try {
            const features = new APIFeatures(
                Consultation.find(query)
                    .populate('subject')
                    .populate('teacher')
                    .populate('building')
                    .populate('room')
                    .populate({
                        path: 'scopes', // Populacja dla 'scopes'
                        populate: {
                            path: 'type', // Populacja dla 'type' wewnątrz 'scopes'
                        },
                    }),
                req.query
            )
                .limitFields()
                .sort()
                .paginate();

            const consultations_data: IConsultationModel[] = await features.query;

            if (consultations_data.length > 0) {
                const consultations: any = await Promise.all(
                    consultations_data.map(async (consultation) => {
                        return {
                            _id: consultation._id,
                            date: consultation.date as Date,
                            time: consultation.time as number,
                            subject: (consultation.subject as ISubject).name as string,
                            teacher: {
                                _id: (consultation.teacher as IUser)._id,
                                name: (consultation.teacher as IUser).name,
                                image: (consultation.teacher as IUser).image,
                            },
                            building: (consultation?.building as IBuilding)?.name as string,
                            room: (consultation.room as IRoom).name as string,
                            color: consultation.color,
                            max_students: consultation.max_students,
                            students:
                                user && (user.isAdmin || user.isTeacher)
                                    ? await findSignedUsers(consultation._id, false)
                                    : await findSignedUsers(consultation._id, true),
                            isSigned:
                                user &&
                                !user.isAdmin &&
                                !user.isTeacher &&
                                (await isSigned(consultation._id, user._id as ObjectId)),
                            end_signing_up: consultation.end_signing_up,
                            description: consultation.description,
                            scopes: consultation.scopes,
                        };
                    })
                );

                return res.json(new AppResponse(200, 'Consultations found', consultations));
            }

            return res.json(new AppResponse(200, 'Consultations found', consultations_data));
        } catch (err) {
            console.error(err);
            return next(new AppError('Error with finding consultations', 500));
        }
    },

    async sign(req: Request, res: Response, next: NextFunction) {
        const { consultationId, reason, scope } = req.body;

        if (!consultationId) {
            return next(new AppError('Missing required fields', 400));
        }

        if (!isValidObjectId(consultationId)) {
            return next(new AppError('Invalid consultation id', 400));
        }

        if (reason !== 'other' && !isValidObjectId(scope)) {
            return next(new AppError('Invalid scope id', 400));
        }

        const consultation_data: IConsultationModel | null = await Consultation.findById(consultationId);

        if (!consultation_data) {
            return next(new AppError('Nie znaleziono takiej konsultacji.', 404));
        }

        const user = req.user as IUser;

        if (!user) {
            return next(new AppError('Nie jesteś zalogowany.', 404));
        }

        // if (consultation_data.students?.includes(user?._id)) {
        //     return next(new AppError('Jesteś juz zapisany.', 400));
        // }

        if (consultation_data.students?.length === consultation_data.max_students) {
            return next(new AppError('Brak miejsc.', 400));
        }

        try {
            const registration = new Registration({
                user: user._id,
                consultation: consultationId,
                date: new Date(),
                reason,
                scope,
            });

            await registration.save();

            return res.json(new AppResponse(200, 'Zapisano na konsultacje.', registration));
        } catch (err) {
            console.error(err);
            return next(new AppError('Error with signing up', 500));
        }
    },

    async unsign(req: Request, res: Response, next: NextFunction) {
        const { consultationId } = req.body;

        if (!consultationId) {
            return next(new AppError('Missing required fields', 400));
        }

        if (!isValidObjectId(consultationId)) {
            return next(new AppError('Invalid consultation id', 400));
        }

        const consultation_data: IConsultationModel | null = await Consultation.findById(consultationId);

        if (!consultation_data) {
            return next(new AppError('Nie znaleziono takiej konsultacji.', 404));
        }

        const user = req.user as IUser;

        if (!user) {
            return next(new AppError('Nie jesteś zalogowany.', 404));
        }

        try {
            const registration = await Registration.findOneAndDelete({ user: user._id, consultation: consultationId });

            if (!registration) {
                return next(new AppError('Nie jesteś zapisany na tę konsultację.', 404));
            }

            return res.json(new AppResponse(200, 'Wypisano z konsultacji.', registration));
        } catch (err) {
            console.error(err);
            return next(new AppError('Error with unsigning up', 500));
        }
    },

    async signed(req: Request, res: Response, next: NextFunction) {
        const user = req.user as IUser;
        try {
            const signedConsultations = await Registration.find({ user: user._id })
                .populate({
                    path: 'consultation', // Populacja dla 'scopes'
                    populate: [
                        {
                            path: 'subject',
                        },
                        {
                            path: 'teacher',
                        },
                        {
                            path: 'building',
                        },
                        {
                            path: 'room',
                        },
                    ],
                })
                .populate('scope');

            let response = await Promise.all(
                signedConsultations.map(async (registration) => {
                    const consultation = registration.consultation as IConsultationModel;
                    const students = await findSignedUsers(consultation._id, true);

                    return {
                        consultation: {
                            _id: consultation._id,
                            date: consultation.date,
                            subject: (consultation.subject as ISubject).name,
                            teacher: {
                                _id: (consultation.teacher as IUser)._id,
                                name: (consultation.teacher as IUser).name,
                                image: (consultation.teacher as IUser).image,
                            },
                            building: (consultation.building as IBuilding).name,
                            room: (consultation.room as IRoom).name,
                            max_students: consultation.max_students,
                            students,
                            end_signing_up: consultation.end_signing_up,
                            description: consultation.description,
                            time: consultation.time,
                        },
                        date: registration.date,
                        reason: registration.reason,
                        scope: {
                            name: (registration.scope as IScope).name,
                            description: (registration.scope as IScope).description,
                        },
                    };
                })
            );

            res.json(new AppResponse(200, 'Signed consultations', response));
        } catch (e) {
            console.error(e);
            return next(new AppError('Error with finding signed consultations', 500));
        }
    },
};

async function isSigned(consultationId: ObjectId, userId: ObjectId) {
    const registration = await Registration.findOne({ consultation: consultationId, user: userId });

    if (registration) {
        return true;
    } else {
        return false;
    }
}

async function findSignedUsers(id: ObjectId, count: boolean) {
    const signedUsers = Registration.find({ consultation: id }).populate('user');

    if (count) {
        return (await signedUsers).length;
    }

    return (await signedUsers).map((sign) => {
        return sign.user;
    });
}
