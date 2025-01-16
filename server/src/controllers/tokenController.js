// tokenController.js

const {verifyRefreshToken, generateAccessToken} = require("../helpers/jwtHelper");
const updateAccessToken = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return apiErrorResponse(res, 401, req.t('noRefreshTokenProvided'));
        }

        const decoded = verifyRefreshToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = generateAccessToken(
            {id: decoded._id, username: decoded.username, email: decoded.email});

        return apiSuccessResponse(res, 200, req.t('tokensRefreshedSuccessfully'), undefined, accessToken);
    } catch (error) {
        console.error('Error during token refresh:', error);
        return apiErrorResponse(res, 403, req.t('invalidRefreshToken'));
    }
};

module.exports = {updateAccessToken};
