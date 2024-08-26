import { Schema, model, connect, ObjectId, Document } from 'mongoose';

interface IBuilding extends Document {
    name: string;
}

const building = new Schema<IBuilding>({
    name: { type: String, required: true },
});

const Building = model<IBuilding>('Building', building);

export default Building;
export { IBuilding };
