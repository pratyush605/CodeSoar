const jwtMethods = require('./jwtAuth.js');

const excludedRoutes = [
    '/auth/signup',
    '/auth/login',
];

const applyAuthMiddleware = (req, res, next) => {
    if (excludedRoutes.includes(req.path)) {
        return next();
    }
    jwtMethods.jwtAuth(req, res, next);
};

module.exports = applyAuthMiddleware;