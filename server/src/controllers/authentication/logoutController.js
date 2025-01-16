// logoutController.js

async function logoutUser(req, res) {
    try {
        // Clear the refresh token cookie on the client side
        res.clearCookie('refreshToken');
        return apiSuccessResponse(res, 200, req.t('logoutSuccess'));
    } catch (error) {
        console.error('Error occurred:', error.message);
        return apiErrorResponse(res, 500, 'Internal server error', error.message);
    }
}


module.exports = {logoutUser};
