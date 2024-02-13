const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/mail');

//---------------------Create Token-----------------------
const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

//------------------------------Send Token (in cookie and send response)--------------------------------
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

//--------------------------------SignUp---------------------------------------
exports.signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createSendToken(user, 200, res);
});

//-----------------------------------LogIn--------------------------------------
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

//--------------------------------------Authenticate (verify if user is logged in)------------------------------------
exports.authenticate = catchAsync(async (req, res, next) => {
    //Get token

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

    // Decode token
    const decode = await jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const user = await User.findById(decode.id);
    if (!user) return next(new appError('User no longer exists.', 404));

    // Check if password was changed AFTER token was assigned..if yes token should not be used

    if (user.isPasswordModified(decode.iat)) {
        return next(new appError('User recently changed password.', 401));
    }

    req.user = user;

    next();
});

//-------------------------------------Update User password (not Reset)-------------------------------
exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    const verify = user.checkPassword(req.body.oldPassword, user.password);

    if (verify == false)
        return next(new appError('Incoorect User Password', 401));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    createSendToken(user, 200, res);
});

//-----------------------------Forgot Password (send mail) ----------------------------------------
exports.forgot = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new appError('User with this mail do not exists', 404));
    }

    const resetToken = user.createResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/resetPassword/${resetToken}`;

    const message = `Forgot Password? Make Patch request at: ${resetURL}.\n If you didn't forget password, please ignore this mail`;

    try {
        await sendEmail({
            email: req.body.email,
            subject: 'Your password reset link. (Valid only for 10 minutes)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Reset token sent to the mail'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        next(
            new appError('Error happened while sending email. Try again later'),
            500
        );
    }

    // const resetUrl
});

//------------------------Reset Password---------------------------------
exports.reset = catchAsync(async (req, res, next) => {
    const token = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new appError('Invalid token or token expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createSendToken(user,200,res)
});
