// LoginPage.js

import React, {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import Button from '../../components/Button';
import {validateEmail, validatePassword} from "../../utils/formValidation";
import StatusMessage from "../../components/StatusMessage";
import {useTranslation} from 'react-i18next';

function LoginPage() {
    const history = useHistory();
    const {t, i18n} = useTranslation();
    const [formData, setFormData] = useState({email: '', password: ''});
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(null);
    const [validationMessages, setValidationMessages] = useState({email: '', password: ''});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const language = localStorage.getItem('language');

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
    };
    const validateForm = () => {
        const errors = {};

        errors.email = validateEmail(formData.email);
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
            setIsLoggingIn(true);
            const response = await fetch('/jwt-auth/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': `${language}`
                }, body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                // Login successful
                setLoginSuccess(true);
                console.log(data.status.message);
                setSuccessMessage(data.status.message);


                // Decode the JWT token
                const jwt = data.token;
                const decodedToken = JSON.parse(atob(jwt.split('.')[1]));

                // Extract userId and username
                const userId = decodedToken.id;
                const username = decodedToken.username;

                // Store the token and user information in localStorage
                localStorage.setItem('accessToken', jwt);
                localStorage.setItem('userId', userId);
                localStorage.setItem('username', username);

                setTimeout(() => {
                    history.push('/home')
                }, 2000);
            } else {
                // Login failed
                setLoginSuccess(false);
                console.log(data.errorDetails);
                setErrorMessage(data.errorDetails);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoginSuccess(false);
        } finally {
            setIsLoggingIn(false);
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
            <h2 className="text-center font-bold text-3xl mb-8 text-gray-300">{t('loginTitle')}</h2>
            {loginSuccess === true && <StatusMessage message={successMessage} isSuccess/>}
            {loginSuccess === false && <StatusMessage message={errorMessage}/>}

            <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="text-gray-300">{t('emailLabel')}</label>
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
                    <label htmlFor="password"
                           className="text-gray-300">{t('passwordLabel')}</label>
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
                <div className="mb-4">
                    <Link to="/forgot-password" className="text-sm text-[#29b6f6] hover:text-[#00e5ff]">
                        {t('forgotPassword')}
                    </Link>
                </div>
                <Button
                    text={t('login')}
                    onClick={handleFormSubmit}
                    isLoading={isLoggingIn}
                    loadingText={t('loggingIn')}
                />
            </form>
            <p className="text-center text-gray-300 mt-4">
                {t('noAccount')}{' '}
                <Link to="/register" className="text-sm font-semibold text-[#29b6f6] hover:text-[#00e5ff]">
                    {t('register')}
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

export default LoginPage;
