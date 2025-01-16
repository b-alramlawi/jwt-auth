// loginController.js

const User = require('../../models/User');
const {generateAccessToken, generateRefreshToken} = require("../../helpers/jwtHelper");

async function loginUser(req, res) {
    try {
        const {email, password} = req.body;
        const user = await User.login({email, password, t: req.t});

        const accessTokenPayload = {id: user._id, username: user.username, email: user.email};
        const accessToken = generateAccessToken(accessTokenPayload);
        const refreshTokenPayload = {id: user._id, username: user.username, email: user.email};
        const refreshToken = generateRefreshToken(refreshTokenPayload);

        // Store refresh token in an HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000});

        return apiSuccessResponse(res, 200, req.t('loginSuccess'), undefined, accessToken);
    } catch (error) {
        console.error('Error occurred:', error.message);
        return apiErrorResponse(res, 500, 'Internal server error', error.message);
    }
}

module.exports = {loginUser};
