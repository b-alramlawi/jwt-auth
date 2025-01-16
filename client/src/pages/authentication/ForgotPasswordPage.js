// ForgotPasswordPage.js

import React, {useState} from 'react';
import Button from "../../components/Button";
import {validateEmail} from "../../utils/formValidation";
import StatusMessage from "../../components/StatusMessage";
import {useTranslation} from "react-i18next";

function ForgotPasswordPage() {
    const {t, i18n} = useTranslation();
    const language = localStorage.getItem('language');
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
    };

    const [formData, setFormData] = useState({email: ''});
    const [validationMessages, setValidationMessages] = useState({email: ''});
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(null);

    const validateForm = () => {
        const errors = {};

        errors.email = validateEmail(formData.email);

        if (Object.values(errors).some((error) => error !== null)) {
            setValidationMessages(errors);
            return false;
        }
        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSendingEmail(true);

        // Add your logic here to send a password reset email
        try {
            const response = await fetch('http://localhost:5000/jwt-auth/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': `${language}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                // ForgotPassword successful
                setForgotPasswordSuccess(true);
                console.log(data.status.message);
                setSuccessMessage(data.status.message);
                setFormData({email: ''});
            } else {
                // ForgotPassword failed
                setForgotPasswordSuccess(false);
                console.log(data.errorDetails);
                setErrorMessage(data.errorDetails);
            }
        } catch (error) {
            console.error('Error sending password reset email:', error);
            setForgotPasswordSuccess(false);
            setErrorMessage(t('internalServerError'))
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setValidationMessages((prevMessages) => ({
            ...prevMessages,
            [name]: '',
        }));
    };

    return (
        <div className="flex justify-center items-center h-screen" style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
        }}>
            <div className="p-8 rounded-lg w-[500px] bg-black border border-gray-300">
                <h2 className="text-center font-bold text-3xl mb-8 text-gray-300">{t('forgotPassword')}</h2>
                {forgotPasswordSuccess === true && <StatusMessage message={successMessage} isSuccess/>}
                {forgotPasswordSuccess === false && <StatusMessage message={errorMessage}/>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="text-gray-300">{t('emailLabel')}</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange(e)}
                            required
                            className={`bg-gray-100 rounded mt-2 mb-1 py-2 px-4 block w-full ${validationMessages.email !== '' ? 'border border-red-500' : ''}`}
                        />
                        {validationMessages.email !== '' && (
                            <span className="text-red-500 text-sm">{validationMessages.email}</span>
                        )}
                    </div>

                    <Button
                        text={t('sendResetEmail')}
                        onClick={handleSubmit}
                        isLoading={isSendingEmail}
                    />
                    <p
                        className="mt-2 text-center text-sm text-gray-400 cursor-pointer hover:text-white"
                        onClick={() => changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}>
                        {i18n.language === 'en' ? 'عربي' : 'English'}
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
