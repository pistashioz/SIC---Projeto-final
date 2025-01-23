import { model, Schema } from 'mongoose';
const tipSchema = new Schema({
    title: { type: String, required: true },
    info: { type: String, default: '' },
    image: { type: String, default: '' },
    cloudinary_id: { type: String, default: '' },
    description: { type: String, default: '', required: true },
    author: { type: String, default: 'Anonymous', required: true }
}, {
    collection: 'tip',
    timestamps: true
});

export default model('Tip', tipSchema);

