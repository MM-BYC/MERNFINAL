import React, { useState, useEffect } from "react";

function Note({ title, items, deleteFunc, updateFunc }) {
  const [bodies, setBodies] = useState({});
  const [checked, setChecked] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBodies(items.reduce((acc, n) => ({ ...acc, [n._id]: n.body }), {}));
    setChecked({});
    setIsDirty(false);
  }, [items]);

  const handleBodyChange = (id, value) => {
    setBodies((prev) => ({ ...prev, [id]: value }));
    setIsDirty(true);
  };

  const toggleChecked = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    setSaving(true);
    for (const note of items) {
      if (bodies[note._id] !== note.body) {
        await updateFunc(note._id, title, bodies[note._id]);
      }
    }
    setSaving(false);
    setIsDirty(false);
  };

  const handleDelete = () => {
    items.forEach((note) => deleteFunc(note._id));
  };

  return (
    <div className="container">
      <div className="card-header">
        <h2 className="titler">{title}</h2>
        <button className="card-delete-btn" onClick={handleDelete}>Delete</button>
      </div>

      {items.map((note) => (
        <div key={note._id} className="note-body-item">
          <button
            className={`check-box${checked[note._id] ? " checked" : ""}`}
            onClick={() => toggleChecked(note._id)}
          >
            {checked[note._id] ? "✕" : ""}
          </button>
          <input
            className={`body-editable${checked[note._id] ? " body-checked" : ""}`}
            type="text"
            value={bodies[note._id] ?? note.body}
            onChange={(e) => handleBodyChange(note._id, e.target.value)}
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
