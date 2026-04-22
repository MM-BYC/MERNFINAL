import React, { useState, useEffect } from "react";

function Note({ note, deleteFunc, updateFunc, addBodyFunc, deleteCheckedFunc, moveBodyFunc }) {
  const isToBuy = note.title === "To Buy";
  const isBought = note.title === "Bought";
  const isDraggableCard = isToBuy || isBought;

  const [bodies, setBodies] = useState({});
  const [checked, setChecked] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addingBody, setAddingBody] = useState(false);
  const [newBodyText, setNewBodyText] = useState("");
  const [dragOver, setDragOver] = useState(false);

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

  const handleDragStart = (e, b) => {
    e.dataTransfer.setData("application/json", JSON.stringify({
      noteId: note._id,
      bodyId: String(b._id),
      text: bodies[b._id] ?? b.text,
    }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.noteId !== note._id) {
        moveBodyFunc(data.noteId, data.bodyId, data.text, note._id);
      }
    } catch {}
  };

  return (
    <div
      className={`container${addingBody ? " is-adding" : ""}${dragOver && isDraggableCard ? " drag-over" : ""}`}
      onDragOver={isDraggableCard ? handleDragOver : undefined}
      onDragLeave={isDraggableCard ? handleDragLeave : undefined}
      onDrop={isDraggableCard ? handleDrop : undefined}
    >
      <div className="card-header">
        <h2 className={`titler${isToBuy ? " titler-tobuy" : ""}${isBought ? " titler-bought" : ""}`}>{note.title}</h2>
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
        <div
          key={b._id}
          className={`note-body-item${isDraggableCard ? " draggable-item" : ""}`}
          draggable={isDraggableCard}
          onDragStart={isDraggableCard ? (e) => handleDragStart(e, b) : undefined}
        >
          {isDraggableCard && <span className="drag-handle">⠿</span>}
          <button
            className={`check-box${checked[b._id] ? " checked" : ""}`}
            onClick={() => toggleChecked(b._id)}
          >
            {checked[b._id] ? "X" : ""}
          </button>
          <input
            className={`body-editable${checked[b._id] || isBought ? " body-checked" : ""}`}
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
