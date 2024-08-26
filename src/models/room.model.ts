import { Schema, model, connect, ObjectId, Document } from 'mongoose';

import { IBuilding } from './building.model';

interface IRoom extends Document {
    name: string;
    building: ObjectId;
}

const room = new Schema<IRoom>({
    name: { type: String, required: true },
    building: { type: Schema.Types.ObjectId, ref: 'Building', required: true },
});

const Room = model<IRoom>('Room', room);

export default Room;
export { IRoom };
