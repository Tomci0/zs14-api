import { Schema, model, connect, ObjectId, Document } from 'mongoose';
import { ISong, IUser } from '../types/types';

interface IVerificationType extends Document {
    song: ISong | ObjectId;
    addedBy: IUser | ObjectId;
    addedAt: Date;
}

const verificationSchema = new Schema<IVerificationType>({
    song: { type: Schema.Types.ObjectId, required: true, ref: 'Song' },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    addedAt: { type: Date, default: Date.now },
});

const Verification = model<IVerificationType>('Verification', verificationSchema);

export default Verification;
export { IVerificationType };
