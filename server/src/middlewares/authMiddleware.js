// authMiddleware.js

const {verifyAccessToken} = require('../helpers/jwtHelper');

const isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return apiErrorResponse(res, 401, req.t('unauthorizedTokenMissing'));
    }

    try {
        const decoded = verifyAccessToken(token);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Error occurred:', error.message);
        return apiErrorResponse(res, 401, req.t('unauthorizedInvalidToken'), error.message);
    }
};

module.exports = {isAuthenticated};
