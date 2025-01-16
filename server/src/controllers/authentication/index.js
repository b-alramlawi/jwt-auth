// index.js

const {registerUser} = require('./registerController');
const {verifyEmail} = require('./verificationController');
const {loginUser} = require('./loginController');
const {forgotPassword, resetPassword} = require('./passwordController');
const {logoutUser} = require('./logoutController');

module.exports = {
    registerUser: registerUser,
    verifyEmail: verifyEmail,
    loginUser: loginUser,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    logoutUser: logoutUser,
};
