const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const noteRouter = require('./Routes/noteRoutes');
const userRouter = require('./Routes/userRoutes');
const homeRouter = require('./Routes/homeRoutes');
const errorHandler = require('./Controllers/errorController');

const appError = require('./utils/appError');

const app = express();

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use('/resetPassword',express.static(`${__dirname}/public`));

//Development Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//----------cookie parsing--------------
app.use(cookieParser());

// app.use(compression());
const middle = express.urlencoded({ extended: false });





//-------------------Request Handlings---------------------


app.use('/', homeRouter);

app.use('/notes', noteRouter);
app.use('/users', userRouter);

app.all('*', (req, res, next) => {
    console.log(1);

    const err = new appError(
        `Cant find ${req.originalUrl} anywhere on the server`,
        404
    );
    next(err);
});

//------------------Error Handling---------------------
app.use(errorHandler);
module.exports = app;
