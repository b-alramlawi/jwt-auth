// config.js

require('dotenv').config();

const baseUrl = process.env.BASE_URL
const secretKey = process.env.SECRET_KEY
const databaseUrl = process.env.MONGODB_URI
const port = process.env.PORT || 5000;

module.exports = {baseUrl, secretKey, databaseUrl, port};
