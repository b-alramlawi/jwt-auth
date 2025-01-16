// profileValidation.js

const {body, validationResult} = require('express-validator');

const validateUsername = body('username').optional()
    .isString().withMessage((value, {req}) => req.t('usernameString'))
    .isLength({min: 2, max: 30}).withMessage((value, {req}) => req.t('usernameLength'))
    .notEmpty().withMessage((value, {req}) => req.t('usernameEmpty'));

const validateEmail = body('email').optional()
    .isEmail().withMessage((value, {req}) => req.t('emailValid'))
    .notEmpty().withMessage((value, {req}) => req.t('emailEmpty'));

const validateCurrentPassword = body('currentPassword').optional()
    .isString().withMessage((value, {req}) => req.t('currentPasswordString'))
    .isLength({min: 8}).withMessage((value, {req}) => req.t('currentPasswordLength'))
    .notEmpty().withMessage((value, {req}) => req.t('currentPasswordEmpty'));

const validateNewPassword = body('newPassword').optional()
    .isString().withMessage((value, {req}) => req.t('newPasswordString'))
    .isLength({min: 8}).withMessage((value, {req}) => req.t('newPasswordLength'))
    .notEmpty().withMessage((value, {req}) => req.t('newPasswordEmpty'));

const handleValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return apiErrorResponse(res, 400, req.t('validationFailed'), errors.array());
    }
    next();
};


// Validation middleware for user profile
const validateProfile = async (req, res, next) => {
    try {
        await validateUsername.run(req);
        await validateEmail.run(req);
        await validateCurrentPassword.run(req);
        await validateNewPassword.run(req);
        handleValidationResult(req, res, next);
    } catch (err) {
        console.error(err);
        return apiErrorResponse(res, 500, 'Internal Server Error');
    }
};

module.exports = {validateProfile};
