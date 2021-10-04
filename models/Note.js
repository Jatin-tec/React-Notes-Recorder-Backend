const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
    //foreign key from user schema
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    title:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true        
    },

    tag:{
        type: String,
        default: 'General'
    },

    date:{
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('notes', notesSchema);
module.exports = Note;