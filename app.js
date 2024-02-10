const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const noteRouter = require('./Routes/noteRoutes');
const errorHandler = require('./Controllers/errorController');
const appError = require('./utils/appError');

const app = express();

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
//Development Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// app.use(compression());
const middle = express.urlencoded({ extended: false });

// app.get('/', (req, res) => {
//     res.render('login');
// });

// app.post('/signup', middle, (req, res) => {
//     res.status(200).render('home');
// });

// app.get('/signup-page', (req, res) => {
//     res.render('signup');
// });

// app.post('/login', middle, (req, res) => {
//     res.status(200).render('home');
// });

app.use('/notes', noteRouter);

app.all('*', (req, res, next) => {
    const err = new appError(
        `Cant find ${req.originalUrl} anywhere on the server`,
        404
    );
    next(err);
});
app.use(errorHandler);
module.exports = app;
