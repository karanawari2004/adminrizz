import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Globe,
  ImagePlus,
  LayoutGrid,
  Palette,
  Pencil,
  Percent,
  Plus,
  ReceiptText,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import AdminHeading from "../../AdminHeading";
import { clubs as seedClubs } from "../../data";
import "./ClubsPage.css";

const MINI_SITE_SECTIONS = [
  { key: "eventsIntro", label: "Events Page Intro" },
  { key: "ourServices", label: "Our Services" },
  { key: "cancellationRefund", label: "Cancellation & Refund" },
  { key: "termsConditions", label: "Terms & Conditions" },
  { key: "privacyPolicy", label: "Privacy Policy" },
  { key: "contactUs", label: "Contact Us" },
];

function createEmptyMiniSite() {
  return MINI_SITE_SECTIONS.reduce((acc, item) => {
    acc[item.key] = { title: "", content: "" };
    return acc;
  }, {});
}

function toSlug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidHex(value) {
  return /^#[0-9a-fA-F]{6}$/.test(String(value).trim());
}

const INITIAL_CLUBS = [
  {
    id: "bandra-gymkhana",
    name: "Bandra Gymkhana",
    slug: "bandra-gymkhana",
    status: "Active",
    primaryColor: "#0f172a",
    secondaryColor: "#ffffff",
    accentColor: "#2563eb",
    buttonStyle: "Rounded",
    tagline: "Iconic members & nightlife destination",
    logo: null,
    tableMdr: "1.75",
    tableGst: "5",
    gallery: [],
    billing: {
      displayName: "Bandra Gymkhana",
      legalName: "Bandra Gymkhana Hospitality Pvt Ltd",
      gstin: "27AABCB1234F1Z5",
      pan: "AABCB1234F",
    },
    miniSite: createEmptyMiniSite(),
  },
  ...seedClubs.map((club, index) => ({
    id: club.slug || `club-${index}`,
    name: club.name,
    slug: club.slug,
    status: "Active",
    primaryColor: index % 2 === 0 ? "#1e3a8a" : "#0f172a",
    secondaryColor: index % 2 === 0 ? "#eff6ff" : "#ffffff",
    accentColor: "#2563eb",
    buttonStyle: "Rounded",
    tagline: "",
    logo: null,
    tableMdr: "1.75",
    tableGst: "5",
    gallery: [],
    billing: {
      displayName: club.name,
      legalName: `${club.name} Hospitality LLP`,
      gstin: "27AAACR5055K1Z2",
      pan: "AAACR5055K",
    },
    miniSite: createEmptyMiniSite(),
  })),
];

function createEmptyForm() {
  return {
    name: "",
    slug: "",
    status: "Active",
    logo: null,
    primaryColor: "#2563eb",
    secondaryColor: "#ffffff",
    accentColor: "#1d4ed8",
    buttonStyle: "Rounded",
    tagline: "",
    tableMdr: "1.75",
    tableGst: "5",
    gallery: [],
    billing: {
      displayName: "",
      legalName: "",
      gstin: "",
      pan: "",
    },
    miniSite: createEmptyMiniSite(),
  };
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState(INITIAL_CLUBS);
  const [search, setSearch] = useState("");
  const [editorMode, setEditorMode] = useState(null); // "create" | "edit" | null
  const [editingId, setEditingId] = useState(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [form, setForm] = useState(createEmptyForm);
  const [error, setError] = useState("");
  const [catalogClub, setCatalogClub] = useState(null);

  const query = search.trim().toLowerCase();
  const visibleClubs = clubs.filter((club) =>
    `${club.name} ${club.slug} ${club.status} ${club.primaryColor} ${club.secondaryColor}`
      .toLowerCase()
      .includes(query),
  );

  const activeCount = clubs.filter((c) => c.status === "Active").length;

  const openCreateView = () => {
    setEditorMode("create");
    setEditingId(null);
    setSlugEdited(false);
    setAdvancedOpen(false);
    setForm(createEmptyForm());
    setError("");
  };

  const openEditView = (club) => {
    setEditorMode("edit");
    setEditingId(club.id);
    setSlugEdited(true);
    setAdvancedOpen(false);
    setForm({
      name: club.name,
      slug: club.slug,
      status: club.status,
      logo: club.logo,
      primaryColor: club.primaryColor,
      secondaryColor: club.secondaryColor,
      accentColor: club.accentColor || "#2563eb",
      buttonStyle: club.buttonStyle || "Rounded",
      tagline: club.tagline || "",
      tableMdr: club.tableMdr ?? "1.75",
      tableGst: club.tableGst ?? "5",
      gallery: [...(club.gallery || [])],
      billing: {
        displayName: club.billing?.displayName || club.name,
        legalName: club.billing?.legalName || "",
        gstin: club.billing?.gstin || "",
        pan: club.billing?.pan || "",
      },
      miniSite: {
        ...createEmptyMiniSite(),
        ...(club.miniSite || {}),
      },
    });
    setError("");
  };

  const closeEditor = () => {
    setEditorMode(null);
    setEditingId(null);
    setError("");
  };

  const handleNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugEdited ? prev.slug : toSlug(value),
      billing: {
        ...prev.billing,
        displayName: editorMode === "create" ? value : prev.billing.displayName,
      },
    }));
    if (error) setError("");
  };

  const handleSlugChange = (value) => {
    setSlugEdited(true);
    setForm((prev) => ({ ...prev, slug: toSlug(value) }));
    if (error) setError("");
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        logo: { name: file.name, url: String(reader.result) },
      }));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleGalleryUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remaining = Math.max(0, 10 - form.gallery.length);
    const chosen = files.slice(0, remaining);

    chosen.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => {
          if (prev.gallery.length >= 10) return prev;
          return {
            ...prev,
            gallery: [
              ...prev.gallery,
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                name: file.name,
                url: String(reader.result),
              },
            ],
          };
        });
      };
      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  const removeGalleryImage = (id) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((img) => img.id !== id),
    }));
  };

  const handleGalleryDrop = (targetIndex) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    setForm((prev) => {
      const next = [...prev.gallery];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      return { ...prev, gallery: next };
    });
    setDragIndex(null);
  };

  const updateBilling = (field, value) => {
    setForm((prev) => ({
      ...prev,
      billing: { ...prev.billing, [field]: value },
    }));
    if (error) setError("");
  };

  const updateMiniSite = (sectionKey, field, value) => {
    setForm((prev) => ({
      ...prev,
      miniSite: {
        ...prev.miniSite,
        [sectionKey]: {
          ...prev.miniSite[sectionKey],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const slug = toSlug(form.slug || name);

    if (!name) {
      setError("Club Name is required.");
      return;
    }
    if (!slug) {
      setError("URL Slug is required.");
      return;
    }
    if (!isValidHex(form.primaryColor) || !isValidHex(form.secondaryColor)) {
      setError("Primary Color and Secondary Color must be valid 6-digit hex codes (e.g. #2563eb).");
      return;
    }
    if (form.tableMdr === "" || form.tableGst === "") {
      setError("Table MDR % and Table GST % are required.");
      return;
    }
    if (!form.billing.legalName.trim()) {
      setError("Legal Business Name is required in Billing / Invoice Details.");
      return;
    }
    if (!form.billing.gstin.trim()) {
      setError("GSTIN is required in Billing / Invoice Details.");
      return;
    }
    if (!form.billing.pan.trim()) {
      setError("PAN is required in Billing / Invoice Details.");
      return;
    }

    const duplicateSlug = clubs.some(
      (club) => club.id !== editingId && club.slug === slug,
    );
    if (duplicateSlug) {
      setError(`A club with URL slug "${slug}" already exists.`);
      return;
    }

    const payload = {
      id: editingId || `${slug}-${Date.now()}`,
      name,
      slug,
      status: form.status,
      logo: form.logo,
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      accentColor: form.accentColor,
      buttonStyle: form.buttonStyle,
      tagline: form.tagline.trim(),
      tableMdr: form.tableMdr,
      tableGst: form.tableGst,
      gallery: form.gallery,
      billing: {
        displayName: form.billing.displayName.trim() || name,
        legalName: form.billing.legalName.trim(),
        gstin: form.billing.gstin.trim().toUpperCase(),
        pan: form.billing.pan.trim().toUpperCase(),
      },
      miniSite: form.miniSite,
    };

    if (editorMode === "create") {
      setClubs((prev) => [payload, ...prev]);
    } else {
      setClubs((prev) =>
        prev.map((club) => (club.id === editingId ? payload : club)),
      );
    }

    closeEditor();
  };

  const handleDelete = (id) => {
    setClubs((prev) => prev.filter((club) => club.id !== id));
  };

  return (
    <div className="admin-clubs-page">
      <AdminHeading
        parent="Club Management"
        section="Events"
        title="Club Management"
      />

      {!editorMode ? (
        <>
          {/* SUMMARY CARDS */}
          <div className="admin-clubs-stats">
            <div className="admin-club-stat-card">
              <div aria-hidden="true" className="admin-club-stat-icon">
                <Building2 size={20} />
              </div>
              <div className="admin-club-stat-info">
                <div className="admin-club-stat-label">Total Clubs</div>
                <strong>{clubs.length}</strong>
              </div>
            </div>

            <div className="admin-club-stat-card">
              <div aria-hidden="true" className="admin-club-stat-icon">
                <CheckCircle2 size={20} />
              </div>
              <div className="admin-club-stat-info">
                <div className="admin-club-stat-label">Active Partners</div>
                <strong>{activeCount}</strong>
              </div>
            </div>

            <div className="admin-club-stat-card">
              <div aria-hidden="true" className="admin-club-stat-icon">
                <Palette size={20} />
              </div>
              <div className="admin-club-stat-info">
                <div className="admin-club-stat-label">Branded Themes</div>
                <strong>{clubs.length}</strong>
              </div>
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="admin-clubs-toolbar">
            <div className="admin-clubs-search">
              <Search aria-hidden="true" size={17} />
              <input
                aria-label="Search Clubs"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Clubs..."
                type="text"
                value={search}
              />
            </div>

            <button
              className="admin-primary-button"
              onClick={openCreateView}
              type="button"
            >
              <Plus size={16} />
              Add Club
            </button>
          </div>

          {/* CLUBS TABLE */}
          <div className="admin-table-card">
            <table className="admin-table admin-clubs-table">
              <thead>
                <tr>
                  <th>
                    <div className="admin-clubs-th">
                      <Building2 aria-hidden="true" size={15} />
                      Club Name
                      <span className="admin-count">{clubs.length}</span>
                    </div>
                  </th>
                  <th>URL Slug</th>
                  <th>Status</th>
                  <th>Colors</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleClubs.map((club) => (
                  <tr key={club.id}>
                    <td>
                      <div className="admin-club-name-cell">
                        {club.logo?.url ? (
                          <img
                            alt={`${club.name} logo`}
                            className="admin-club-avatar-img"
                            src={club.logo.url}
                          />
                        ) : (
                          <div aria-hidden="true" className="admin-club-avatar">
                            {club.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <strong>{club.name}</strong>
                          {club.tagline && (
                            <div className="admin-club-subline">{club.tagline}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <code className="admin-club-slug">{club.slug}</code>
                    </td>

                    <td>
                      <div
                        className={`admin-club-status-pill ${
                          club.status === "Active" ? "is-active" : "is-inactive"
                        }`}
                      >
                        <i aria-hidden="true" />
                        {club.status}
                      </div>
                    </td>

                    <td>
                      <div className="admin-club-colors-cell">
                        <div
                          className="admin-color-swatch"
                          style={{ backgroundColor: club.primaryColor }}
                          title={`Primary: ${club.primaryColor}`}
                        />
                        <div
                          className="admin-color-swatch"
                          style={{ backgroundColor: club.secondaryColor }}
                          title={`Secondary: ${club.secondaryColor}`}
                        />
                        <code className="admin-color-codes">
                          {club.primaryColor} · {club.secondaryColor}
                        </code>
                      </div>
                    </td>

                    <td>
                      <div className="admin-club-actions">
                        <button
                          aria-label={`Edit ${club.name}`}
                          className="admin-icon-action"
                          onClick={() => openEditView(club)}
                          title={`Edit ${club.name}`}
                          type="button"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="admin-catalog-action-btn"
                          onClick={() => setCatalogClub(club)}
                          type="button"
                        >
                          <LayoutGrid size={14} />
                          Catalog
                        </button>

                        <button
                          aria-label={`Delete ${club.name}`}
                          className="admin-icon-action delete"
                          onClick={() => handleDelete(club.id)}
                          title={`Delete ${club.name}`}
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleClubs.length === 0 && (
                  <tr>
                    <td className="admin-empty-row" colSpan={5}>
                      No clubs match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* =====================================================
           CREATE / EDIT CLUB WORKSPACE (WHITE & BLUE THEME)
        ===================================================== */
        <form className="admin-club-editor" noValidate onSubmit={handleSubmit}>
          <div className="admin-club-editor-header">
            <div className="admin-club-editor-title">
              <button
                className="admin-club-back-btn"
                onClick={closeEditor}
                type="button"
              >
                <ArrowLeft size={16} />
                Back to Clubs
              </button>

              <div>
                <h2>
                  {editorMode === "create"
                    ? "Create Club"
                    : `Edit Club — ${form.name || "Club"}`}
                </h2>
                <p>
                  Configure club identity, brand theme colors, table fees,
                  branding gallery, GST billing, and mini-site pages.
                </p>
              </div>
            </div>

            <div className="admin-club-editor-top-actions">
              <button
                className="admin-club-cancel-btn"
                onClick={closeEditor}
                type="button"
              >
                Cancel
              </button>
              <button className="admin-primary-button" type="submit">
                <Plus size={16} />
                {editorMode === "create" ? "Create Club" : "Save Club"}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-club-error-banner" role="alert">
              {error}
            </div>
          )}

          <div className="admin-club-editor-grid">
            {/* SECTION 1: CLUB IDENTITY & BRANDING */}
            <section className="admin-club-section-card">
              <div className="admin-club-section-head">
                <div aria-hidden="true" className="admin-club-section-icon">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3>Club Identity &amp; Brand Colors</h3>
                  <p>Core public profile, logo, and theme color tokens.</p>
                </div>
              </div>

              <div className="admin-club-form-grid">
                <div className="admin-club-field">
                  <label htmlFor="club-name">
                    Club Name <b>*</b>
                  </label>
                  <input
                    id="club-name"
                    onChange={(event) => handleNameChange(event.target.value)}
                    placeholder="e.g. Bandra Gymkhana"
                    type="text"
                    value={form.name}
                  />
                </div>

                <div className="admin-club-field">
                  <label htmlFor="club-slug">
                    URL Slug <b>*</b>
                  </label>
                  <input
                    id="club-slug"
                    onChange={(event) => handleSlugChange(event.target.value)}
                    placeholder="e.g. bandra-gymkhana"
                    type="text"
                    value={form.slug}
                  />
                  <small>
                    Public URL preview: /clubs/{form.slug || "your-club-slug"}
                  </small>
                </div>

                <div className="admin-club-field">
                  <label htmlFor="club-status">Status</label>
                  <select
                    id="club-status"
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, status: event.target.value }))
                    }
                    value={form.status}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="admin-club-field">
                  <label>Logo</label>
                  <div className="admin-club-logo-row">
                    <div className="admin-club-logo-preview">
                      {form.logo?.url ? (
                        <img alt="Club logo preview" src={form.logo.url} />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>

                    <div className="admin-club-logo-controls">
                      <label className="admin-club-upload-btn">
                        <Upload size={15} />
                        Choose File
                        <input
                          accept="image/*"
                          hidden
                          onChange={handleLogoUpload}
                          type="file"
                        />
                      </label>

                      {form.logo && (
                        <button
                          className="admin-club-remove-btn"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, logo: null }))
                          }
                          type="button"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <small>
                    Upload an image file — it is saved automatically. Use Remove
                    to clear.
                  </small>
                </div>

                <div className="admin-club-field">
                  <label htmlFor="club-primary-hex">
                    Primary Color <b>*</b>
                  </label>
                  <div className="admin-club-color-row">
                    <input
                      aria-label="Pick primary color"
                      className="admin-club-color-picker"
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          primaryColor: event.target.value,
                        }))
                      }
                      type="color"
                      value={
                        isValidHex(form.primaryColor)
                          ? form.primaryColor
                          : "#2563eb"
                      }
                    />
                    <input
                      id="club-primary-hex"
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          primaryColor: event.target.value,
                        }))
                      }
                      placeholder="#2563eb"
                      type="text"
                      value={form.primaryColor}
                    />
                  </div>
                </div>

                <div className="admin-club-field">
                  <label htmlFor="club-secondary-hex">
                    Secondary Color <b>*</b>
                  </label>
                  <div className="admin-club-color-row">
                    <input
                      aria-label="Pick secondary color"
                      className="admin-club-color-picker"
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          secondaryColor: event.target.value,
                        }))
                      }
                      type="color"
                      value={
                        isValidHex(form.secondaryColor)
                          ? form.secondaryColor
                          : "#ffffff"
                      }
                    />
                    <input
                      id="club-secondary-hex"
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          secondaryColor: event.target.value,
                        }))
                      }
                      placeholder="#ffffff"
                      type="text"
                      value={form.secondaryColor}
                    />
                  </div>
                </div>
              </div>

              {/* LIVE THEME PREVIEW STRIP */}
              <div
                className="admin-club-theme-preview"
                style={{
                  borderColor: isValidHex(form.primaryColor)
                    ? form.primaryColor
                    : "#2563eb",
                  backgroundColor: isValidHex(form.secondaryColor)
                    ? form.secondaryColor
                    : "#ffffff",
                }}
              >
                <div>
                  <strong
                    style={{
                      color:
                        form.secondaryColor.toLowerCase() === "#000000"
                          ? "#ffffff"
                          : "#0f172a",
                    }}
                  >
                    Theme Preview: {form.name || "Your Club Name"}
                  </strong>
                  <span>/{form.slug || "club-slug"}</span>
                </div>
                <div
                  className="admin-club-preview-pill"
                  style={{
                    backgroundColor: isValidHex(form.primaryColor)
                      ? form.primaryColor
                      : "#2563eb",
                  }}
                >
                  Book Table
                </div>
              </div>
            </section>

            {/* SECTION 2: TABLE BOOKING FEES & ADVANCED BRANDING */}
            <section className="admin-club-section-card">
              <div className="admin-club-section-head">
                <div aria-hidden="true" className="admin-club-section-icon">
                  <Percent size={18} />
                </div>
                <div>
                  <h3>Table Booking Fees &amp; Advanced Branding</h3>
                  <p>Fee percentages and optional storefront styling.</p>
                </div>
              </div>

              <div className="admin-club-form-grid">
                <div className="admin-club-field">
                  <label htmlFor="club-mdr">
                    Table MDR % <b>*</b>
                  </label>
                  <input
                    id="club-mdr"
                    min="0"
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        tableMdr: event.target.value,
                      }))
                    }
                    step="0.01"
                    type="number"
                    value={form.tableMdr}
                  />
                  <small>
                    This percent applies to every table booking for this club.
                  </small>
                </div>

                <div className="admin-club-field">
                  <label htmlFor="club-gst">
                    Table GST % (Included In Table Price) <b>*</b>
                  </label>
                  <input
                    id="club-gst"
                    min="0"
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        tableGst: event.target.value,
                      }))
                    }
                    step="0.1"
                    type="number"
                    value={form.tableGst}
                  />
                  <small>
                    This GST is already inside the table price. It is not added
                    on top.
                  </small>
                </div>
              </div>

              <div className="admin-club-accordion">
                <button
                  aria-expanded={advancedOpen}
                  className="admin-club-accordion-btn"
                  onClick={() => setAdvancedOpen((prev) => !prev)}
                  type="button"
                >
                  <div className="admin-club-accordion-label">
                    <SlidersHorizontal size={16} />
                    Advanced Branding
                  </div>
                  {advancedOpen ? (
                    <ChevronDown size={17} />
                  ) : (
                    <ChevronRight size={17} />
                  )}
                </button>

                {advancedOpen && (
                  <div className="admin-club-accordion-body">
                    <div className="admin-club-form-grid">
                      <div className="admin-club-field">
                        <label htmlFor="club-accent">Accent Color</label>
                        <div className="admin-club-color-row">
                          <input
                            aria-label="Pick accent color"
                            className="admin-club-color-picker"
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                accentColor: event.target.value,
                              }))
                            }
                            type="color"
                            value={
                              isValidHex(form.accentColor)
                                ? form.accentColor
                                : "#1d4ed8"
                            }
                          />
                          <input
                            id="club-accent"
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                accentColor: event.target.value,
                              }))
                            }
                            type="text"
                            value={form.accentColor}
                          />
                        </div>
                      </div>

                      <div className="admin-club-field">
                        <label htmlFor="club-btn-style">Button Style</label>
                        <select
                          id="club-btn-style"
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              buttonStyle: event.target.value,
                            }))
                          }
                          value={form.buttonStyle}
                        >
                          <option value="Rounded">Rounded</option>
                          <option value="Pill">Pill</option>
                          <option value="Sharp">Sharp</option>
                        </select>
                      </div>

                      <div className="admin-club-field admin-club-field-full">
                        <label htmlFor="club-tagline">Public Page Tagline</label>
                        <input
                          id="club-tagline"
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              tagline: event.target.value,
                            }))
                          }
                          placeholder="Short subtitle shown on the public club page"
                          type="text"
                          value={form.tagline}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 3: BRANDING GALLERY */}
            <section className="admin-club-section-card">
              <div className="admin-club-section-head">
                <div aria-hidden="true" className="admin-club-section-icon">
                  <ImagePlus size={18} />
                </div>
                <div className="admin-club-section-grow">
                  <h3>Branding Gallery</h3>
                  <p>
                    Up to 10 images on your public club page. Select multiple
                    images at once, or drag to reorder — other photos slide into
                    place as you move one. New images are sent as Base64 on save.
                  </p>
                </div>
                <div className="admin-club-gallery-count">
                  {form.gallery.length} / 10 Images
                </div>
              </div>

              {form.gallery.length > 0 ? (
                <div className="admin-club-gallery-grid">
                  {form.gallery.map((img, idx) => (
                    <div
                      className="admin-club-gallery-item"
                      draggable
                      key={img.id}
                      onDragOver={(event) => event.preventDefault()}
                      onDragStart={() => setDragIndex(idx)}
                      onDrop={() => handleGalleryDrop(idx)}
                    >
                      <img alt={img.name} src={img.url} />
                      <button
                        aria-label={`Remove ${img.name}`}
                        className="admin-club-gallery-remove"
                        onClick={() => removeGalleryImage(img.id)}
                        type="button"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-club-gallery-empty">
                  No Gallery Images Yet.
                </div>
              )}

              <label
                className={`admin-club-add-images-btn${
                  form.gallery.length >= 10 ? " is-disabled" : ""
                }`}
              >
                <ImagePlus size={16} />
                Add Images
                <input
                  accept="image/*"
                  disabled={form.gallery.length >= 10}
                  hidden
                  multiple
                  onChange={handleGalleryUpload}
                  type="file"
                />
              </label>
            </section>

            {/* SECTION 4: BILLING / INVOICE DETAILS */}
            <section className="admin-club-section-card">
              <div className="admin-club-section-head">
                <div aria-hidden="true" className="admin-club-section-icon">
                  <ReceiptText size={18} />
                </div>
                <div>
                  <h3>
                    Billing / Invoice Details <b>*</b>
                  </h3>
                  <p>
                    Required for GST invoices sent to customers after ticket
                    purchase. Not shown on your public club website.
                  </p>
                </div>
              </div>

              <div className="admin-club-form-grid">
                <div className="admin-club-field">
                  <label htmlFor="billing-display-name">Club Display Name</label>
                  <input
                    disabled={editorMode === "edit"}
                    id="billing-display-name"
                    onChange={(event) =>
                      updateBilling("displayName", event.target.value)
                    }
                    placeholder="Auto-filled from Club Name"
                    type="text"
                    value={form.billing.displayName}
                  />
                  <small>Set at club creation; cannot be changed here.</small>
                </div>

                <div className="admin-club-field">
                  <label htmlFor="billing-legal-name">
                    Legal Business Name <b>*</b>
                  </label>
                  <input
                    id="billing-legal-name"
                    onChange={(event) =>
                      updateBilling("legalName", event.target.value)
                    }
                    placeholder="Registered legal name"
                    type="text"
                    value={form.billing.legalName}
                  />
                  <small>
                    As on GST registration; can differ from display name.
                  </small>
                </div>

                <div className="admin-club-field">
                  <label htmlFor="billing-gstin">
                    GSTIN <b>*</b>
                  </label>
                  <input
                    id="billing-gstin"
                    maxLength={15}
                    onChange={(event) =>
                      updateBilling("gstin", event.target.value.toUpperCase())
                    }
                    placeholder="e.g. 27AABCU9603R1ZM"
                    type="text"
                    value={form.billing.gstin}
                  />
                </div>

                <div className="admin-club-field">
                  <label htmlFor="billing-pan">
                    PAN <b>*</b>
                  </label>
                  <input
                    id="billing-pan"
                    maxLength={10}
                    onChange={(event) =>
                      updateBilling("pan", event.target.value.toUpperCase())
                    }
                    placeholder="e.g. AABCU9603R"
                    type="text"
                    value={form.billing.pan}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 5: MINI-SITE PAGES */}
            <section className="admin-club-section-card">
              <div className="admin-club-section-head">
                <div aria-hidden="true" className="admin-club-section-icon">
                  <Globe size={18} />
                </div>
                <div>
                  <h3>Mini-site Pages</h3>
                  <p>
                    Customize public page titles and content for this club&apos;s
                    microsite.
                  </p>
                </div>
              </div>

              <div className="admin-club-minisite-grid">
                {MINI_SITE_SECTIONS.map((page) => (
                  <div className="admin-club-minisite-card" key={page.key}>
                    <div className="admin-club-minisite-head">
                      <FileText aria-hidden="true" size={15} />
                      <strong>{page.label}</strong>
                    </div>

                    <input
                      aria-label={`${page.label} Page Title`}
                      onChange={(event) =>
                        updateMiniSite(page.key, "title", event.target.value)
                      }
                      placeholder="Page Title"
                      type="text"
                      value={form.miniSite[page.key]?.title || ""}
                    />

                    <textarea
                      aria-label={`${page.label} Page Content`}
                      onChange={(event) =>
                        updateMiniSite(page.key, "content", event.target.value)
                      }
                      placeholder="Page Content"
                      rows={4}
                      value={form.miniSite[page.key]?.content || ""}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="admin-club-editor-footer">
            <button
              className="admin-club-cancel-btn"
              onClick={closeEditor}
              type="button"
            >
              Cancel
            </button>
            <button className="admin-primary-button" type="submit">
              <Plus size={16} />
              {editorMode === "create" ? "Create Club" : "Save Club"}
            </button>
          </div>
        </form>
      )}

      {/* CLUB CATALOG OVERVIEW MODAL */}
      {catalogClub && (
        <div
          className="admin-club-modal-overlay"
          onClick={() => setCatalogClub(null)}
          role="presentation"
        >
          <section
            aria-labelledby="club-catalog-title"
            aria-modal="true"
            className="admin-club-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="admin-club-modal-head">
              <div className="admin-club-modal-title">
                <div aria-hidden="true" className="admin-club-section-icon">
                  <LayoutGrid size={18} />
                </div>
                <div>
                  <h2 id="club-catalog-title">{catalogClub.name} — Catalog</h2>
                  <p>Slug: /{catalogClub.slug}</p>
                </div>
              </div>

              <button
                aria-label="Close catalog overview"
                className="admin-club-modal-close"
                onClick={() => setCatalogClub(null)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-club-modal-body">
              <div className="admin-club-catalog-grid">
                <div className="admin-club-catalog-item">
                  <span>Brand Colors</span>
                  <div className="admin-club-colors-cell">
                    <div
                      className="admin-color-swatch"
                      style={{ backgroundColor: catalogClub.primaryColor }}
                    />
                    <div
                      className="admin-color-swatch"
                      style={{ backgroundColor: catalogClub.secondaryColor }}
                    />
                    <code>
                      {catalogClub.primaryColor} / {catalogClub.secondaryColor}
                    </code>
                  </div>
                </div>

                <div className="admin-club-catalog-item">
                  <span>Table Fees</span>
                  <strong>
                    MDR {catalogClub.tableMdr}% · GST {catalogClub.tableGst}%
                  </strong>
                </div>

                <div className="admin-club-catalog-item">
                  <span>Legal Entity</span>
                  <strong>
                    {catalogClub.billing?.legalName || catalogClub.name}
                  </strong>
                </div>

                <div className="admin-club-catalog-item">
                  <span>GSTIN / PAN</span>
                  <strong>
                    {catalogClub.billing?.gstin || "—"} /{" "}
                    {catalogClub.billing?.pan || "—"}
                  </strong>
                </div>

                <div className="admin-club-catalog-item">
                  <span>Branding Gallery</span>
                  <strong>{catalogClub.gallery?.length || 0} / 10 Images</strong>
                </div>

                <div className="admin-club-catalog-item">
                  <span>Mini-site Pages</span>
                  <strong>
                    {
                      MINI_SITE_SECTIONS.filter(
                        (s) =>
                          catalogClub.miniSite?.[s.key]?.title ||
                          catalogClub.miniSite?.[s.key]?.content,
                      ).length
                    }{" "}
                    / {MINI_SITE_SECTIONS.length} Configured
                  </strong>
                </div>
              </div>
            </div>

            <div className="admin-club-modal-footer">
              <button
                className="admin-club-cancel-btn"
                onClick={() => setCatalogClub(null)}
                type="button"
              >
                Close
              </button>
              <button
                className="admin-primary-button"
                onClick={() => {
                  const target = catalogClub;
                  setCatalogClub(null);
                  openEditView(target);
                }}
                type="button"
              >
                <Pencil size={15} />
                Edit Club
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
