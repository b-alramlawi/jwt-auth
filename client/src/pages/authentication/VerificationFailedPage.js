// VerificationFailedPage.js

import React from 'react';
import {useHistory} from 'react-router-dom';
import Button from "../../components/Button";
import {useTranslation} from "react-i18next";

function VerificationFailedPage() {
    const history = useHistory();
    const {t, i18n} = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
    };

    return (
        <div className="flex justify-center items-center h-screen" style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            direction: i18n.language === 'ar' ? 'rtl' : 'ltr'

        }}>
            <div className="p-8 rounded-lg w-[500px] bg-black border border-gray-300">
                <h2 className="text-center font-bold text-3xl mb-8 text-gray-300">{t('verificationFailed')}</h2>
                <p className="text-center font-bold text-xl mb-8 text-[#DC2626]">{t('verificationFailedMessage')}</p>
                <Button
                    text={t('goToLogin')}
                    onClick={() => history.push('/login')}
                />
                <p
                    className="mt-2 text-center text-sm text-gray-400 cursor-pointer hover:text-white"
                    onClick={() => changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}>
                    {i18n.language === 'en' ? 'عربي' : 'English'}
                </p>
            </div>
        </div>
    );
}

export default VerificationFailedPage;
