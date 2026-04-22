import React from "react";

function Note({ title, items, deleteFunc, editFunc }) {
  return (
    <div className="container">
      <h2 className="titler">{title}</h2>
      {items.map((note) => (
        <div key={note._id} className="note-body-item">
          <p className="body">{note.body}</p>
          <div className="btnWrapper">
            <button onClick={() => editFunc(note)}>Edit</button>
            <button onClick={() => deleteFunc(note._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Note;
