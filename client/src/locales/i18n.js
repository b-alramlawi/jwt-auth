// i18n.js

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import translationEn from './en.json';
import translationAr from './ar.json';

const storedLanguage = localStorage.getItem('language');

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: translationEn
            }, ar: {
                translation: translationAr
            }
        }, lng: storedLanguage || 'en', fallbackLng: 'en', interpolation: {
            escapeValue: false
        }
    });

i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;

