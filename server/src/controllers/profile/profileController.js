// profileController.js

const User = require('../../models/User');
const {upload, removeOldFile} = require('../../helpers/fileUpload');
const {sendEmail} = require('../../helpers/mailSender');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const path = require("path");
const {promises: fs} = require("fs");

async function getUserById(req, res) {
    const token = req.headers.authorization;

    try {
        const userID = req.params.userId;
        const user = await User.getUserByID(userID);

        if (!user) {
            return apiErrorResponse(res, 404, req.t('userNotFound'));
        }

        return apiSuccessResponse(res, 200, req.t('userFound'), user, token);
    } catch (error) {
        console.error('Error while retrieving user by ID:', error.message);
        return apiErrorResponse(res, 500, 'Internal server error', error.message);
    }
}

// Function to generate a JWT verification token
function generateVerificationToken(userId) {
    const secret = config.secretKey;
    const expiresIn = '1d';

    return jwt.sign({userId}, secret, {expiresIn});
}

async function updateUserProfileWithAvatar(req, res) {
    const token = req.headers.authorization;

    try {
        upload(req, res, async function (error) {
            if (error) {
                return apiErrorResponse(res, 400, req.t('avatarUploadError'), error.message);
            }

            const userId = req.params.userId;
            const {email, currentPassword, newPassword, username} = req.body;
            const avatarFile = req.file;
            const updateFields = {username};

            try {
                const user = await User.findById(userId);

                if (avatarFile) {
                    const oldAvatarFilename = user.avatar;
                    removeOldFile(oldAvatarFilename);
                }

                if (currentPassword) {
                    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

                    if (!isPasswordValid) {
                        return apiErrorResponse(res, 401, req.t('incorrectCurrentPassword'));
                    }
                }

                if (newPassword && currentPassword) {
                    updateFields.password = await bcrypt.hash(newPassword, 10);
                } else if (newPassword && !currentPassword) {
                    return apiErrorResponse(res, 400, req.t('currentPasswordRequiredToUpdatePassword'));
                }

                if (email && email !== user.email) {
                    updateFields.email = email;
                    updateFields.isVerified = false;
                    updateFields.verificationToken = generateVerificationToken(userId);
                }

                if (avatarFile) {
                    const avatarFilename = avatarFile.filename;
                    updateFields.avatar = `uploads/${userId}/profile-picture/${avatarFilename}`;
                }

                const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {new: true});

                if (!updatedUser) {
                    return apiErrorResponse(res, 404, req.t('userNotFound'));
                }

                const message = avatarFile ? 'User profile updated with avatar' : 'User profile updated without avatar';

                // Send verification email if email was updated
                if (email && email !== user.email) {
                    const templatePath = path.join(__dirname, '../../views/email-template/emailTemplate.html');
                    const emailTemplate = await fs.readFile(templatePath, 'utf-8');

                    const verificationLink = `http://localhost:5000/jwt-auth/api/verify/${updatedUser.verificationToken}`;

                    const emailHtml = emailTemplate
                        .replace('{{pageTitle}}', 'Email Verification')
                        .replace('{{emailTitle}}', 'Email Verification')
                        .replace('{{emailMessage}}', 'Click the following link to verify your email:')
                        .replace('{{buttonText}}', 'Verify Your Email')
                        .replace(/{{verificationLink}}/g, verificationLink);

                    await sendEmail(email, 'Email Verification', emailHtml);

                    return apiSuccessResponse(res, 200, `${message}. Verification email sent.`, updatedUser, token);
                }

                return apiSuccessResponse(res, 200, message, updatedUser, token);
            } catch (error) {
                console.error('Error updating user profile with avatar:', error.message);
                return apiErrorResponse(res, 500, 'Internal server error', error.message);
            }
        });
    } catch (error) {
        console.error('Error while updating user profile with avatar:', error.message);
        return apiErrorResponse(res, 500, 'Internal server error', error.message);
    }
}


module.exports = {
    getUserById, updateUserProfileWithAvatar
};
