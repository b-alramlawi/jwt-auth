// helpers/apiResponse.js

const createHttpError = require('http-errors');


const apiSuccessResponse = (res, statusCode, message, data, token) => {
    const response = {
        status: {
            statusCode: statusCode,
            status: 'success',
            message: message
        },
        data: data,
        token: token
    };

    return res.status(statusCode).json(response);
};

const apiErrorResponse = (res, statusCode, message, errorDetails = undefined) => {
    const response = {
        status: {
            statusCode: statusCode,
            status: 'error',
            message: message
        },
        errorDetails: errorDetails,
        timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(response);
};

const apiNotFoundResponse = (req, res, error) => {
    error = createHttpError(404);

    const response = {
        status: {
            statusCode: error.statusCode,
            status: 'error',
            message: error.message
        },
        timestamp: new Date().toISOString(),
    };

    return res.status(error.statusCode).json(response);
};


module.exports = {apiSuccessResponse, apiErrorResponse, apiNotFoundResponse};
