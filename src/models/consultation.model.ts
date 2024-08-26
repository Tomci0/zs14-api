import { Schema, model, connect, ObjectId, Document } from 'mongoose';

import { IScopeModel } from './scope.model';

import { IBuilding } from './building.model';
import { IRoom } from './room.model';
import { IUser } from './user.model';
import { ISubject } from './subject.model';

import Subject from './subject.model';
import User from './user.model';
import Building from './building.model';
import Room from './room.model';
import Scope from './scope.model';

interface IConsultationModel extends Document {
    _id: ObjectId;
    date: Date;
    time: number;
    subject: ObjectId | ISubject;
    teacher: ObjectId | IUser;
    building: ObjectId | IBuilding;
    room: ObjectId | IRoom;
    color: string;
    max_students: number;
    students?: IUser[] | ObjectId[];
    end_signing_up: Date;
    description: string;
    scopes: ObjectId[] | IScopeModel[];
}

const consultationSchema = new Schema<IConsultationModel>({
    date: { type: Date, required: true },
    time: { type: Number, required: true },
    subject: { type: Schema.Types.ObjectId, ref: Subject, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: User, required: true },
    building: { type: Schema.Types.ObjectId, ref: Building, required: true },
    room: { type: Schema.Types.ObjectId, ref: Room, required: true },
    color: { type: String, required: true },
    max_students: { type: Number, required: true },
    end_signing_up: { type: Date, required: true },
    description: { type: String, required: true },
    scopes: [{ type: Schema.Types.ObjectId, ref: Scope }],
});

const Consultation = model<IConsultationModel>('Consultation', consultationSchema);

export default Consultation;

export { IConsultationModel };
