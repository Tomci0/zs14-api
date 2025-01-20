import { Schema, model, connect, ObjectId, Document } from 'mongoose';

interface ISongType extends Document {
    songId: string;
    title: string;
    artist: string;
    cover: string;

    length: number;
    lastPlayed: Date;
}

const songsSchema = new Schema<ISongType>({
    songId: { type: String, required: true },

    title: { type: String, required: true },
    artist: { type: String, required: true },
    cover: { type: String, required: true },
    length: { type: Number, required: true },
    lastPlayed: { type: Date, default: null },
});

const Song = model<ISongType>('Song', songsSchema);

export default Song;
export { ISongType };
