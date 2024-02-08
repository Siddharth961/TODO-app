const express = require('express');
const compression = require('compression');

const app = express();

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use(compression());
const middle = express.urlencoded({ extended: false });

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/signup', middle, (req, res) => {
    res.status(200).render('home');
});

app.get('/signup-page', (req, res) => {
    res.render('signup');
});

app.post('/login', middle, (req, res) => {
    res.status(200).render('home');
});

app.listen(3000);
