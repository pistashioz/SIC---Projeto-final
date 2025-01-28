import mongoose, { model, Schema } from 'mongoose';

const eventSchema = new Schema({
    eventType: { type: String, enum: ['STI_TEST', 'CONTRACEPTIVE_REFILL', 'COUNSELING_SESSION', 'WORKSHOP', 'OTHER'], required: true},
    eventDate: { type: Date, required: true },
    description: { type: String, required: false},
    state: { type: String, enum: ['COMPLETED', 'PENDING', 'POSTPONE']},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    repeat: { type: String, enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'NEVER'], required: true},
    location: { type: String, required: false }
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