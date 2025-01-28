import FavoriteTip from '../../models/FavoriteTip.model.js';
import authMiddleware from '../../utils/authMiddleware.js';

const addFavoriteTip = async (_, { input }, context) => {
    const { userId, tipId } = input
    authMiddleware(context);

    const existingFavoriteTip = await FavoriteTip.findOne({ userId, tipId });
    if (existingFavoriteTip) {
        throw new Error('Tip is already in your favorites');
    }

    const newFavoriteTip = new FavoriteTip({ 
        userId: userId, 
        tipId: tipId,
        createdAt: new Date().toISOString()
    });

    try {
        const res = await newFavoriteTip.save();
   
        return {
            id: res._id, 
            userId: res.userId,
            tipId: res.tipId,
        };
    } catch (error) {
        console.error('Error saving favorite tip:', error);
        throw new Error('Error adding favorite tip');
    }
}


const removeFavoriteTip = async (_, { id }, context) => {
    authMiddleware(context)
    const wasDeleted = (await FavoriteTip.deleteOne({_id: id})).deletedCount;
    if (wasDeleted === 0) {
        throw new Error('Tip is not in your favorites');
    }
    return true
}

const favoritetipResolvers = {
    Query: {
        getFavoriteTips: async (_, { userId }, context) => {
            authMiddleware(context)
            return await FavoriteTip.find({ userId });
        }
    },
    Mutation: {
        addFavoriteTip,
        removeFavoriteTip

    }
}
export default favoritetipResolvers