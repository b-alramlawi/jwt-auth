// server.js

const http = require('http');
const app = require('./app');
const config = require('./config/config');

const server = http.createServer(app);
const PORT = config.port;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

