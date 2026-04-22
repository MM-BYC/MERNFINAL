import React from "react";
import Note from "./Note";

function Index({ info, deleteFunc, editFunc }) {
  // Group notes by title
  const groups = {};
  info.forEach((note) => {
    if (!groups[note.title]) groups[note.title] = [];
    groups[note.title].push(note);
  });

  // Sort titles A → Z
  const sortedTitles = Object.keys(groups).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <>
      {sortedTitles.map((title) => (
        <Note
          key={title}
          title={title}
          items={groups[title]}
          deleteFunc={deleteFunc}
          editFunc={editFunc}
        />
      ))}
    </>
  );
}

export default Index;
