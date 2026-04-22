import React from "react";
import Note from "./Note";

function Index({ info, deleteFunc, updateFunc }) {
  const sorted = [...info].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      {sorted.map((note) => (
        <Note
          key={note._id}
          note={note}
          deleteFunc={deleteFunc}
          updateFunc={updateFunc}
        />
      ))}
    </>
  );
}

export default Index;
