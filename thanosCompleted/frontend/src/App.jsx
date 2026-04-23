import "./App.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Index from "./components/Index";
import AuthPage from "./pages/AuthPage";
import DateDisplay from "./components/DateDisplay";
import SnapNoteBrand from "./components/SnapNoteBrand";
import ThemeToggle from "./components/ThemeToggle";
import Tutorial from "./components/Tutorial";
import { getUser, logOut, getToken } from "./utilities/users-service";

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function App() {
  const [user, setUser] = useState(getUser());
  // -------------------------------
  const [notes, setNotes] = useState([]);
  const [createForm, setCreateForm] = useState({
    title: "",
    body: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });
  const dragState = useRef({ dragging: false, startX: 0, startY: 0 });
  const modalPosRef = useRef({ x: 0, y: 0 });
  const dragHandleRef = useRef(null);

  useEffect(() => { if (showModal) { setModalPos({ x: 0, y: 0 }); modalPosRef.current = { x: 0, y: 0 }; } }, [showModal]);

  useEffect(() => { modalPosRef.current = modalPos; }, [modalPos]);

  const onDragStart = (clientX, clientY) => {
    const pos = modalPosRef.current;
    dragState.current = { dragging: true, startX: clientX - pos.x, startY: clientY - pos.y };
  };
  const onDragMove = (clientX, clientY) => {
    if (!dragState.current.dragging) return;
    setModalPos({ x: clientX - dragState.current.startX, y: clientY - dragState.current.startY });
  };
  const onDragEnd = () => { dragState.current.dragging = false; };

  useEffect(() => {
    const el = dragHandleRef.current;
    if (!el) return;
    const onTouchStart = (e) => { e.preventDefault(); onDragStart(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchMove = (e) => { e.preventDefault(); onDragMove(e.touches[0].clientX, e.touches[0].clientY); };
    const onTouchEnd = () => onDragEnd();
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [showModal]);
  // --------------------[State]

  // -------------------------------------[CREATE]
  const createNote = async (e) => {
    try {
      e.preventDefault();
      // 1. Create Note
      const res = await axios.post('/notes', createForm);
      // 1a.) Add 2nd arg to pass data , {}
      console.log("CreatedNote : ", res);

      // 2. Update State — replace existing card or add new one
      setNotes((prev) => {
        const exists = prev.find((n) => n._id === res.data.note._id);
        if (exists) {
          return prev.map((n) => n._id === res.data.note._id ? res.data.note : n);
        }
        return [...prev, res.data.note];
      });
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

  const updateNoteTitle = async (noteId, title) => {
    const res = await axios.put(`/notes/${noteId}`, { title });
    setNotes((prev) => prev.map((n) => (n._id === noteId ? res.data.note : n)));
  };

  const updateNote = async (noteId, bodyId, text) => {
    const res = await axios.put(`/notes/${noteId}`, { bodyId, text });
    setNotes((prev) => prev.map((n) => (n._id === noteId ? res.data.note : n)));
  };

  const deleteCheckedBodies = async (noteId, bodyIds) => {
    setNotes((prev) => prev.map((n) =>
      n._id === noteId
        ? { ...n, bodies: (n.bodies || []).filter(b => !bodyIds.includes(String(b._id))) }
        : n
    ).filter(n => n._id !== noteId || (n.bodies || []).length > 0 || n.title === "To Buy" || n.title === "Trash Bin"));
    try {
      const res = await axios.delete(`/notes/${noteId}/bodies`, { data: { bodyIds } });
      if (res.data.deleted) {
        setNotes((prev) => prev.filter(n => n._id !== noteId && n.title !== "To Buy" && n.title !== "Trash Bin"));
      } else {
        setNotes((prev) => prev.map(n => n._id === noteId ? res.data.note : n));
      }
    } catch {
      fetchNotes();
    }
  };

  const addBodyToNote = async (noteId, text) => {
    const tempId = `temp_${Date.now()}`;
    setNotes((prev) => prev.map((n) =>
      n._id === noteId ? { ...n, bodies: [...(n.bodies || []), { _id: tempId, text }] } : n
    ));
    try {
      const res = await axios.post(`/notes/${noteId}/bodies`, { text });
      setNotes((prev) => prev.map((n) => n._id === noteId ? res.data.note : n));
    } catch {
      setNotes((prev) => prev.map((n) =>
        n._id === noteId ? { ...n, bodies: (n.bodies || []).filter(b => b._id !== tempId) } : n
      ));
    }
  };
  // -------------------------------------[MOVE BODY between cards]
  const moveBody = async (srcNoteId, bodyId, text, destNoteId) => {
    if (srcNoteId === destNoteId) return;
    const tempId = `temp_${Date.now()}`;
    setNotes((prev) => prev.map((n) => {
      if (n._id === srcNoteId) return { ...n, bodies: (n.bodies || []).filter(b => String(b._id) !== String(bodyId)) };
      if (n._id === destNoteId) return { ...n, bodies: [...(n.bodies || []), { _id: tempId, text }] };
      return n;
    }));
    try {
      const addRes = await axios.post(`/notes/${destNoteId}/bodies`, { text });
      setNotes((prev) => prev.map((n) => n._id === destNoteId ? addRes.data.note : n));
      const delRes = await axios.delete(`/notes/${srcNoteId}/bodies`, { data: { bodyIds: [bodyId] } });
      if (delRes.data.deleted) {
        setNotes((prev) => prev.filter((n) => n._id !== srcNoteId));
      } else {
        setNotes((prev) => prev.map((n) => n._id === srcNoteId ? delRes.data.note : n));
      }
    } catch {
      fetchNotes();
    }
  };

  // -------------------------------------[DELETE]
  const deleteNote = async (_id) => {
    await axios.delete(`/notes/${_id}`);
    setNotes((prev) => prev.filter((n) => n._id !== _id));
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
          <div className="dashboard-sticky">
            <div className="brand-row">
              <ThemeToggle />
              <SnapNoteBrand />
            </div>
            <div className="dashboard-header">
              <button className="logout-btn" onClick={() => { logOut(); setUser(null); }}>Log Out</button>
              <div className="dashboard-header-center">
                <h1 className="dashboard-title">Dashboard</h1>
                <p className="dashboard-greeting">Welcome, {user.firstname} {user.lastname}</p>
              </div>
              <DateDisplay className="dashboard-date" />
            </div>

            <div className="dashboard-toolbar">
              <button className="tutorial-btn" onClick={() => setShowTutorial(true)}>Tutorial</button>
              <button className="new-note-btn" onClick={() => setShowModal(true)}>+ New Note</button>
            </div>
            {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
          </div>

          {showModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowModal(false)}
              onMouseMove={(e) => onDragMove(e.clientX, e.clientY)}
              onMouseUp={onDragEnd}
            >
              <div
                className="modal-card"
                style={{ transform: `translate(${modalPos.x}px, ${modalPos.y}px)` }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  ref={dragHandleRef}
                  className="modal-header modal-drag-handle"
                  onMouseDown={(e) => { e.preventDefault(); onDragStart(e.clientX, e.clientY); }}
                >
                  <h2 className="note-form-title">+ New Note</h2>
                  <button
                    className="modal-close"
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
                    onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); setShowModal(false); }}
                  >X</button>
                </div>
                <form onSubmit={async (e) => { await createNote(e); setShowModal(false); }}>
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

          <div className="notes-grid">
            {notes ? (
              <Index info={notes} deleteFunc={deleteNote} updateFunc={updateNote} updateTitleFunc={updateNoteTitle} addBodyFunc={addBodyToNote} deleteCheckedFunc={deleteCheckedBodies} moveBodyFunc={moveBody} />
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
