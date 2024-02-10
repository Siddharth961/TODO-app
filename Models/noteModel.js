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
    CreatedAt: Date
});

noteSchema.pre('save', function(next){
    this.CreatedAt = new Date().toLocaleString()
    console.log(this.CreatedAt)
    next()
});
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
