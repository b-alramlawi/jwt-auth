// passwordController.js

const fs = require('fs').promises;
const path = require('path');
const User = require('../../models/User');
const jwtHelper = require("../../helpers/jwtHelper");
const {sendEmail} = require('../../helpers/mailSender');


async function forgotPassword(req, res) {
    try {
        const {email} = req.body;
        const resetPasswordToken = jwtHelper.generateResetPasswordToken({email});

        const resetToken = await User.forgotPasswordEmail(email, resetPasswordToken);

        const templatePath = path.join(__dirname, '../../views/email-template/emailTemplate.html');
        const emailTemplate = await fs.readFile(templatePath, 'utf-8');

        const resetPasswordLink = `http://localhost:3000/reset-password/${resetToken}`;

        const emailHtml = emailTemplate
            .replace('{{pageTitle}}', 'Password Reset')
            .replace('{{emailTitle}}', 'Password Reset')
            .replace('{{emailMessage}}', 'Click the following link to reset your password:')
            .replace('{{buttonText}}', 'Reset Password')
            .replace(/{{verificationLink}}/g, resetPasswordLink);

        await sendEmail(email, 'Password Reset', emailHtml);

        return apiSuccessResponse(res, 200, req.t('passwordResetEmailSent'), null);
    } catch (error) {
        console.error('Error occurred:', error.message);
        return apiErrorResponse(res, 500, 'Internal server error', error.message);
    }
}

async function resetPassword(req, res) {
    try {
        const token = req.params.token;
        const newPassword = req.body.newPassword;
        const decodedToken = jwtHelper.verifyResetPasswordToken(token, process.env.RESET_PASSWORD_TOKEN_SECRET);

        await User.resetPassword(token, decodedToken, newPassword, req.t);

        return apiSuccessResponse(res, 200, req.t('passwordResetSuccess'));
    } catch (error) {
        console.error('Error occurred:', error.message);
        return apiErrorResponse(res, 500, 'Internal server error', error.message);
    }
}


module.exports = {forgotPassword, resetPassword};
