// helpers/jwtHelper.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = ({id, username, email, ...additionalData}) => {
    return jwt.sign({id, username, email, ...additionalData},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '3h'});
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new Error('Invalid access token');
    }
};

const generateRefreshToken = ({id, username, email, ...additionalData}) => {
    return jwt.sign({id, username, email, ...additionalData},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '7d'});
};

const verifyRefreshToken = (token, secret) => {
    return jwt.verify(token, secret);
};

const generateEmailVerificationToken = ({email}) => {
    return jwt.sign({email},
        process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
        {expiresIn: '1h'});
};

const verifyEmailVerificationToken = (token) => {
    try {
        return jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN_SECRET);
    } catch (error) {
        throw new Error('Invalid email verification token');
    }
};

const generateResetPasswordToken = ({email}) => {
    return jwt.sign({email},
        process.env.RESET_PASSWORD_TOKEN_SECRET,
        {expiresIn: '1h'});
};

const verifyResetPasswordToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid reset password token');
    }
};

module.exports = {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateEmailVerificationToken,
    verifyEmailVerificationToken,
    generateResetPasswordToken,
    verifyResetPasswordToken
};
