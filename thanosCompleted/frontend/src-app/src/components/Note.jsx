import React, { useState, useEffect } from "react";

function Note({ note, deleteFunc, updateFunc }) {
  const [bodies, setBodies] = useState({});
  const [checked, setChecked] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBodies(
      (note.bodies || []).reduce((acc, b) => ({ ...acc, [b._id]: b.text }), {})
    );
    setChecked({});
    setIsDirty(false);
  }, [note._id, note.bodies?.length]);

  const handleBodyChange = (bodyId, value) => {
    setBodies((prev) => ({ ...prev, [bodyId]: value }));
    setIsDirty(true);
  };

  const toggleChecked = (bodyId) => {
    setChecked((prev) => ({ ...prev, [bodyId]: !prev[bodyId] }));
  };

  const handleSave = async () => {
    setSaving(true);
    for (const b of note.bodies || []) {
      if (bodies[b._id] !== b.text) {
        await updateFunc(note._id, b._id, bodies[b._id]);
      }
    }
    setSaving(false);
    setIsDirty(false);
  };

  return (
    <div className="container">
      <div className="card-header">
        <h2 className="titler">{note.title}</h2>
        <button className="card-delete-btn" onClick={() => deleteFunc(note._id)}>
          Delete
        </button>
      </div>

      {(note.bodies || []).map((b) => (
        <div key={b._id} className="note-body-item">
          <button
            className={`check-box${checked[b._id] ? " checked" : ""}`}
            onClick={() => toggleChecked(b._id)}
          >
            X
          </button>
          <input
            className={`body-editable${checked[b._id] ? " body-checked" : ""}`}
            type="text"
            value={bodies[b._id] ?? b.text}
            onChange={(e) => handleBodyChange(b._id, e.target.value)}
          />
        </div>
      ))}

      {isDirty && (
        <div className="card-footer">
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Note;
