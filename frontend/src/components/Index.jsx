import Note from "./Note";

function Index({ info, updateFunc, updateTitleFunc, addBodyFunc, deleteCheckedFunc, moveBodyFunc }) {
  const sorted = [...info].sort((a, b) => {
    if (a.title === "To Buy") return -1;
    if (b.title === "To Buy") return 1;
    if (a.title === "Trash Bin") return -1;
    if (b.title === "Trash Bin") return 1;
    if (a.title === "To Return") return -1;
    if (b.title === "To Return") return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <>
      {sorted.map((note) => (
        <Note
          key={note._id}
          note={note}
          updateFunc={updateFunc}
          updateTitleFunc={updateTitleFunc}
          addBodyFunc={addBodyFunc}
          deleteCheckedFunc={deleteCheckedFunc}
          moveBodyFunc={moveBodyFunc}
        />
      ))}
    </>
  );
}

export default Index;
