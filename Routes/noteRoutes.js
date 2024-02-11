const express = require('express');
const noteController = require('../Controllers/noteController');
const authController = require('../Controllers/authController');

const Router = express.Router();

Router.route('/')
    .get(authController.authenticate, noteController.getAllNotes)
    .post(authController.authenticate, noteController.createNote);

Router.route('/:id')
    .get(noteController.getNote)
    .patch(authController.authenticate, noteController.updateNote)
    .delete(authController.authenticate, noteController.deleteNote);

module.exports = Router
