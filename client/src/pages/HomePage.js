// HomePage.js

import React from 'react';
import Navbar from '../components/Navbar';
import {useTranslation} from "react-i18next";

function HomePage() {
    const {t, i18n} = useTranslation();
    const storedUserName = localStorage.getItem('username');

    const now = new Date();
    const hour = now.getHours();
    let greeting;
    if (hour >= 6 && hour < 12) {
        greeting = t('morningGreeting');
    } else if (hour >= 12 && hour < 18) {
        greeting = t('afternoonGreeting');
    } else {
        greeting = t('eveningGreeting');
    }

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    const formattedDateTime = new Intl.DateTimeFormat(i18n.language, options).format(now);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Navbar/>
            <div
                className="w-full max-w-sm md:max-w-3xl lg:max-w-4xl xl:max-w-3xl mx-8
             bg-[#fb005b] rounded-lg
             shadow-md p-5 text-center"
                style={{direction: i18n.language === 'ar' ? 'rtl' : 'ltr'}}
            >
                <div
                    className="max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-6xl
                 bg-black p-10 text-white rounded-lg
                 shadow-md overflow-hidden relative"
                >
                    <div className="text-3xl mt-10">
                 <span className="inline-block news-ticker">
                     {greeting} {storedUserName} ✨
                 </span>
                    </div>
                    <div className="text-gray-400 text-sm mt-10">
                        <span className="inline-block news-ticker">{formattedDateTime}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
