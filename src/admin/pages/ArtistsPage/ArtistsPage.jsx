
import { useRef, useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  X,
  Camera,
  Search,
  Bold,
  Italic,
  Underline,
  List,
} from "lucide-react";

import AdminHeading from "../../AdminHeading";
import { artists as initialArtists } from "../../data";
import "./ArtistsPage.css";

export default function ArtistsPage() {
  const [artistsList, setArtistsList] = useState(
    initialArtists.map((artist) => ({
      ...artist,
      instagram: artist.instagram || "",
      image: artist.image || "",
    }))
  );

  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    instagram: "",
    about: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const aboutRef = useRef(null);

  // Search artists
  const visibleArtists = artistsList.filter((artist) =>
    artist.name.toLowerCase().includes(search.toLowerCase())
  );

  // Open Add Artist Modal
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      instagram: "",
      about: "",
      image: "",
    });

    setImagePreview("");
    setEditingArtist(null);
    setError("");
    setShowAdd(true);
  };

  // Close Modal
  const handleClose = () => {
    setShowAdd(false);
    setEditingArtist(null);
    setError("");
  };

  // Input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
      e.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(imageUrl);
    setError("");
  };

  // Rich text editor formatting
  const handleFormat = (command) => {
    aboutRef.current?.focus();

    document.execCommand(command, false, null);

    if (aboutRef.current) {
      const html = aboutRef.current.innerHTML;

      setFormData((prev) => ({
        ...prev,
        about: html,
      }));
    }
  };

  // About Artist changes
  const handleAboutChange = () => {
    if (!aboutRef.current) return;

    const text = aboutRef.current.innerText;

    if (text.length > 500) {
      aboutRef.current.innerText = text.slice(0, 500);
    }

    setFormData((prev) => ({
      ...prev,
      about: aboutRef.current.innerHTML,
    }));

    setError("");
  };

  // Extract plain text from editor
  const getAboutText = () => {
    const div = document.createElement("div");
    div.innerHTML = formData.about;
    return div.textContent || div.innerText || "";
  };

  // Add / Update Artist
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter artist name.");
      return;
    }

    if (!getAboutText().trim()) {
      setError("Please enter about artist.");
      return;
    }

    if (!editingArtist && !formData.image) {
      setError("Please upload artist photo.");
      return;
    }

    if (
      formData.instagram.trim() &&
      !/^https?:\/\/(www\.)?instagram\.com\//i.test(
        formData.instagram.trim()
      )
    ) {
      setError("Please enter a valid Instagram URL.");
      return;
    }

    if (editingArtist) {
      setArtistsList((prev) =>
        prev.map((artist) =>
          artist.name === editingArtist.name
            ? {
                ...artist,
                name: formData.name.trim(),
                instagram: formData.instagram.trim(),
                about: formData.about,
                image: imagePreview || artist.image,
              }
            : artist
        )
      );
    } else {
      const newArtist = {
        name: formData.name.trim(),
        instagram: formData.instagram.trim(),
        about: formData.about,
        image: imagePreview,
        followers: 0,
      };

      setArtistsList((prev) => [...prev, newArtist]);
    }

    handleClose();
  };

  // Edit Artist
  const handleEdit = (artist) => {
    setEditingArtist(artist);

    setFormData({
      name: artist.name,
      instagram: artist.instagram || "",
      about: artist.about || "",
      image: artist.image || "",
    });

    setImagePreview(artist.image || "");
    setError("");
    setShowAdd(true);
  };

  // Delete Artist
  const handleDelete = (artistName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${artistName}?`
    );

    if (confirmDelete) {
      setArtistsList((prev) =>
        prev.filter((artist) => artist.name !== artistName)
      );
    }
  };

  return (
    <div className="admin-artists-page">

      <AdminHeading title="Artists" section="Artists" />

      <div className="admin-artists-content">

        {/* TOOLBAR */}
        <div className="admin-artists-toolbar">

          <div className="admin-artist-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search Artist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="admin-primary-button"
            onClick={handleOpenAdd}
            type="button"
          >
            <Plus size={16} />
            Add Artist
          </button>

        </div>

        {/* ARTISTS TABLE */}
        <div className="admin-table-card">

          <table className="admin-table admin-artists-table">

            <thead>
              <tr>
                <th>
                  Artists
                  <span className="admin-count">
                    {artistsList.length}
                  </span>
                </th>

                <th>About Artist</th>
                <th>No. Of Followers</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {visibleArtists.map((artist, index) => (

                <tr key={`${artist.name}-${index}`}>

                  <td>
                    <div className="admin-artist-cell">

                      <span className="admin-artist-avatar">
                        {artist.image ? (
                          <img
                            src={artist.image}
                            alt={artist.name}
                          />
                        ) : (
                          artist.name.slice(0, 1).toUpperCase()
                        )}
                      </span>

                      <strong>{artist.name}</strong>

                    </div>
                  </td>

                  <td>
                    {artist.about
                      ? artist.about.replace(/<[^>]*>/g, "")
                      : ""}
                  </td>

                  <td>{artist.followers || 0}</td>

                  <td>
                    <div className="admin-artist-actions">

                      <button
                        aria-label={`Edit ${artist.name}`}
                        className="admin-icon-action"
                        onClick={() => handleEdit(artist)}
                        type="button"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        aria-label={`Delete ${artist.name}`}
                        className="admin-icon-action delete"
                        onClick={() => handleDelete(artist.name)}
                        type="button"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>
                  </td>

                </tr>

              ))}

              {visibleArtists.length === 0 && (
                <tr>
                  <td className="admin-empty-row" colSpan="4">
                    No artists match your search.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* ADD / EDIT ARTIST MODAL */}
      {showAdd && (

        <div
          className="artist-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >

          <div
            className="artist-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="artist-modal-title"
          >

            {/* MODAL HEADER */}
            <div className="artist-modal-header">

              <h2 id="artist-modal-title">
                {editingArtist ? "Edit Artist" : "Add Artist"}
              </h2>

              <button
                className="artist-modal-close"
                onClick={handleClose}
                type="button"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}
            <form
              className="artist-modal-form"
              onSubmit={handleSubmit}
            >

              {/* IMAGE UPLOAD */}
              <div className="artist-form-group">

                <div
                  className="artist-upload-box"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >

                  {imagePreview ? (

                    <div className="artist-image-preview">

                      <img
                        src={imagePreview}
                        alt="Artist preview"
                      />

                      <span className="artist-change-image">
                        <Camera size={16} />
                      </span>

                    </div>

                  ) : (

                    <div className="artist-upload-placeholder">
                      <div className="artist-upload-icon">
                        <Camera size={25} />
                      </div>
                    </div>

                  )}

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />

                <p className="artist-upload-hint">
                  The Image Ratio Should Be 4:3 (Max. Image Size - 10 Mb)
                </p>

              </div>

              {/* ARTIST NAME */}
              <div className="artist-form-group">

                <label
                  className="artist-form-label"
                  htmlFor="artist-name"
                >
                  Artist Name <span>*</span>
                </label>

                <input
                  id="artist-name"
                  type="text"
                  name="name"
                  placeholder="Enter Artist Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* INSTAGRAM URL */}
              <div className="artist-form-group">

                <label
                  className="artist-form-label"
                  htmlFor="artist-instagram"
                >
                  Instagram URL (optional)
                </label>

                <input
                  id="artist-instagram"
                  type="url"
                  name="instagram"
                  placeholder="https://instagram.com/username"
                  value={formData.instagram}
                  onChange={handleChange}
                />

              </div>

              {/* ABOUT ARTIST */}
              <div className="artist-form-group">

                <label
                  className="artist-form-label"
                  htmlFor="artist-about"
                >
                  About Artist <span>*</span>
                </label>

                {/* RICH TEXT EDITOR */}
                <div className="artist-rich-editor">

                  <div className="artist-editor-toolbar">

                    <button
                      type="button"
                      title="Bold"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormat("bold")}
                    >
                      <Bold size={16} />
                    </button>

                    <button
                      type="button"
                      title="Italic"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormat("italic")}
                    >
                      <Italic size={16} />
                    </button>

                    <button
                      type="button"
                      title="Underline"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormat("underline")}
                    >
                      <Underline size={16} />
                    </button>

                    <button
                      type="button"
                      title="Bullet List"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleFormat("insertUnorderedList")}
                    >
                      <List size={17} />
                    </button>

                  </div>

                  <div
                    ref={aboutRef}
                    id="artist-about"
                    className="artist-about-editor"
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Enter description"
                    onInput={handleAboutChange}
                  />

                </div>

                <div className="artist-character-count">
                  {getAboutText().length}/500
                </div>

              </div>

              {/* ERROR */}
              {error && (
                <div className="artist-form-error">
                  {error}
                </div>
              )}

              {/* FOOTER */}
              <div className="artist-modal-footer">

                <button
                  className="artist-submit-button"
                  type="submit"
                >
                  {editingArtist ? "Update Artist" : "Add Artist"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
