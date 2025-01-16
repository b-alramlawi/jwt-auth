// RegisterPage.js

import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import Button from "../../components/Button";
import {validateUsername, validateEmail, validatePassword} from "../../utils/formValidation";
import StatusMessage from "../../components/StatusMessage";
import {useTranslation} from 'react-i18next';

function RegisterPage() {
    const history = useHistory();
    const {t, i18n} = useTranslation();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const language = localStorage.getItem('language');

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
    };

    const [formData, setFormData] = useState({
        username: '', email: '', password: '',
    });

    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(null);
    const [validationMessages, setValidationMessages] = useState({
        username: '', email: '', password: '',
    });

    const validateForm = () => {
        const errors = {};

        errors.email = validateEmail(formData.email);
        errors.username = validateUsername(formData.username);
        errors.password = validatePassword(formData.password);

        if (Object.values(errors).some((error) => error !== null)) {
            setValidationMessages(errors);
            return false;
        }
        return true;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsRegistering(true);
            const response = await fetch('http://localhost:5000/jwt-auth/api/register', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': `${language}`
                }, body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Register successful
                setRegistrationSuccess(true);
                console.log(data.status.message);
                setSuccessMessage(data.status.message);

                setTimeout(() => {
                    history.push('/login');
                }, 1000);
            } else {
                // Register failed
                setRegistrationSuccess(false);
                console.log(data.errorDetails);
                setErrorMessage(data.errorDetails);
            }
        } catch (error) {
            console.error('Error:', error.message);
            setRegistrationSuccess(false);
        } finally {
            setIsRegistering(false);
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
            <h2 className="text-center font-bold text-3xl mb-8 text-gray-300">{t('authentication')}</h2>
            {registrationSuccess === true && (<StatusMessage message={successMessage} isSuccess/>)}
            {registrationSuccess === false && (<StatusMessage message={errorMessage}/>)}

            <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="text-gray-300">{t('username')}</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className={`bg-gray-100 rounded mt-2 mb-1 py-2 px-4 block w-full ${validationMessages.username !== '' ? 'border border-red-500' : ''}`}
                    />
                    {validationMessages.username !== '' && (
                        <span className="text-red-500 text-sm">{validationMessages.username}</span>)}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="text-gray-300">{t('email')}</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`bg-gray-100 rounded mt-2 mb-1 py-2 px-4 block w-full ${validationMessages.email !== '' ? 'border border-red-500' : ''}`}
                    />
                    {validationMessages.email !== '' && (
                        <span className="text-red-500 text-sm">{validationMessages.email}</span>)}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="text-gray-300">{t('password')}</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className={`bg-gray-100 rounded mt-2 mb-1 py-2 px-4 block w-full ${validationMessages.password !== '' ? 'border border-red-500' : ''}`}
                    />
                    {validationMessages.password !== '' && (
                        <span className="text-red-500 text-sm">{validationMessages.password}</span>)}
                </div>
                <Button
                    text={t('register')}
                    onClick={handleFormSubmit}
                    isLoading={isRegistering}
                    loadingText={t('registering')}
                />
            </form>
            <p className="text-center text-gray-300 mt-4">
                {t('haveAccount')}{' '}
                <Link to="/login" className="text-sm font-semibold text-[#29b6f6] hover:text-[#00e5ff]">
                    {t('login')}
                </Link>
            </p>


            <p
                className="mt-2 text-center text-sm text-gray-400 cursor-pointer hover:text-white"
                onClick={() => changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}>
                {i18n.language === 'en' ? 'عربي' : 'English'}
            </p>
        </div>
    </div>);
}

export default RegisterPage;
