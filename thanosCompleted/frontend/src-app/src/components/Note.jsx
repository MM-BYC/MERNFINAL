import React, { useState, useEffect } from "react";

function Note({ note, deleteFunc, updateFunc, addBodyFunc, deleteCheckedFunc }) {
  const isToBuy = note.title === "To Buy";
  const [bodies, setBodies] = useState({});
  const [checked, setChecked] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addingBody, setAddingBody] = useState(false);
  const [newBodyText, setNewBodyText] = useState("");

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

  const handleAddBody = () => {
    if (!newBodyText.trim()) return;
    const text = newBodyText.trim();
    setNewBodyText("");
    setAddingBody(false);
    addBodyFunc(note._id, text);
  };

  return (
    <div className={`container${addingBody ? " is-adding" : ""}`}>
      <div className="card-header">
        <h2 className={`titler${note.title === "To Buy" ? " titler-tobuy" : ""}`}>{note.title}</h2>
        <button
          className="card-delete-btn"
          disabled={!Object.values(checked).some(Boolean)}
          onClick={() => {
            const ids = Object.entries(checked).filter(([, v]) => v).map(([k]) => k);
            deleteCheckedFunc(note._id, ids);
          }}
        >
          Delete
        </button>
      </div>

      {(note.bodies || []).map((b) => (
        <div key={b._id} className="note-body-item">
          <button
            className={`check-box${checked[b._id] ? " checked" : ""}${checked[b._id] && isToBuy ? " tobuy" : ""}`}
            onClick={() => toggleChecked(b._id)}
          >
            {checked[b._id] ? (isToBuy ? "✓" : "X") : ""}
          </button>
          <input
            className={`body-editable${checked[b._id] ? " body-checked" : ""}`}
            type="text"
            value={bodies[b._id] ?? b.text}
            onChange={(e) => handleBodyChange(b._id, e.target.value)}
          />
        </div>
      ))}

      {addingBody ? (
        <div className="add-body-row">
          <input
            className="add-body-input"
            type="text"
            value={newBodyText}
            onChange={(e) => setNewBodyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddBody();
              if (e.key === "Escape") { setAddingBody(false); setNewBodyText(""); }
            }}
            placeholder="New item..."
            autoFocus
          />
          <div className="add-body-actions">
            <button className="add-body-confirm" onClick={handleAddBody}>Add</button>
            <button className="add-body-cancel" onClick={() => { setAddingBody(false); setNewBodyText(""); }}>✕</button>
          </div>
        </div>
      ) : (
        <button className="add-body-btn" onClick={() => setAddingBody(true)}>+ Add Item</button>
      )}

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
