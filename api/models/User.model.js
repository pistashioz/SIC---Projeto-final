import { model, Schema } from 'mongoose';
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    name: {type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    collection: 'user',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual('id').get(function() {
    return this._id.toString()
})
export default model('User', userSchema);