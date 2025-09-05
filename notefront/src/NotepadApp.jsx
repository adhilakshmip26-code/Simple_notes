import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlus, FaTimes, FaTrash, FaBriefcase, FaUser, FaLightbulb, FaBell, FaNotesMedical } from "react-icons/fa";

export default function NotepadApp() {
  const [notes, setNotes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("ideas");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch Notes
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await fetch("https://simplenotes-production.up.railway.app/api/notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  }

  async function addNote(e) {
    e.preventDefault();
    const newNote = { title, content, tag, date: new Date().toISOString() };

    await fetch("https://simplenotes-production.up.railway.app/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });

    fetchNotes();
    setShowAddModal(false);
    setTitle("");
    setContent("");
    setTag("ideas");
  }

  async function deleteNote(id) {
    await fetch(`https://simplenotes-production.up.railway.app/api/notes/${id}`, {
      method: "DELETE",
    });
    fetchNotes();
    setShowConfirmModal(false);
  }

  function getTagIcon(tag) {
    const icons = {
      work: <FaBriefcase  />,
      personal: <FaUser />,
      ideas: <FaLightbulb />,
      reminders: <FaBell />,
    };
    return icons[tag] || "";
  }

  const filteredNotes = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )
    .filter((n) => (filter === "all" ? true : n.tag === filter))
    .reverse(); // Show newest first

  return (
    <div className="container py-4">
      {/* Header */}
      <header className="text-center mb-5">
        <h1 className="text-success fw-bold mb-3">Simple Notepad</h1>
        <p className="text-muted">
          Write your own thoughts and ideas in this website
        </p>
      </header>

      {/* Search + Filter */}
      <div className="bg-white rounded shadow p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control h-100"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All notes</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="ideas">Ideas</option>
              <option value="reminders">Reminders</option>
            </select>
            <button
              className="btn btn-success"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus className="me-1" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="notes-grid mb-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaNotesMedical size={50} className="mb-3" />
            <h3>No Notes</h3>
            <p>Add your first note by clicking the "Add" button</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="note-card bg-white rounded shadow p-3 mb-3">
              <div className="note-header d-flex justify-content-between align-items-center mb-2">
                <h5 className="note-title fw-bold">{note.title}</h5>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    setNoteToDelete(note.id);
                    setShowConfirmModal(true);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
              <p className="note-text">{note.content}</p>
              <div className="note d-flex justify-content-between mt-2">
                <span className="note-tag">
                  {getTagIcon(note.tag)} {note.tag}
                </span>
                <span className="note-date">
                  {new Date(note.date).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
          <div className="bg-white rounded shadow p-4" style={{ maxWidth: 500, width: "100%" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold">New Note</h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowAddModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={addNote}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Content</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tags</label>
                <div className="d-flex flex-wrap gap-2">
                  <label className="form-check-label text-primary">
                    <input
                      type="radio"
                      name="noteTag"
                      value="work"
                      checked={tag === "work"}
                      onChange={(e) => setTag(e.target.value)}
                    />{" "}
                    <FaBriefcase /> Work
                  </label>
                  <label className="form-check-label text-purple">
                    <input
                      type="radio"
                      name="noteTag"
                      value="personal"
                      checked={tag === "personal"}
                      onChange={(e) => setTag(e.target.value)}
                    />{" "}
                    <FaUser /> Personal
                  </label>
                  <label className="form-check-label text-danger">
                    <input
                      type="radio"
                      name="noteTag"
                      value="ideas"
                      checked={tag === "ideas"}
                      onChange={(e) => setTag(e.target.value)}
                    />{" "}
                    <FaLightbulb /> Ideas
                  </label>
                  <label className="form-check-label text-warning">
                    <input
                      type="radio"
                      name="noteTag"
                      value="reminders"
                      checked={tag === "reminders"}
                      onChange={(e) => setTag(e.target.value)}
                    />{" "}
                    <FaBell /> Reminders
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-success w-100">
                Save Note
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
          <div className="bg-white rounded shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
            <p className="text-center mb-3">Are you sure you want to delete this note?</p>
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => deleteNote(noteToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
