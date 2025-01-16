// ResetPasswordPage.js

import React, {useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import Button from '../../components/Button';
import {validateNewPassword} from "../../utils/formValidation";
import StatusMessage from "../../components/StatusMessage";
import {useTranslation} from "react-i18next";

function ResetPasswordPage() {
    const history = useHistory();
    const {t, i18n} = useTranslation();
    const language = localStorage.getItem('language');
    const {token} = useParams();
    const [formData, setFormData] = useState({newPassword: ''});
    const [validationMessages, setValidationMessages] = useState({newPassword: ''});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(null);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
    };
    const validateForm = () => {
        const errors = {};

        errors.newPassword = validateNewPassword(formData.newPassword);

        if (Object.values(errors).some((error) => error !== null)) {
            setValidationMessages(errors);
            return false;
        }
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch(`http://localhost:5000/jwt-auth/api/reset-password/${token}`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', 'Accept-Language': `${language}`
                }, body: JSON.stringify({
                    newPassword: formData.newPassword,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data.status.message);
                setResetPasswordSuccess(true);
                setSuccessMessage(data.status.message);
                setFormData({newPassword: ''});
                setTimeout(() => {
                    history.push('/login');
                }, 2000);
            } else {
                setResetPasswordSuccess(false);
                setErrorMessage(data.status.message);
                console.log(data.status.message);
            }
        } catch (error) {
            setResetPasswordSuccess(false);
            console.error('Error resetting password:', error);
            setErrorMessage(t('internalServerError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData, [name]: value,
        }));
        setValidationMessages((prevMessages) => ({
            ...prevMessages, [name]: '',
        }));
    };

    return (<div className="flex justify-center items-center h-screen" style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        direction: i18n.language === 'ar' ? 'rtl' : 'ltr'

    }}>
        <div className="p-8 rounded-lg w-[500px] bg-black border border-gray-300">
            <h2 className="text-center font-bold text-3xl mb-8 text-gray-300">
                {t('resetPasswordTitle')}
            </h2>
            {resetPasswordSuccess === true && <StatusMessage message={successMessage} isSuccess/>}
            {resetPasswordSuccess === false && <StatusMessage message={errorMessage}/>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="new-password" className="text-gray-300">
                        {t('newPasswordLabel')}
                    </label>
                    <input
                        type="password"
                        id="new-password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange(e)}
                        required
                        className={`bg-gray-100 rounded mt-2 mb-1 py-2 px-4 block w-full ${validationMessages.newPassword !== '' ? 'border border-red-500' : ''}`}
                    />
                    {validationMessages.newPassword !== '' && (<span className="text-red-500 text-sm">
                {validationMessages.newPassword}
              </span>)}
                </div>
                <Button
                    text={t('resetPasswordButton')}
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                />
                <p
                    className="mt-2 text-center text-sm text-gray-400 cursor-pointer hover:text-white"
                    onClick={() => changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}>
                    {i18n.language === 'en' ? 'عربي' : 'English'}
                </p>
            </form>
        </div>
    </div>);
}

export default ResetPasswordPage;
