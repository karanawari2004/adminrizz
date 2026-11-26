import { useState } from "react";
import {
  CalendarDays,
  Music,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import AdminHeading from "../../AdminHeading";
import "./GenresPage.css";

const INITIAL_GENRES = [
  {
    name: "Afrobeats",
    title: "Afrobeats Rhythm & Groove",
    description: "High-energy Afrobeats, Amapiano, and Afro-fusion nights.",
    events: 12,
  },
  {
    name: "Electronic",
    title: "Electronic Dance Experience",
    description: "Melodic electronic sets, synth-driven drops, and club visuals.",
    events: 48,
  },
  {
    name: "Hip Hop",
    title: "Hip Hop & Urban Beats",
    description: "Classic boom-bap, trap anthems, and live rap showcases.",
    events: 23,
  },
  {
    name: "House",
    title: "Deep & Tech House",
    description: "Groovy basslines, soulful vocals, and late-night house sessions.",
    events: 37,
  },
  {
    name: "Techno",
    title: "Underground Techno",
    description: "Driving industrial percussion and hypnotic peak-hour techno.",
    events: 42,
  },
];

const EMPTY_FORM = {
  name: "",
  title: "",
  description: "",
};

export default function GenresPage() {
  const [genres, setGenres] = useState(INITIAL_GENRES);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [editIndex, setEditIndex] = useState(-1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const query = search.trim().toLowerCase();
  const visibleGenres = genres
    .map((genre, index) => ({ genre, index }))
    .filter(({ genre }) =>
      `${genre.name} ${genre.title} ${genre.description} ${genre.events}`
        .toLowerCase()
        .includes(query),
    );

  const openAddModal = () => {
    setModalMode("add");
    setEditIndex(-1);
    setForm(EMPTY_FORM);
    setError("");
  };

  const openEditModal = (index) => {
    const selected = genres[index];
    setModalMode("edit");
    setEditIndex(index);
    setForm({
      name: selected.name,
      title: selected.title,
      description: selected.description,
    });
    setError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditIndex(-1);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const title = form.title.trim();
    const description = form.description.trim();

    if (!name) {
      setError("Please enter a genre name.");
      return;
    }

    if (!title) {
      setError("Please enter a title.");
      return;
    }

    if (!description) {
      setError("Please enter a description.");
      return;
    }

    const duplicate = genres.some(
      (item, idx) =>
        idx !== editIndex &&
        item.name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (duplicate) {
      setError(`Genre "${name}" already exists.`);
      return;
    }

    if (modalMode === "add") {
      setGenres((prev) => [
        { name, title, description, events: 0 },
        ...prev,
      ]);
      closeModal();
      return;
    }

    if (modalMode === "edit" && editIndex >= 0) {
      setGenres((prev) =>
        prev.map((item, idx) =>
          idx === editIndex
            ? { ...item, name, title, description }
            : item,
        ),
      );
      closeModal();
    }
  };

  const handleDelete = (index) => {
    setGenres((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="admin-genres-page">
      <AdminHeading section="Events" title="Genres Management" />

      <div className="admin-genres-toolbar">
        <div className="admin-genres-search">
          <Search aria-hidden="true" size={17} />
          <input
            aria-label="Search Genres"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Genres..."
            type="text"
            value={search}
          />
        </div>

        <button
          className="admin-primary-button"
          onClick={openAddModal}
          type="button"
        >
          <Plus size={16} />
          Add Genre
        </button>
      </div>

      <div className="admin-table-card">
        <table className="admin-table admin-genres-table">
          <thead>
            <tr>
              <th>
                <div className="admin-genres-th">
                  <Music aria-hidden="true" size={15} />
                  Genres
                  <span className="admin-count">{genres.length}</span>
                </div>
              </th>
              <th>Title</th>
              <th>Description</th>
              <th>No. Of Events</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {visibleGenres.map(({ genre, index }) => (
              <tr key={`${genre.name}-${index}`}>
                <td>
                  <div className="admin-genre-cell">
                    <div aria-hidden="true" className="admin-genre-icon">
                      <Music size={16} />
                    </div>
                    <strong>{genre.name}</strong>
                  </div>
                </td>

                <td className="admin-genre-title">{genre.title}</td>

                <td className="admin-genre-description">{genre.description}</td>

                <td>
                  <div className="admin-genre-events-pill">
                    <CalendarDays aria-hidden="true" size={14} />
                    {genre.events}
                  </div>
                </td>

                <td>
                  <div className="admin-genre-actions">
                    <button
                      aria-label={`Edit ${genre.name}`}
                      className="admin-icon-action"
                      onClick={() => openEditModal(index)}
                      title={`Edit ${genre.name}`}
                      type="button"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      aria-label={`Delete ${genre.name}`}
                      className="admin-icon-action delete"
                      onClick={() => handleDelete(index)}
                      title={`Delete ${genre.name}`}
                      type="button"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {visibleGenres.length === 0 && (
              <tr>
                <td className="admin-empty-row" colSpan={5}>
                  No genres match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalMode && (
        <div
          className="admin-genres-modal-overlay"
          onClick={closeModal}
          role="presentation"
        >
          <section
            aria-labelledby="genre-modal-title"
            aria-modal="true"
            className="admin-genres-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="admin-genres-modal-header">
              <div className="admin-genres-modal-title-wrap">
                <div aria-hidden="true" className="admin-genres-modal-icon">
                  <Music size={19} />
                </div>
                <div>
                  <h2 id="genre-modal-title">
                    {modalMode === "edit" ? "Edit Genre" : "Add Genre"}
                  </h2>
                  <p>
                    {modalMode === "edit"
                      ? "Update genre name, title, and description."
                      : "Enter genre name, title, and description."}
                  </p>
                </div>
              </div>

              <button
                aria-label="Close modal"
                className="admin-genres-modal-close"
                onClick={closeModal}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="admin-genres-modal-body">
                <div className="admin-genres-field">
                  <label htmlFor="genre-name-input">
                    Genre Name <b>*</b>
                  </label>
                  <input
                    autoFocus
                    id="genre-name-input"
                    onChange={(event) =>
                      handleFieldChange("name", event.target.value)
                    }
                    placeholder="e.g. Afro House"
                    type="text"
                    value={form.name}
                  />
                </div>

                <div className="admin-genres-field">
                  <label htmlFor="genre-title-input">
                    Title <b>*</b>
                  </label>
                  <input
                    id="genre-title-input"
                    onChange={(event) =>
                      handleFieldChange("title", event.target.value)
                    }
                    placeholder="e.g. Afro House & Tribal Beats"
                    type="text"
                    value={form.title}
                  />
                </div>

                <div className="admin-genres-field">
                  <label htmlFor="genre-description-input">
                    Description <b>*</b>
                  </label>
                  <textarea
                    id="genre-description-input"
                    onChange={(event) =>
                      handleFieldChange("description", event.target.value)
                    }
                    placeholder="Describe this music genre..."
                    rows={3}
                    value={form.description}
                  />
                </div>

                {error && (
                  <p className="admin-genres-error" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <div className="admin-genres-modal-footer">
                <button
                  className="admin-genres-cancel-btn"
                  onClick={closeModal}
                  type="button"
                >
                  Cancel
                </button>
                <button className="admin-primary-button" type="submit">
                  <Plus size={15} />
                  {modalMode === "edit" ? "Update Genre" : "Add Genre"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
