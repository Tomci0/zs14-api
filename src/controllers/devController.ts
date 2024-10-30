import { Request, Response } from 'express';

import QRCode from 'qrcode';

// import { Types } from 'mongoose';

import Consultation from '../models/consultation.model';
import AppResponse from '../utils/appResponse';
// import Building from '../models/building.model';
// import Class from '../models/class.model';
// import Room from '../models/room.model';
// import Subject from '../models/subject.model';
// import User from '../models/user.model';
// import scopeTypes from '../models/scopeTypes.model';
// import Scope from '../models/scope.model';

// import { ETime } from '../types/enums';

export default {
    index: (req: Request, res: Response) => {
        res.json('Consultations dev index');
    },
    setup: async (req: Request, res: Response) => {
        try {
            const update = await Consultation.find();

            update.forEach((consultation) => {
                consultation['end_signing_up'] = new Date('10-10-2024');
                consultation.markModified('end_signing_up');
                consultation.save();
            });

            res.json(new AppResponse(200, 'Consultations updated'));
        } catch (error) {
            res.status(500).json(error);
        }
    },
};
