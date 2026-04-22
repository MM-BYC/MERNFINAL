import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Index from "./components/Index";
import AuthPage from "./pages/AuthPage";
import { getUser, logOut } from "./utilities/users-service";
function App() {
  const [user, setUser] = useState(getUser());
  // -------------------------------
  const [notes, setNotes] = useState([]);
  const [createForm, setCreateForm] = useState({
    title: "",
    body: "",
  });

  const [updateForm, setUpdateForm] = useState({
    _id: null,
    title: "",
    body: "",
  });
  const [showModal, setShowModal] = useState(false);
  // --------------------[State]

  // -------------------------------------[CREATE]
  const createNote = async (e) => {
    try {
      e.preventDefault();
      // 1. Create Note
      const res = await axios.post('/notes', createForm);
      // 1a.) Add 2nd arg to pass data , {}
      console.log("CreatedNote : ", res);

      // 2. Update State
      setNotes(() => [res.data.note, ...notes]);
      // adds note to notes array in state.
      // ------------------------------------------
      // Clear Form state
      setCreateForm(() => ({
        title: "",
        body: "",
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // -------------------------------------[READ]
  const fetchNotes = async () => {
    try {
      //  1.Make Request
      const response = await axios.get('/notes');
      const info = await response.data;
      // 2. Save as State
      await setNotes(info.notes);
      console.log("Notes FETCHED");
    } catch (error) {
      console.log(error);
    }
  };
  // -------------------------------------[UPDATE]
  const updateCreateFormField = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });
    // Destructure Values from event target
    setCreateForm(() => ({
      ...createForm,
      [name]: value,
      //[whatever var name is equal to ]: value is reassigned
    }));
    // update State
  };

  const handleUpdateFieldChange = (e) => {
    const { value, name } = e.target;
    // Destructure Values from event target
    setUpdateForm(() => ({
      ...updateForm,
      [name]: value,
      //[whatever var name is equal to ]: value is reassigned
    }));
  };

  const toggleUpdate = (note) => {
    // 1. Get the current note (_id) vals
    console.log("Current Note : ", note);
    // 2. Set state on update form
    setUpdateForm({
      _id: note._id,
      title: note.title,
      body: note.body,
    });
  };

  const updateNote = async (e) => {
    e.preventDefault();
    // Destructure Note
    const { title, body } = updateForm;
    // Send the update request by using the updateForm state
    const res = await axios.put(
      `/notes/${updateForm._id}`,
      { title, body }
    );
    console.log(res);

    // Update State
    const newNotes = [...notes];

    const noteIndex = notes.findIndex((note) => {
      return note._id === updateForm._id;
      // Find Note by Index in Arr by seeing if they match
    });

    newNotes[noteIndex] = res.data.note;
    // reassigning value of Note
    setNotes(newNotes);

    setUpdateForm({
      _id: null,
      title: "",
      body: "",
    });
    // Clear Form so form_reuse
  };
  // -------------------------------------[DELETE]
  const deleteNote = async (_id) => {
    // 1. Delete Note
    const res = await axios.delete(`/notes/${_id}`);
    console.log(res);
    // 2. UpdateState

    const newNotes = [...notes].filter((note) => {
      return note._id !== _id;
      // return all notes EXCEPT this one with :current _id
    });
    setNotes(newNotes);
    // update Notes in state
  };
  // ----------------------------------------{{useEffect}}
  useEffect(() => {
    fetchNotes();
  }, [user]);

  return (
    <div className="App">
      {!user && <AuthPage setUser={setUser} />}

      {user && (
        <>
          <div className="dashboard-header">
            <div className="dashboard-header-center">
              <h1 className="dashboard-title">Notes Dashboard</h1>
              <p className="dashboard-greeting">Welcome, {user.firstname} {user.lastname}</p>
            </div>
            <button className="logout-btn" onClick={() => { logOut(); setUser(null); }}>Log Out</button>
          </div>

          <div className="dashboard-toolbar">
            <button className="new-note-btn" onClick={() => setShowModal(true)}>+ New Note</button>
          </div>

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="note-form-title">+ New Note</h2>
                  <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                <form onSubmit={(e) => { createNote(e); setShowModal(false); }}>
                  <div className="note-field">
                    <label>Title</label>
                    <input
                      name="title"
                      value={createForm.title}
                      onChange={updateCreateFormField}
                      placeholder="Note title"
                    />
                  </div>
                  <div className="note-field">
                    <label>Body</label>
                    <input
                      name="body"
                      value={createForm.body}
                      onChange={updateCreateFormField}
                      placeholder="Note body"
                    />
                  </div>
                  <button className="note-submit-btn" type="submit">Add Note</button>
                </form>
              </div>
            </div>
          )}

          {updateForm._id && (
            <div className="modal-overlay" onClick={() => setUpdateForm({ _id: null, title: "", body: "" })}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="note-form-title">Edit Note</h2>
                  <button className="modal-close" onClick={() => setUpdateForm({ _id: null, title: "", body: "" })}>✕</button>
                </div>
                <form onSubmit={updateNote}>
                  <div className="note-field">
                    <label>Title</label>
                    <input
                      name="title"
                      value={updateForm.title}
                      placeholder="Enter Title"
                      onChange={handleUpdateFieldChange}
                    />
                  </div>
                  <div className="note-field">
                    <label>Body</label>
                    <input
                      name="body"
                      value={updateForm.body}
                      placeholder="Enter Body"
                      onChange={handleUpdateFieldChange}
                    />
                  </div>
                  <button className="note-submit-btn" type="submit">Save Changes</button>
                </form>
              </div>
            </div>
          )}

          <div className="notes-grid">
            {notes ? (
              <Index info={notes} deleteFunc={deleteNote} editFunc={toggleUpdate} />
            ) : (
              <p>No notes yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
