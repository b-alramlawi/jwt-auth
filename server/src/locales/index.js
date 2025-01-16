// index.js

const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');

i18next
    .use(i18nextMiddleware.LanguageDetector)
    .use(Backend)
    .init({
        fallbackLng: 'en',
        locales: ['en', 'ar'],
        backend: {
            loadPath: path.join(__dirname, '{{lng}}.json'),
        },
        preload: ['en', 'ar'],
    });

module.exports = i18next;

