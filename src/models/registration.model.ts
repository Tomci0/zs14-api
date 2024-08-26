import { Schema, model, connect, ObjectId } from 'mongoose';

import { IUser } from './user.model';
import { IConsultationModel } from './consultation.model';
import { IScopeModel } from './scope.model';

interface IRegistration extends Document {
    user: ObjectId | IUser;
    consultation: ObjectId | IConsultationModel;
    date: Date;
    reason: string;
    scopes: ObjectId[];
}

const registration = new Schema<IRegistration>({
    user: { type: Schema.Types.ObjectId, required: true },
    consultation: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    scopes: { type: [Schema.Types.ObjectId], required: true },
});

const Registration = model<IRegistration>('Registration', registration);

export default Registration;
export { IRegistration };
