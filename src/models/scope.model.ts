import { Schema, model, ObjectId, Document } from 'mongoose';

import ScopeType from './scopeTypes.model';
import { IScopeType } from './scopeTypes.model';

interface IScopeModel extends Document {
    name: string;
    description: string;
    teacher: ObjectId;
    subject: ObjectId;
    type: ObjectId | IScopeType;
}

const scope = new Schema<IScopeModel>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: Schema.Types.ObjectId, required: true },
    type: { type: Schema.Types.ObjectId, required: true, ref: ScopeType },
});

const Scope = model<IScopeModel>('Scope', scope);

export default Scope;
export { IScopeModel };
