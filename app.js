const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const noteRouter = require('./Routes/noteRoutes');
const userRouter = require('./Routes/userRoutes');
const homeRouter = require('./Routes/homeRoutes');
const errorHandler = require('./Controllers/errorController');

const appError = require('./utils/appError');

const app = express();

//-----------------FOR PUG TEMPLATES--------------------
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

//--------------------MIDDLEWARES-------------------------

//SET SECURITY HTTP HEADERS
app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

//RATE LIMIT MIDDLEWARE
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //WindowMs is window size in milli seconds
    limit: 100,
    message: 'Too many request from this IP, please try again after 15 minutes'
});

app.use(limiter);

//Development Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//------------------FOR PARSING REQ DATA IN BODY---------------
app.use(express.json());

//Sanitise incoming data from NoSQL query injection
app.use(mongoSanitizer());

//Santize incoming data agains XSS
app.use(xss());

// prevention again http-parameter-pollution (hpp)
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsAverage',
            'ratingsQuantity',
            'price',
            'maxGroupSize',
            'difficulty'
        ]
    })
);

//------------------SERVING STATIC FILES----------------------
app.use(express.static(`${__dirname}/public`));
app.use('/resetPassword', express.static(`${__dirname}/public`));

//----------cookie parsing--------------
app.use(cookieParser());

//-----------Compress send data-------------
app.use(compression());

//-------------MIDDLEWARE ENDING------------------
//

//-------------------Request Handlings---------------------

app.use('/', homeRouter);

app.use('/notes', noteRouter);
app.use('/users', userRouter);

app.all('*', (req, res, next) => {
    const err = new appError(
        `Cant find ${req.originalUrl} anywhere on the server`,
        404
    );
    next(err);
});

//------------------Error Handling---------------------
app.use(errorHandler);
module.exports = app;
