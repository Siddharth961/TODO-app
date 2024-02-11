const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// const sendEmail = require('../utils/mail');

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);

    const cookieOptions = {
        expire: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV == 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: 'success',
        user,
        token
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new appError('Please enter your email and password', 400));

    const user = await User.findOne({ email: email });
    let verify = false;
    if (user) verify = await user.checkPassword(password, user.password);

    if (!user || !verify)
        return next(new appError('Incorrect email id and password!!', 401));

    createSendToken(user, 200, res);
});

exports.authenticate = catchAsync(async (req, res, next) => {
    let token = '';
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else token = req.cookies.jwt;

    if (!token)
        return next(
            new appError('You are not logged in, please log in !', 401)
        );

    const decode = await jwt.verify(token, process.env.JWT_SECRET);

    const user = User.findById(decode.id);

    console.log(token);

    next();
});
