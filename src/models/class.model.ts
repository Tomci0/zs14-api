import { Schema, model, connect, ObjectId, Document } from 'mongoose';

import { IUser } from './user.model';

interface IClass extends Document {
    symbol: string;
    number: number;
    teacher: ObjectId | IUser;
}

const classSchema = new Schema<IClass>({
    symbol: { type: String, required: true },
    number: { type: Number, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Class = model<IClass>('Class', classSchema);

export default Class;
export { IClass };
