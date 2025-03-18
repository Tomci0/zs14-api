import { Schema, model, ObjectId, Document, Model } from 'mongoose';
import User from './user.model';

import { IUser } from '../types/types';

import QRCode from 'qrcode';

// Interfejs dla metod instancji
interface ICodesMethods {
    isExpired(): boolean;
    isAuthor(author: ObjectId): boolean;
}

// Interfejs dla głównych pól dokumentu
interface ICodes extends Document {
    user: ObjectId | IUser;
    code: number;
    date: Date;
    type: string;
    author: ObjectId;
    expire_at: Date;
}

// Interfejs dla metod statycznych
interface ICodesModel extends Model<ICodes, {}, ICodesMethods> {
    createCode(user: ObjectId, type: string, author?: ObjectId): Promise<ICodes>;
    getCode(code: string): Promise<ICodes | null>;
}

// Schemat zdefiniowany zgodnie z interfejsem ICodes
const codesSchema = new Schema<ICodes, ICodesModel>({
    user: { type: Schema.Types.ObjectId, required: true, ref: User },
    code: { type: Number, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: false, ref: User },
    expire_at: { type: Date, required: true },
});

// Metody instancji
codesSchema.methods.isExpired = function (): boolean {
    return this.expire_at < new Date();
};

codesSchema.methods.isAuthor = function (author: ObjectId): boolean {
    return this.author.equals(author);
};

// Metody statyczne
codesSchema.statics.createCode = async function (user: ObjectId, type: string, author?: ObjectId): Promise<ICodes> {
    // const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const date = new Date();
    const expire_at = new Date();
    expire_at.setDate(expire_at.getDate() + 2);

    let code;
    let existingCode;

    do {
        code = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0');
        existingCode = await this.findOne({ code });
    } while (existingCode);
    return await this.create({ user, code, date, type, author, expire_at });
};

codesSchema.statics.findCode = function (code: string): Promise<ICodes | null> {
    return this.findOne({ code });
};

// Tworzenie modelu z metodami statycznymi i instancjami
const Codes = model<ICodes, ICodesModel>('Codes', codesSchema);

export default Codes;
export { ICodes };
