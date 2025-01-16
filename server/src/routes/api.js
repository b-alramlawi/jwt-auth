// routes/api.js

const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middlewares/authMiddleware');
const {
    validateRegistration,
    validateLogin,
    validateForgotPassword,
    validateResetPassword
} = require('../middlewares/validations/authValidation');
const {validateProfile} = require('../middlewares/validations/profileValidation');
const {updateAccessToken} = require('../controllers/tokenController');
const authController = require('../controllers/authentication');
const profileController = require('../controllers/profile/profileController');

// Update access token management routes
router.post('/update-access-token', updateAccessToken);

// Authentication management routes
router.post('/register', validateRegistration, authController.registerUser);
router.post('/login', validateLogin, authController.loginUser);
router.get('/verify/:token', authController.verifyEmail);
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);
router.post('/reset-password/:token', validateResetPassword, authController.resetPassword);
router.post('/logout', isAuthenticated, authController.logoutUser);

// User profile management routes
router.get('/profile/:userId', isAuthenticated, profileController.getUserById);
router.put('/update-profile/:userId', isAuthenticated, validateProfile, profileController.updateUserProfileWithAvatar);

module.exports = router;
