const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bodies: [{ text: String }],
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
