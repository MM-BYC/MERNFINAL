import { useState, useEffect } from "react";

function Note({ note, updateFunc, updateTitleFunc, addBodyFunc, deleteCheckedFunc, moveBodyFunc }) {
  const isToBuy = note.title === "To Buy";
  const isToReturn = note.title === "To Return";
  const isTrashBin = note.title === "Trash Bin";
  const isLocked = isToBuy || isToReturn || isTrashBin;
  const isDraggableCard = true;

  const [bodies, setBodies] = useState({});
  const [checked, setChecked] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addingBody, setAddingBody] = useState(false);
  const [newBodyText, setNewBodyText] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(note.title);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setBodies(
      (note.bodies || []).reduce((acc, b) => ({ ...acc, [b._id]: b.text }), {})
    );
    setChecked({});
    setIsDirty(false);
  }, [note._id, note.bodies]);

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

  const handleTitleSave = () => {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== note.title) updateTitleFunc(note._id, trimmed);
    else setTitleValue(note.title);
    setEditingTitle(false);
  };

  const handleDragStart = (e, b) => {
    if (String(b._id).startsWith("temp_")) { e.preventDefault(); return; }
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
    } catch {
      return;
    }
  };

  return (
    <div
      className={`container${isToBuy ? " card-tobuy" : ""}${isTrashBin ? " card-bought" : ""}${addingBody ? " is-adding" : ""}${dragOver && isDraggableCard ? " drag-over" : ""}`}
      onDragOver={isDraggableCard ? handleDragOver : undefined}
      onDragLeave={isDraggableCard ? handleDragLeave : undefined}
      onDrop={isDraggableCard ? handleDrop : undefined}
    >
      <div className="card-header">
        {editingTitle ? (
          <input
            className="title-edit-input"
            value={titleValue}
            autoFocus
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSave();
              if (e.key === "Escape") { setTitleValue(note.title); setEditingTitle(false); }
            }}
          />
        ) : (
          <h2
            className={`titler${isToBuy ? " titler-tobuy" : ""}${isTrashBin ? " titler-bought" : ""}`}
            title={isLocked ? "" : "Click to edit title"}
            onClick={() => { if (!isLocked) { setTitleValue(note.title); setEditingTitle(true); } }}
            style={isLocked ? {} : { cursor: "pointer" }}
          >
            {note.title}
          </h2>
        )}
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

      {[...(note.bodies || [])].sort((a, b) => (bodies[a._id] ?? a.text).localeCompare(bodies[b._id] ?? b.text)).map((b) => (
        <div
          key={b._id}
          className={`note-body-item${isDraggableCard ? " draggable-item" : ""}`}
          draggable={isDraggableCard}
          onDragStart={isDraggableCard ? (e) => handleDragStart(e, b) : undefined}
          onDragOver={isDraggableCard ? handleDragOver : undefined}
          onDrop={isDraggableCard ? (e) => { e.stopPropagation(); handleDrop(e); } : undefined}
        >
          {isDraggableCard && (
            <span className="drag-handle">
              {Array.from({ length: 9 }).map((_, i) => <span key={i} className="drag-dot" />)}
            </span>
          )}
          <button
            className={`check-box${checked[b._id] ? " checked" : ""}`}
            onClick={() => toggleChecked(b._id)}
          >
            {checked[b._id] ? "X" : ""}
          </button>
          <input
            className={`body-editable${checked[b._id] || isTrashBin ? " body-checked" : ""}`}
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
