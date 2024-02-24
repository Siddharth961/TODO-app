const express = require('express');
const Router = express.Router();
const authController = require('../Controllers/authController');
const noteController = require('../Controllers/noteController');

//------Utilities--------------
const renderHome = (req, res) => {
    // console.log(req.notes);
    res.render('home', {
        notes: req.notes,
        user: req.user
    });
};

//----------------Requests--------------------------

//---------Home-----------------
Router.get(
    '/home',
    authController.authenticate,
    noteController.getAllNotes,
    renderHome
);

//---------------------Login - Signup--------------------
Router.get('/', (req, res) => {
    res.render('login');
});

Router.get('/signup-page', (req, res) => {
    res.render('signup');
});

//----------------------Forgot - Reset-------------------
Router.get('/forgot', (req, res, next) => {
    res.render('forgot');
});
Router.get('/resetPassword/:token', (req, res, next) => {
    
    res.render('reset');
});

module.exports = Router;
