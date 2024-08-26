import { Schema, model, connect, ObjectId, Document } from 'mongoose';

interface IScopeType extends Document {
    name: string;
    test: boolean;
    shorttest: boolean;
    practise: boolean;
}

const scopeGroupSchema = new Schema<IScopeType>({
    name: { type: String, required: true },
    test: { type: Boolean, default: false },
    shorttest: { type: Boolean, default: false },
    practise: { type: Boolean, default: false },
});

const ScopeType = model<IScopeType>('ScopeType', scopeGroupSchema);

export default ScopeType;
export { IScopeType };
