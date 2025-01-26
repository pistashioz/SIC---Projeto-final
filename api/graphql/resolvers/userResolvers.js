import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server-express';
import User from '../../models/User.model.js';
import config from "../../config/db.config.js";
import { validateSignUpInput, validateLoginInput } from '../../utils/auth.js';
import authMiddleware from '../../utils/authMiddleware.js';
import FavoriteTip from '../../models/FavoriteTip.model.js';
import Event from '../../models/Event.model.js';

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        config.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const signUp = async (_, { signUpInput: { username, name, email, password } }) => {
    const { valid, errors } = validateSignUpInput(username, name, email, password);
    if (!valid) {
        throw new UserInputError('Errors', { errors });
    }
    password = await bcrypt.hash(password, 12);
    const newUser = new User({
        username,
        name,
        email,
        password
    })
    const res = await newUser.save();

    const token = generateToken(res);
    return {
        ...res._doc,
        id: res._id,
        token
    }
}

const login = async (_, {username, password}) => {
    const { valid, errors } = validateLoginInput(username, password);
    if (!valid) {
        throw new UserInputError('Errors', { errors });
    }
    const user = await User.findOne({ username });
    if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
    }
    const token = generateToken(user);
    return {
        ...user._doc,
        id: user._id,
        token
    }
}

const updateUserProfile = async (_, { id, userInput: {username, name, email, password} }, context) => {
    authMiddleware(context)
    
    const updatedFields = { username, name, email };

    if (password) {
        updatedFields.password = await bcrypt.hash(password, 12);
    }
    const wasEdited = await User.updateOne({_id: id}, updatedFields)
    return wasEdited.modifiedCount > 0;
}

const logout = async (_, __, context) => {
    return { success: true, message: 'Logged out successfully' };
};

const userResolvers = {
    Query: {
        getUserDetails: async (_, { token }, context) => {
            const userFound = authMiddleware(context)
            // se o utilizador está autenticado e autorizado, retorna user details
            if (!userFound) {
                throw new Error('Not authenticated');
            }
            const user = await User.findById(userFound.id).select('-password');
            return user
        },
       getUsers: async() => {
            try {
                return await User.find().select('-password');
            } catch (error) {
                throw new Error('Error fetching users')
            }
        },
        getUser: async (_, { id }) => {
            try {
                const user = await User.findById(id).select('-password');
                if (!user) {
                    throw new Error('User not found');
                }
                return user
            } catch (error) {
                throw new Error('Error fetching user')
            }
        }
    },
    Mutation: {
        signUp, 
        login,
        updateUserProfile,
        logout
    },
    User: {
        favoriteTips: async (parent) => {
            const favorites = await FavoriteTip.find({ userId: parent.id }).populate('tipId')
            return favorites.map((favorite) => favorite.tipId)
        },
        events: async (parent) => {
            const events = await Event.find({ userId: parent.id })
            return events
        }
    }
}
export default userResolvers;
