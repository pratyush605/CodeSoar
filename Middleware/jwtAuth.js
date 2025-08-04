const jwt = require('jsonwebtoken');
const redisClient = require('../Utils/redisClient.js');
require('dotenv').config();

const jwtMethods = {
    jwtAuth: async (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
    
        if (!token) {
            return res.status(401).json({ message: 'Please Login!!!' });
        }
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            const storedToken = await redisClient.get(user.userId.toString());
            if (!storedToken) {
                return res.status(401).json({ message: 'Token expired or logged out. Please login again.' });
            }
            if (storedToken !== token) {
                return res.status(401).json({ message: 'Invalid Jwt token. Please re-authenticate.' });
            }
            req.user = user;
            next();
        } catch (err) {
            res.status(401).json({ message: 'Token is not valid. Please login!!!' });
        }
    },
    
    generateJwt: (payload, expiresIn = '7d') => {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    }
};

module.exports = jwtMethods;