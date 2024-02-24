const appError = require('../utils/appError');

const sendErrDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};

const handleCastErrDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new appError(message, 404);
};

const handleDuplicateFeildsDB = (err) => {
    const message = `User with this ${Object.keys(err.keyValue)} already exits.\nPlease select another ${Object.keys(err.keyValue)}.`;
    return new appError(message, 400);
};

const handleValidationErrDB = (err) => {
    let errors = Object.values(err.errors).map((el) => el.message);
    let message = `Invalid input data. \n`;
    errors.forEach((error)=>{
        message = `${error}\n`
    })
    return new appError(message, 404);
};

const handle_JWT_Validation = (err) =>
    new appError('Invalid token. Please log in again', 401);

const handle_JWT_Expire = (err) =>
    new appError('Token expired. Please log in again', 401);

const sendErrProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // console.log(err);
        res.status(500).send('Something went wrong!');
    }
};

module.exports = (err, req, res, next) => {
    // console.log(err)

    err.statusCode = err.statusCode || 500;
    console.log(
        'Error happend -- Global error handler-------in error controller'
    );

    if (process.env.NODE_ENV == 'development') {
        sendErrDev(err, res);

        //blank
    } else if (process.env.NODE_ENV == 'production') {
        let error = err ;

        if (error.name == 'CastError') error = handleCastErrDB(error);

        if (error.code == 11000) error = handleDuplicateFeildsDB(error);

        if (err.name == 'ValidationError') error = handleValidationErrDB(error);

        if (err.name == 'JsonWebTokenError')
            error = handle_JWT_Validation(error);

        if (err.name == 'TokenExpiredError') error = handle_JWT_Expire(error);

        sendErrProd(error, res);
    }
};
