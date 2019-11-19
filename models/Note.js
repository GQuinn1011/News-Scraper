var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({

    username: String,

    text: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;