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
    }
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) next();
    
});
const User = mongoose.model('User', userSchema);
module.exports = User;
