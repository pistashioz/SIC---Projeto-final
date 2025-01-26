import Tip from '../../models/Tip.model.js';
import config from "../../config/db.config.js";

import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: config.C_CLOUD_NAME,
    api_key: config.C_API_KEY,
    api_secret: config.C_API_SECRET
});


const createTip = async (_, { input }, context) => {
    
    const { title, info, image, description, author } = input;

    const uploadResult = await cloudinary.uploader.upload(image, {
        folder: 'tips'
    })

    if (!uploadResult) {
        throw new Error('Failed to upload image')
    }

    const newTip = new Tip({
        title: title,
        info: info,
        image: uploadResult.secure_url,
        cloudinary_id: uploadResult.public_id,
        description: description,
        author: author,
        createdAt: new Date().toISOString()
    });

    const res = await newTip.save();

    return {
       id: res.id,
        ...res._doc
    }
}

const deleteTip = async (_, { id }) => {
    const wasDeleted = (await Tip.deleteOne({_id : id})).deletedCount;
    if (wasDeleted === 0) {
        throw new Error('Tip is not in your favorites');
    }
    return { wasDeleted, message: 'Tip removed' };

}

const editTip = async (_, { id, tipInput: {title, info, image, cloudinary_id, description, author} }) => {
    const wasEdited = (await Tip.updateOne({_id: id}, { title: title, info: info, image: image, cloudinary_id: cloudinary_id, description: description, author: author })).modifiedCount;
    // 1 se foi editado, 0 se não foi editado
    return wasEdited;

}

const tipResolvers = {
    Query: {
        getTip: async (_, { id }) => {
            try {
                const tip = await Tip.findById(id);
                if (!tip) {
                    throw new Error('Tip not found');
                }
                return tip;
            } catch (error) {
                throw new Error('Error fetching tip');
            }
        },
        getTips: async (_, { amount }) => {
            try {
                return await Tip.find().sort({createdAt: -1}).limit(amount);
            } catch (error) {
                throw new Error('Error fetching tips');
            }
        }
    },
    Mutation: {
        createTip, 
        editTip,
        deleteTip
    }
}

export default tipResolvers;
