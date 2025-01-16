// app.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {apiSuccessResponse, apiErrorResponse, apiNotFoundResponse} = require('./helpers/apiResponse');
const route = require('./routes/api');
const cors = require('cors');

const i18next = require('./locales');
const i18nextMiddleware = require('i18next-http-middleware');

/** Database connection setup. **/
require('./config/db');

/** Global variable for API response helper **/
global.apiSuccessResponse = apiSuccessResponse;
global.apiErrorResponse = apiErrorResponse;

/** Middlewares. **/
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser())
app.use(cors({origin: ["http://localhost:3000"], credentials: true}));
app.use(i18nextMiddleware.handle(i18next));
app.use('/uploads', express.static('uploads'));

/** Routes. **/
app.use('/jwt-auth/api', route);

/** Handling 404 errors. **/
app.use(apiNotFoundResponse);

module.exports = app;
