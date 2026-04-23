const Note = require("../models/note");

const PROTECTED_TITLES = ["To Buy", "Trash Bin"];
const isProtectedTitle = (title) => PROTECTED_TITLES.includes(title);

const fetchNotes = async (req, res) => {
  const existing = await Note.findOne({ title: "To Buy", user: req.user._id });
  if (!existing) {
    await Note.create({ title: "To Buy", bodies: [], user: req.user._id });
  }
  const existingTrashBin = await Note.findOne({ title: "Trash Bin", user: req.user._id });
  if (!existingTrashBin) {
    await Note.create({ title: "Trash Bin", bodies: [], user: req.user._id });
  }

  let notes = await Note.find({ user: req.user._id }).lean();

  const outdated = notes.filter(n => n.body && (!n.bodies || n.bodies.length === 0));
  for (const n of outdated) {
    await Note.findByIdAndUpdate(n._id, { $push: { bodies: { text: n.body } } });
  }
  if (outdated.length > 0) {
    notes = await Note.find({ user: req.user._id }).lean();
  }

  res.json({ notes });
};

const fetchNote = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  res.json({ note });
};

const createNote = async (req, res) => {
  const { title, body } = req.body;
  let note = await Note.findOne({ title, user: req.user._id });
  if (note) {
    note.bodies.push({ text: body });
    await note.save();
  } else {
    note = await Note.create({ title, bodies: [{ text: body }], user: req.user._id });
  }
  res.json({ note });
};

const updateNote = async (req, res) => {
  const { bodyId, text, title } = req.body;
  if (title !== undefined) {
    const current = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (current && isProtectedTitle(current.title)) {
      return res.status(403).json({ error: `"${current.title}" cannot be renamed` });
    }
    if (isProtectedTitle(title)) {
      return res.status(403).json({ error: `"${title}" is reserved` });
    }
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { title } },
      { new: true }
    );
    return res.json({ note });
  }
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id, "bodies._id": bodyId },
    { $set: { "bodies.$.text": text } },
    { new: true }
  );
  res.json({ note });
};

const deleteNote = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (note && isProtectedTitle(note.title)) {
    return res.status(403).json({ error: `"${note.title}" cannot be deleted` });
  }
  await Note.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ success: "Record Deleted Successfully" });
};

const addBody = async (req, res) => {
  const { text } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $push: { bodies: { text } } },
    { new: true }
  );
  res.json({ note });
};

const deleteCheckedBodies = async (req, res) => {
  const { bodyIds } = req.body;
  const validIds = (bodyIds || []).filter(id => /^[0-9a-fA-F]{24}$/.test(id));
  if (!validIds.length) return res.json({ note: null });
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $pull: { bodies: { _id: { $in: validIds } } } },
    { new: true }
  );
  if (note && note.bodies.length === 0 && !isProtectedTitle(note.title)) {
    await Note.deleteOne({ _id: req.params.id, user: req.user._id });
    return res.json({ deleted: true });
  }
  res.json({ note });
};

module.exports = { fetchNote, fetchNotes, updateNote, createNote, deleteNote, addBody, deleteCheckedBodies };
