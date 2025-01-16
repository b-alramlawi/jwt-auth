// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, lowercase: true},
    password: {type: String},
    username: {type: String},
    avatar: {type: String},
    isVerified: {type: Boolean, default: false},
    verificationToken: {type: String},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}
}, {
    timestamps: true // createdAt & updatedAt fields
});

// Static method for user registration.
userSchema.statics.register = async function ({username, email, password, emailVerificationToken, t}) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this({
        username,
        email,
        password: hashedPassword,
        verificationToken: emailVerificationToken,
    });

    try {
        await newUser.save();
        return newUser;
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email === 1) {
            throw new Error(t('emailAlreadyExists'));
        } else {
            throw new Error(t('databaseError'));
        }
    }
};

// Static method for user login.
userSchema.statics.login = async function ({email, password, t}) {
    const user = await this.findOne({email});

    if (!user) {
        throw new Error(t('userNotFound'));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error(t('invalidEmailOrPassword'));
    }

    return user;
};

// Static method for user verifyEmail.
userSchema.statics.verifyEmail = async function (token, t) {
    const user = await this.findOne({verificationToken: token});

    if (!user) {
        throw new Error(t('userNotFoundOrAlreadyVerified'));
    }

    if (user.isVerified) {
        throw new Error(t('emailAlreadyVerified'));
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    return user;
};

// Static method for user forgotPasswordEmail.
userSchema.statics.forgotPasswordEmail = async function (email, resetPasswordToken) {
    await this.updateOne({email}, {
        $set: {
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpires: Date.now() + 3600000
        }
    });
    return resetPasswordToken;
};

// Static method for user resetPassword.
userSchema.statics.resetPassword = async function (token, decodedToken, newPassword, t) {
    const email = decodedToken.email;

    const user = await this.findOne({email});

    if (!user) {
        throw new Error(t('userNotFound'));
    }

    if (user.resetPasswordToken !== token || Date.now() > user.resetPasswordExpires) {
        throw new Error(t('invalidOrExpiredToken'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.updateOne({email}, {
        $set: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }
    });
};

// Static method to retrieve user by ID.
userSchema.statics.getUserByID = async function (userID) {
    try {
        return await this.findById(userID);
    } catch (error) {
        throw error;
    }
};


module.exports = mongoose.model('User', userSchema);
