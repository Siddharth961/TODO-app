const express = require('express');
const noteController = require('../Controllers/noteController');

const Router = express.Router();

Router.route('/')
    .get(noteController.getAllNotes)
    .post(noteController.createNote);

Router.route('/:id')
    .get(noteController.getNote)
    .patch(noteController.updateNote)
    .delete(noteController.deleteNote);

module.exports = Router
