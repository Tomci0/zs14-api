import { Schema, model, connect, ObjectId } from 'mongoose';

import { IUser } from './user.model';
import Consultation, { IConsultationModel } from './consultation.model';
import Scope, { IScopeModel } from './scope.model';
import { IScope } from '../types/types';

interface IRegistration extends Document {
    user: ObjectId | IUser;
    consultation: ObjectId | IConsultationModel;
    date: Date;
    reason: string;
    scope: ObjectId | string | IScope;
}

const registration = new Schema<IRegistration>({
    user: { type: Schema.Types.ObjectId, required: true },
    consultation: { type: Schema.Types.ObjectId, required: true, ref: Consultation },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    scope: { type: String || Schema.Types.ObjectId, required: true, ref: Scope },
});

const Registration = model<IRegistration>('Registration', registration);

export default Registration;
export { IRegistration };
