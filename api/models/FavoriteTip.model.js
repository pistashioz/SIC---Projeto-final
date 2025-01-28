import mongoose, { model, Schema } from 'mongoose';

const favoriteTipSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tip', required: true },
}, {
    collection: 'favoritetip',
});

export default model('FavoriteTip', favoriteTipSchema);