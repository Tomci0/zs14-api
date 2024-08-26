import { Schema, model, connect, ObjectId, Document } from 'mongoose';

interface ISubject extends Document {
    name: string;
}

const subject = new Schema<ISubject>({
    name: { type: String, required: true },
});

const Subject = model<ISubject>('Subject', subject);

export default Subject;
export { ISubject };
