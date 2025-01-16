// Navbar.js

import React, {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import API_BASE_URL from "../config/apiConfig";
import ConfirmDialog from "./ConfirmDialog";
import {useTranslation} from "react-i18next";

function Navbar() {
    const history = useHistory();
    const {t, i18n} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const accessToken = localStorage.getItem('accessToken');
    const language = localStorage.getItem('language');
    const isAuthenticated = !!accessToken;

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
    };

    const handleLogout = () => {
        // Open the confirmation dialog
        setConfirmationDialogOpen(true);
    };

    const confirmLogout = async () => {
        setLoading(true);
        try {
            const logoutEndpoint = `${API_BASE_URL}/jwt-auth/api/logout`;
            const response = await fetch(logoutEndpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {Authorization: `${accessToken}`, 'Accept-Language': `${language}`},
            });

            const data = await response.json();
            if (response.ok) {
                // Logout successful
                console.log(data.status.message);
                // Clear data from localStorage
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');

                history.push(`/login`);
            } else {
                // Logout failed
                console.log(data.status.message);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }

        setLoading(false);
        setConfirmationDialogOpen(false);
    };

    const cancelLogout = () => {
        setConfirmationDialogOpen(false);
    };

    return (
        <nav className="navbar bg-black text-white py-2 fixed top-0 left-0 right-0 z-50"
             style={{direction: i18n.language === 'ar' ? 'rtl' : 'ltr'}}>
            <div className="max-w-full h-12 flex justify-between items-center px-2 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <img src="/jwt.png" alt="Logo" className="w-10 h-10 mr-2"/>
                    <span
                        className={`text-gray-300 text-base font-bold ${i18n.language === 'ar' ? 'mr-2' : ''}`}>
            {i18n.language === 'ar' ? '\u00A0\u00A0' : ' '}{t('authentication')}
          </span>
                </div>
                <ul className="flex">
                    <li className="mr-4">
                        <Link to="/home" className="text-gray-300 hover:text-[#fb005b]">
                            {t('home')}
                        </Link>
                    </li>

                    <li className="mr-4">
                        <Link to="/profile" className="text-gray-300 hover:text-[#fb005b]">
                            {t('profile')}
                        </Link>
                    </li>

                    {isAuthenticated ? (
                        <li className={`mr-4 ${i18n.language === 'ar' ? 'ml-4' : ''}`}>
                            {loading ? (
                                <span>{t('loading')}</span>
                            ) : (
                                <span className="text-gray-300 hover:text-red-700 cursor-pointer"
                                      onClick={handleLogout}>
                  {t('logout')}
                </span>
                            )}
                        </li>
                    ) : null}


                    <li>
                        <button onClick={() => changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
                                className="bg-transparent border-2 border-gray-300 text-white px-4 py-1
                                text-sm rounded-md hover:bg-[#fb005b] transition-colors">
                            {i18n.language === 'en' ? 'عربي' : 'English'}
                        </button>
                    </li>
                </ul>
            </div>
            <ConfirmDialog
                isOpen={confirmationDialogOpen}
                onClose={cancelLogout}
                onConfirm={confirmLogout}
                text={t('logoutConfirmation')}
                buttonConfirm={t('buttonConfirm')}
                buttonClose={t('buttonClose')}
            />
        </nav>
    );
}

export default Navbar;
