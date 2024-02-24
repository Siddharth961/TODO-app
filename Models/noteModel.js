const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 70
    },
    body: {
        type: String,
        required: true,
        maxLength: 600
    },
    userId: {
        type: String,
        required: [true, 'You are not logged in, please log in!']
    },
    createDate: {
        type: Date
    },
    createdAt: {
        type: String
        // default : new Date().toLocaleString()
    }
});

noteSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = 'Created ' + new Date().toLocaleString();
        this.createDate = Date.now()
    }

    //console.log(this.createdAt)
    next();
});

noteSchema.pre('save', function (next) {
    if ((this.isModified('title') || this.isModified('body')) && !this.isNew) {
        this.createdAt = 'Edited ' + new Date().toLocaleString();
    }
    next();
});
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
