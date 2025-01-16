// verificationController.js

const User = require('../../models/User');

async function verifyEmail(req, res) {
    try {
        const {token} = req.params;

        if (!token) {
            if (req.headers['user-agent'].includes('Postman')) {
                return apiErrorResponse(res, 400, 'Token is missing');
            }
            return res.redirect('http://localhost:3000/v-failed');
        }
        await User.verifyEmail(token, req.t);
        if (req.headers['user-agent'].includes('Postman')) {
            return apiSuccessResponse(res, 200, req.t('emailVerificationSuccess'), null);
        }

        return res.redirect('http://localhost:3000/v-success');
    } catch (error) {
        console.error('Error while verifying email:', error.message);

        if (req.headers['user-agent'].includes('Postman')) {
            return apiErrorResponse(res, 500, 'Internal server error', error.message);
        }

        return res.redirect('http://localhost:3000/v-failed');
    }
}

module.exports = {verifyEmail};
