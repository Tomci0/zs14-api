import { Schema, model, connect, Document, ObjectId } from 'mongoose';

import Class, { IClass } from './class.model';

interface IUser extends Document {
    googleId?: string;
    email?: string;
    name: string;
    password?: string;
    class?: ObjectId | IClass | string;
    image: string;
    isTeacher: boolean;
    isAdmin: boolean;
    disabled: boolean;
}

const userSchema = new Schema<IUser>({
    googleId: { type: String, required: false },
    email: { type: String, required: false },
    name: { type: String, required: true },
    password: { type: String, required: false },
    class: { type: Schema.Types.ObjectId, required: false, ref: Class },
    image: { type: String, required: false, default: '/images/default-user.jpg' },
    isTeacher: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
});

const User = model<IUser>('User', userSchema);

export default User;
export { IUser };
