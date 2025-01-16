// ProfilePage.js

import React, {useState, useEffect, useRef} from 'react';
import Navbar from '../components/Navbar';
import {validateEmail, validateNewPassword, validatePassword, validateUsername} from "../utils/formValidation";
import StatusMessage from "../components/StatusMessage";
import {useTranslation} from "react-i18next";

function ProfilePage() {
    const accessToken = localStorage.getItem('accessToken');
    const language = localStorage.getItem('language');
    const userId = localStorage.getItem('userId');
    const fileInputRef = useRef(null);
    const {t, i18n} = useTranslation();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [updateResult, setUpdateResult] = useState(null);
    const [successUpdate, setSuccessUpdate] = useState('');
    const [errorUpdate, setErrorUpdate] = useState('');

    // Inline calculation of greeting
    const hour = new Date().getHours();
    const greeting = hour >= 6 && hour < 12 ? t('morningGreeting') : (hour >= 12 && hour < 18 ? t('afternoonGreeting') : t('eveningGreeting'));


    const [validationMessages, setValidationMessages] = useState({
        username: '', email: '', currentPassword: '', newPassword: '',
    });


    const validateForm = () => {
        const errors = {username: '', email: '', currentPassword: '', newPassword: ''};

        const usernameError = validateUsername(username);
        const emailError = validateEmail(email);

        if (usernameError) {
            errors.username = usernameError;
        }
        if (emailError) {
            errors.email = emailError;
        }
        if (showPasswordForm) {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;

            const currentPasswordError = validatePassword(currentPassword);
            const newPasswordError = validateNewPassword(newPassword);

            if (currentPasswordError) {
                errors.currentPassword = currentPasswordError;
            }
            if (newPasswordError) {
                errors.newPassword = newPasswordError;
            }
        }

        setValidationMessages(errors);

        return Object.values(errors).every((message) => message === '');
    };


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/jwt-auth/api/profile/${userId}`, {
                    headers: {
                        Authorization: `${accessToken}`,
                        'Accept-Language': `${language}`
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setUserData(data.data);
                    setUsername(data.data.username);
                    setEmail(data.data.email);
                    setAvatar(data.data.avatar);
                } else {
                    // Handle error
                    console.error('Error fetching user data:', data.status ? data.status.message : 'Unknown error');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId, accessToken]);

    const handleCameraIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleTogglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const formData = new FormData();

            // Add updated data to the formData
            formData.append('username', username);
            formData.append('email', email);

            if (previewImage) {
                const fileInput = fileInputRef.current;
                const selectedFile = fileInput.files[0];

                // Ensure a file is selected
                if (selectedFile) {
                    formData.append('avatar', selectedFile);
                }
            }

            // Add password-related fields if the password form is visible
            if (showPasswordForm) {
                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = document.getElementById('newPassword').value;

                formData.append('currentPassword', currentPassword);
                formData.append('newPassword', newPassword);
            }

            const response = await fetch(`http://localhost:5000/jwt-auth/api/update-profile/${userId}`, {
                method: 'PUT', headers: {
                    Authorization: `${accessToken}`,
                    'Accept-Language': `${language}`
                }, body: formData
            });

            const data = await response.json();
            if (response.ok) {
                // Update successful
                console.log(data.status.message);
                setSuccessUpdate(data.status.message);
                setIsEditing(false);
                setUpdateResult(true);
                setTimeout(() => {
                    setUpdateResult(null);
                }, 2000);
            } else {
                // Handle update error
                setUpdateResult(false);
                console.error(data.status.message);
                setErrorUpdate(data.status.message);
                setTimeout(() => {
                    setUpdateResult(null);
                }, 2000);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setUpdateResult(false);
            setTimeout(() => {
                setUpdateResult(null);
            }, 2000);
        }
    };

    const handleEdit = async () => {
        setIsEditing(true);
    };


    const isVerified = userData && userData.isVerified;
    return (<div className="flex flex-col items-center justify-center h-screen">
        <Navbar/>


        <div className="w-full max-w-sm md:max-w-3xl lg:max-w-4xl xl:max-w-3xl mx-8
             bg-black rounded-lg
             shadow-md p-5 text-center"
             style={{direction: i18n.language === 'ar' ? 'rtl' : 'ltr'}}>
            <div className="flex justify-between items-center mb-5 rounded-lg p-5">
                <h2 className="text-2xl text-white">{greeting} {userData && userData.username}</h2>
                <div className={`p-2 rounded font-bold text-white ${isVerified ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isVerified ? t('verified') : t('notVerified')}
                </div>
            </div>

            {updateResult === true && <StatusMessage message={successUpdate} isSuccess/>}
            {updateResult === false && <StatusMessage message={errorUpdate}/>}

            {userData && !showPasswordForm && (
                <div className="flex items-center rounded-lg bg-gray-300 text-gray-700 p-4">
                    <div className="flex-1 flex items-center relative">
                        <div className="relative">
                            <img
                                src={previewImage || avatar || '/profile.png'}
                                alt="Profile Image"
                                className={`w-2/3 rounded-full ${i18n.language === 'ar' ? 'mr-8' : 'ml-8'}`}
                                style={{position: 'relative'}}
                            />
                            {isEditing && (<div
                                className={`absolute bottom-0 right-0 ${i18n.language === 'ar' ? 'mr-10' : 'mr-14'} mb-2 bg-green-500 rounded-full
                                 flex justify-center items-center cursor-pointer`}
                                onClick={handleCameraIconClick}
                                style={{width: '2rem', height: '2rem', position: 'absolute'}}
                            >
                                <img
                                    src="/camera-white.svg"
                                    alt="camera"
                                    className="w-6 h-6 rounded-full object-cover"
                                    style={{width: '1.2rem', height: '1.2rem'}}
                                />
                            </div>)}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileInputChange}
                        />
                    </div>


                    <div className="mb-4 w-2/3">
                        <form>
                            <label htmlFor="username"
                                   className="text-black text-start block mb-1">{t('username')}</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                readOnly={!isEditing}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`bg-gray-100 rounded mt-2 mb-1 py-2 px-4 block w-full ${validationMessages.username !== '' ? 'border border-red-500' : ''}`}
                            />
                            {validationMessages.username !== '' && (<span
                                className="block text-start text-red-500 text-sm">{validationMessages.username}</span>)}

                            <label htmlFor="email"
                                   className="text-black text-start block mb-1">{t('email')}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                readOnly={!isEditing}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`bg-gray-100 rounded mt-2 mb-1 py-2 px-4 block w-full ${validationMessages.email !== '' ? 'border border-red-500' : ''}`}
                            />
                            {validationMessages.email !== '' && (<span
                                className="block text-start text-red-500 text-sm">{validationMessages.email}</span>)}

                            {isEditing ? (<button
                                    type="button"
                                    className="w-full mt-2 bg-[#fb005b] text-white py-2 px-4 rounded-lg cursor-pointer text-lg transition-colors duration-300 hover:bg-[#ff5c99]"
                                    onClick={handleSave}
                                >
                                    {t('save')}
                                </button>

                            ) : (<button type="button"
                                         className="w-full mt-2 bg-[#fb005b] text-white py-2 px-4 rounded-lg cursor-pointer text-lg transition-colors duration-300 hover:bg-[#ff5c99]"
                                         onClick={handleEdit}>
                                {t('edit')}
                            </button>)}
                        </form>
                    </div>
                </div>)}


            {showPasswordForm && (<div className=" items-center rounded-lg bg-gray-300 text-gray-700 p-4">
                <form>
                    <label htmlFor="currentPassword"
                           className="text-black text-start block mb-1">{t('currentPassword')}</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        className={`bg-gray-100 rounded mt-2 mb-1 py-2 px-4 block w-full ${validationMessages.currentPassword !== '' ? 'border border-red-500' : ''}`}
                    />
                    {validationMessages.currentPassword !== '' && (<span
                        className="block text-start text-red-500 text-sm">{validationMessages.currentPassword}</span>)}

                    <label htmlFor="newPassword"
                           className="text-black text-start block mb-1">{t('newPassword')}</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className={`bg-gray-100 rounded mt-2 mb-1 py-2 px-4 block w-full ${validationMessages.newPassword !== '' ? 'border border-red-500' : ''}`}
                    />
                    {validationMessages.newPassword !== '' && (<span
                        className="block text-start text-red-500 text-sm">{validationMessages.newPassword}</span>)}

                    <button
                        type="button"
                        onClick={handleSave}
                        className="w-full mt-2 bg-[#fb005b] text-white py-2 px-4 rounded-lg cursor-pointer text-lg transition-colors duration-300 hover:bg-[#ff5c99]"
                    >
                        {t('changePassword')}
                    </button>
                </form>
            </div>)}

            <button
                className={`bg-[#00B2F1B2] hover:bg-[#00F2E7FF] 
                    text-white px-4 py-2 rounded-md cursor-pointer 
                    text-lg transition-colors duration-300 
                    flex items-center p-4 mt-4`}
                onClick={handleTogglePasswordForm}
            >
                {showPasswordForm ? t('backToUserData') : t('changePassword')}
            </button>


        </div>
    </div>);
}

export default ProfilePage;
