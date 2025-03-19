import { Schema, model, connect, ObjectId, Document } from 'mongoose';

interface IScopeType extends Document {
    name: string;
}

const scopeGroupSchema = new Schema<IScopeType>({
    name: { type: String, required: true },
});

const ScopeType = model<IScopeType>('ScopeType', scopeGroupSchema);

export default ScopeType;
export { IScopeType };
