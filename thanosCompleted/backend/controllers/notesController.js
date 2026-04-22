const Note = require("../models/note");

const fetchNotes = async (req, res) => {
  let notes = await Note.find().lean();

  // Migrate old single-body documents (field was "body", not "bodies")
  const outdated = notes.filter(n => n.body && (!n.bodies || n.bodies.length === 0));
  for (const n of outdated) {
    await Note.findByIdAndUpdate(n._id, { $push: { bodies: { text: n.body } } });
  }
  if (outdated.length > 0) {
    notes = await Note.find().lean();
  }

  res.json({ notes });
};

const fetchNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.json({ note });
};

const createNote = async (req, res) => {
  const { title, body } = req.body;
  let note = await Note.findOne({ title });
  if (note) {
    note.bodies.push({ text: body });
    await note.save();
  } else {
    note = await Note.create({ title, bodies: [{ text: body }] });
  }
  res.json({ note });
};

const updateNote = async (req, res) => {
  const { bodyId, text } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, "bodies._id": bodyId },
    { $set: { "bodies.$.text": text } },
    { new: true }
  );
  res.json({ note });
};

const deleteNote = async (req, res) => {
  await Note.deleteOne({ _id: req.params.id });
  res.json({ success: "Record Deleted Successfully" });
};

module.exports = { fetchNote, fetchNotes, updateNote, createNote, deleteNote };
