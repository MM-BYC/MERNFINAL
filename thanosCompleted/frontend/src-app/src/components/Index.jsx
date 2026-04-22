import React from "react";
import Note from "./Note";

function Index({ info, deleteFunc, updateFunc, addBodyFunc, deleteCheckedFunc }) {
  const sorted = [...info].sort((a, b) => {
    if (a.title === "To Buy") return -1;
    if (b.title === "To Buy") return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <>
      {sorted.map((note) => (
        <Note
          key={note._id}
          note={note}
          deleteFunc={deleteFunc}
          updateFunc={updateFunc}
          addBodyFunc={addBodyFunc}
          deleteCheckedFunc={deleteCheckedFunc}
        />
      ))}
    </>
  );
}

export default Index;
