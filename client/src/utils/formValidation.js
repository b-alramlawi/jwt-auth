// formValidation.js

import i18n from 'i18next';

const validateUsername = (username) => {
    if (!username.trim()) {
        return i18n.t('usernameIsRequired');
    } else if (username.trim().length < 2) {
        return i18n.t('usernameMinLengthError');
    }
    return null;
};

const validateEmail = (email) => {
    if (!email.trim()) {
        return i18n.t('emailIsRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        return i18n.t('invalidEmailError');
    }
    return null;
};

const validatePassword = (password) => {
    if (!password.trim()) {
        return i18n.t('passwordIsRequired');
    } else if (password.length < 8) {
        return i18n.t('passwordMinLengthError');
    }
    return null;
};

const validateNewPassword = (password) => {
    if (!password.trim()) {
        return i18n.t('newPasswordRequired');
    } else if (password.length < 8) {
        return i18n.t('passwordMinLengthError');
    }
    return null;
};

export {validateUsername, validateEmail, validatePassword, validateNewPassword};
