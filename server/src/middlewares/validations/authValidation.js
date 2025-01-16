// authValidation.js

const {body, validationResult} = require('express-validator');

const validateUsername = body('username')
    .isString().withMessage((value, {req}) => req.t('usernameString'))
    .isLength({min: 2, max: 30}).withMessage((value, {req}) => req.t('usernameLength'))
    .notEmpty().withMessage((value, {req}) => req.t('usernameEmpty'));

const validateEmail = body('email')
    .isEmail().withMessage((value, {req}) => req.t('emailValid'))
    .notEmpty().withMessage((value, {req}) => req.t('emailEmpty'));

const validatePassword = body('password')
    .isString().withMessage((value, {req}) => req.t('passwordString'))
    .isLength({min: 8}).withMessage((value, {req}) => req.t('passwordLength'))
    .notEmpty().withMessage((value, {req}) => req.t('passwordEmpty'));

const validateNewPassword = body('newPassword')
    .isString().withMessage((value, {req}) => req.t('passwordString'))
    .isLength({min: 8}).withMessage((value, {req}) => req.t('passwordLength'))
    .notEmpty().withMessage((value, {req}) => req.t('passwordEmpty'));

const handleValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return apiErrorResponse(res, 400, req.t('validationFailed'), errors.array());
    }
    next();
};


// Validation middleware for user registration
const validateRegistration = async (req, res, next) => {
    try {
        await validateUsername.run(req);
        await validateEmail.run(req);
        await validatePassword.run(req);
        handleValidationResult(req, res, next);
    } catch (err) {
        console.error(err.message);
        return apiErrorResponse(res, 500, 'Internal Server Error');
    }
};

// Validation middleware for user login
const validateLogin = async (req, res, next) => {
    try {
        await validateEmail.run(req);
        await validatePassword.run(req);
        handleValidationResult(req, res, next);
    } catch (err) {
        console.error(err);
        return apiErrorResponse(res, 500, 'Internal Server Error');
    }
};

// Validation middleware for forgot password
const validateForgotPassword = async (req, res, next) => {
    try {
        await validateEmail.run(req);
        handleValidationResult(req, res, next);
    } catch (err) {
        console.error(err);
        return apiErrorResponse(res, 500, 'Internal Server Error');
    }
};

// Validation middleware for reset password
const validateResetPassword = async (req, res, next) => {
    try {
        await validateNewPassword.run(req);
        handleValidationResult(req, res, next);
    } catch (err) {
        console.error(err);
        return apiErrorResponse(res, 500, 'Internal Server Error');
    }
};

module.exports = {validateRegistration, validateLogin, validateForgotPassword, validateResetPassword};
