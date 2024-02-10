const Note = require('../Models/noteModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllNotes = catchAsync(async (req, res, next) => {
    const notes = await Note.find({}).sort('CreatedAt');
    res.status(200).json({
        status: 'success',
        length: notes.length,
        notes
    });
});

exports.getNote = catchAsync(async (req, res, next) => {
    const note = await Note.findById(req.params.id);
    if (note == null)
        return next(new appError('No data with given Id found.', 404));
    res.status(200).json({
        status: 'success',
        note
    });
});

exports.createNote = catchAsync(async (req, res, next) => {
    const note = await Note.create(req.body);
    res.status(201).json({
        status: 'success',
        note
    });
});

exports.updateNote = catchAsync(async (req, res, next) => {
    const note = await Note.findByIdAndUpdate(req.params.noteId, req.body, {
        new: true,
        runValidators: true
    });

    if (note == null) return next(new appError('No data with given Id found.', 404));
    

    res.status(200).json({
        status: 'success',
        note
    });
});

exports.deleteNote = catchAsync(async (req, res, next) => {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (note == null)
        return next(new appError('No data with given Id found.', 404));

    res.status(204).json({
        status: 'success'
    });
});
