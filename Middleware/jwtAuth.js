const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtMethods = {
    jwtAuth: (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
    
        if (!token) {
            return res.status(401).json({ message: 'Please Login!!!' });
        }
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
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