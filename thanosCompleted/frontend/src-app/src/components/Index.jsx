import React from "react";
import Note from "./Note";

function Index({ info, deleteFunc, updateFunc, addBodyFunc }) {
  const sorted = [...info].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      {sorted.map((note) => (
        <Note
          key={note._id}
          note={note}
          deleteFunc={deleteFunc}
          updateFunc={updateFunc}
          addBodyFunc={addBodyFunc}
        />
      ))}
    </>
  );
}

export default Index;
