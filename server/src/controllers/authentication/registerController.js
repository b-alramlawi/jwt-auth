// registerController.js

const path = require('path');
const fs = require('fs').promises;
const User = require('../../models/User');
const jwtHelper = require("../../helpers/jwtHelper");
const {sendEmail} = require('../../helpers/mailSender');

async function registerUser(req, res) {
    try {
        const {username, email, password} = req.body;
        const emailVerificationToken = jwtHelper.generateEmailVerificationToken(email);
        await User.register({username, email, password, emailVerificationToken, t: req.t});
        const templatePath = path.join(__dirname, '../../views/email-template/emailTemplate.html');


        const emailTemplate = await fs.readFile(templatePath, 'utf-8');
        const verificationLink = `http://localhost:5000/jwt-auth/api/verify/${emailVerificationToken}`;

        const emailHtml = emailTemplate
            .replace('{{pageTitle}}', 'Email Verification')
            .replace('{{emailTitle}}', 'Email Verification')
            .replace('{{emailMessage}}', 'Click the following link to verify your email:')
            .replace('{{buttonText}}', 'Verify Your Email')
            .replace(/{{verificationLink}}/g, verificationLink);

        await sendEmail(email, 'Email Verification', emailHtml);

        return apiSuccessResponse(res, 201, req.t('registrationSuccess'), undefined, emailVerificationToken);
    } catch (error) {
        console.error('Error occurred:', error.message);
        return apiErrorResponse(res, 500, 'Internal server error', error.message);
    }
}

module.exports = {registerUser};
