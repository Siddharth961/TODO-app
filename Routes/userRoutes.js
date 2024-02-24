const express = require('express');
const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');

const Router = express.Router();

//------------authentication and all-----------------
Router.post('/signup', authController.signup);
Router.post('/login', authController.login);
Router.patch(
    '/updatePassword',
    authController.authenticate,
    authController.updatePassword
);

Router.delete('/logout', authController.logout);

Router.post('/forgotPassword', authController.forgot);
Router.patch('/resetPassword/:token', authController.reset);

Router.route('/').get(userController.allUsers);

module.exports = Router;
