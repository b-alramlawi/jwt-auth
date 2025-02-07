// config/db.js

const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.databaseUrl)
    .then(() => {
        console.log('Connected to local MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to local MongoDB:', error.message);
    });

module.exports = mongoose;
