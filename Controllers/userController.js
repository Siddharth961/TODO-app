const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

exports.allUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        status: 'success',
        length : users.length,
        users
    });
});

// exports.upodate = catchAsync(async (req, res, next) => {
//     const user = req.user;
//     const verify = user.comparePassword(req.oldPassword, user.password);

//     if (verify == false) return new appError('Enter correct password!', 404);

//     if (req.password != req.passwordConfirm)
//         return new appError('please verify new password', 401);

//     await User
// });
