import { Schema, model, connect, ObjectId, Document } from 'mongoose';

import ScopeType from './scopeTypes.model';
import { IScopeType } from './scopeTypes.model';

interface IScopeModel extends Document {
    name: string;
    description: string;
    subject: ObjectId;
    teacher: ObjectId;
    type: ObjectId | IScopeType | string;
}

const scope = new Schema<IScopeModel>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: Schema.Types.ObjectId, required: true },
    type: { type: Schema.Types.ObjectId || String, required: true, ref: ScopeType },
});

const Scope = model<IScopeModel>('Scope', scope);

export default Scope;
export { IScopeModel };
