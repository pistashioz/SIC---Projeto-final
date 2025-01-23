import mongoose, { model, Schema } from 'mongoose';

const eventSchema = new Schema({
    eventType: { type: String, required: true },
    eventDate: { type: Date, required: true },
    description: { type: String, required: false},
    state: { type: String, enum: ['COMPLETED', 'PENDING', 'POSTPONE']},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    repeat: { type: String, enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'NONE'], required: true},
    repeatTime: { type: String, required: true },
}, {
    collection: 'event',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

eventSchema.virtual('id').get(function() {
    return this._id.toString();
})

export default model('event', eventSchema)