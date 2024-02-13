const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please enter password.'],
        minLength: 8
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function (val) {
                return val == this.password;
            },
            message: 'Please enter same password.'
        }
    },
    passwordChangedAt: Date,

    passwordResetToken: String,
    passwordResetExpires: Date
});

//-----------------------Encrypt password--------------------
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

//--------------Update passwwordChangedAt field-------------------
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

//----------------------Check Password--------------------------
userSchema.methods.checkPassword = async function (candidate, actual) {
    return await bcrypt.compare(candidate, actual);
};

userSchema.methods.isPasswordModified = function (time) {
    if (this.passwordChangedAt) {
        const timeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return time < timeStamp;
    }

    return false;
};

//---------------Create Reset Token------------------
userSchema.methods.createResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + (10 * 60 * 1000);

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
