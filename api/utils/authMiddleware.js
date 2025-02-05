import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import config from "../config/db.config.js";

const authMiddleware = (context) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, config.JWT_SECRET);
                return user;
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]'");
    }
    throw new Error("Authorization header must be provided");
};

export default authMiddleware;
