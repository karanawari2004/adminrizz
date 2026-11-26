import { useState } from "react";
import { Pencil, Plus, Search, Tags, Trash2, X } from "lucide-react";
import AdminHeading from "../AdminHeading";
import "./ManageCatalog.css";

function toSlug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

export default function ManageCatalog({
  title,
  placeholder,
  columns,
  rows,
  count,
  label,
  pageClass,
  section = "Events",
  headerIcon: HeaderIcon = Tags,
  renderPrimaryCell,
  renderSecondaryCell,
  secondaryInputLabel,
  secondaryInputPlaceholder,
  summaryCards,
  onItemsChange,
}) {
  const [items, setItems] = useState(rows);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [editIndex, setEditIndex] = useState(-1);
  const [nameInput, setNameInput] = useState("");
  const [secondaryInput, setSecondaryInput] = useState("");
  const [error, setError] = useState("");

  const updateItems = (nextItems) => {
    setItems(nextItems);
    if (onItemsChange) {
      onItemsChange(nextItems);
    }
  };

  const baseCount = count != null ? count : rows.length;
  const displayCount = Math.max(0, baseCount + (items.length - rows.length));

  const visibleEntries = items
    .map((row, index) => ({ row, index }))
    .filter(({ row }) =>
      row.some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase()),
      ),
    );

  const openAddModal = () => {
    setModalMode("add");
    setEditIndex(-1);
    setNameInput("");
    setSecondaryInput("");
    setError("");
  };

  const openEditModal = (index) => {
    const row = items[index];
    setModalMode("edit");
    setEditIndex(index);
    setNameInput(String(row[0] ?? ""));
    setSecondaryInput(row[1] != null ? String(row[1]) : "");
    setError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditIndex(-1);
    setNameInput("");
    setSecondaryInput("");
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = nameInput.trim();

    if (!trimmed) {
      setError(`Please enter a ${label.toLowerCase()} name.`);
      return;
    }

    const duplicate = items.some(
      (row, idx) =>
        idx !== editIndex &&
        String(row[0]).trim().toLowerCase() === trimmed.toLowerCase(),
    );

    if (duplicate) {
      setError(`${label} "${trimmed}" already exists.`);
      return;
    }

    if (modalMode === "add") {
      let newRow;
      if (columns.length === 3) {
        newRow = [trimmed, toSlug(trimmed), "Active"];
      } else if (columns.length === 2) {
        const parsedCount =
          secondaryInput.trim() === ""
            ? 0
            : Math.max(0, Number.parseInt(secondaryInput, 10) || 0);
        newRow = [trimmed, parsedCount];
      } else {
        newRow = [trimmed];
      }

      updateItems([newRow, ...items]);
      closeModal();
      return;
    }

    if (modalMode === "edit" && editIndex >= 0) {
      const updated = items.map((row, idx) => {
        if (idx !== editIndex) return row;

        if (columns.length === 3) {
          return [trimmed, toSlug(trimmed), row[2] ?? "Active"];
        }

        if (columns.length === 2) {
          const parsedCount =
            secondaryInput.trim() === ""
              ? Number(row[1]) || 0
              : Math.max(0, Number.parseInt(secondaryInput, 10) || 0);
          return [trimmed, parsedCount];
        }

        return [trimmed, ...row.slice(1)];
      });

      updateItems(updated);
      closeModal();
    }
  };

  const handleDelete = (index) => {
    updateItems(items.filter((_, idx) => idx !== index));
  };

  const computedSummary =
    typeof summaryCards === "function" ? summaryCards(items) : summaryCards;

  return (
    <div className={`admin-catalog-page ${pageClass}`}>
      <AdminHeading section={section} title={title} />

      {Array.isArray(computedSummary) && computedSummary.length > 0 && (
        <div className="admin-catalog-stats">
          {computedSummary.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <div className="admin-catalog-stat-card" key={stat.label}>
                <div className="admin-catalog-stat-icon" aria-hidden="true">
                  {StatIcon && <StatIcon size={20} />}
                </div>
                <div className="admin-catalog-stat-info">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="admin-catalog-toolbar">
        <div className="admin-catalog-search">
          <Search aria-hidden="true" size={17} />
          <input
            aria-label={placeholder}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={placeholder}
            value={search}
          />
        </div>

        <button
          className="admin-primary-button"
          onClick={openAddModal}
          type="button"
        >
          <Plus size={16} />
          Add {label}
        </button>
      </div>

      <div className="admin-table-card">
        <table className="admin-table admin-catalog-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={column}>
                  <span className="admin-th-inner">
                    {index === 0 && HeaderIcon && (
                      <HeaderIcon aria-hidden="true" size={15} />
                    )}
                    {column}
                    {index === 0 && count != null && (
                      <span className="admin-count">{displayCount}</span>
                    )}
                  </span>
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleEntries.map(({ row, index }) => (
              <tr key={`${String(row[0])}-${index}`}>
                {row.map((value, cellIndex) => (
                  <td key={`${row[0]}-${cellIndex}`}>
                    {cellIndex === 0 && renderPrimaryCell
                      ? renderPrimaryCell(value, row)
                      : cellIndex === 1 && renderSecondaryCell
                        ? renderSecondaryCell(value, row)
                        : value}
                  </td>
                ))}
                <td>
                  <button
                    aria-label={`Edit ${row[0]}`}
                    className="admin-icon-action"
                    onClick={() => openEditModal(index)}
                    title={`Edit ${row[0]}`}
                    type="button"
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    aria-label={`Delete ${row[0]}`}
                    className="admin-icon-action delete"
                    onClick={() => handleDelete(index)}
                    title={`Delete ${row[0]}`}
                    type="button"
                  >
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            ))}
            {visibleEntries.length === 0 && (
              <tr>
                <td className="admin-empty-row" colSpan={columns.length + 1}>
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalMode && (
        <div
          className="catalog-modal-overlay"
          onClick={closeModal}
          role="presentation"
        >
          <section
            aria-labelledby="catalog-modal-title"
            aria-modal="true"
            className="catalog-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="catalog-modal-header">
              <div className="catalog-modal-title-wrap">
                <div className="catalog-modal-icon" aria-hidden="true">
                  {HeaderIcon && <HeaderIcon size={20} />}
                </div>
                <div>
                  <h2 id="catalog-modal-title">
                    {modalMode === "edit" ? `Edit ${label}` : `Add ${label}`}
                  </h2>
                  <p>
                    {modalMode === "edit"
                      ? `Update the ${label.toLowerCase()} details below.`
                      : `Create a new ${label.toLowerCase()} for your events catalog.`}
                  </p>
                </div>
              </div>

              <button
                aria-label="Close modal"
                className="catalog-modal-close"
                onClick={closeModal}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="catalog-modal-body">
                <div className="catalog-modal-field">
                  <label htmlFor="catalog-item-name">
                    {label} Name <span>*</span>
                  </label>
                  <input
                    autoFocus
                    id="catalog-item-name"
                    onChange={(event) => {
                      setNameInput(event.target.value);
                      if (error) setError("");
                    }}
                    placeholder={`Enter ${label.toLowerCase()} name`}
                    type="text"
                    value={nameInput}
                  />
                </div>

                {columns.length === 2 && secondaryInputLabel && (
                  <div className="catalog-modal-field">
                    <label htmlFor="catalog-item-secondary">
                      {secondaryInputLabel}
                    </label>
                    <input
                      id="catalog-item-secondary"
                      min="0"
                      onChange={(event) => setSecondaryInput(event.target.value)}
                      placeholder={secondaryInputPlaceholder || "0"}
                      type="number"
                      value={secondaryInput}
                    />
                  </div>
                )}

                {error && (
                  <p className="catalog-error" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <div className="catalog-modal-footer">
                <button
                  className="catalog-cancel-button"
                  onClick={closeModal}
                  type="button"
                >
                  Cancel
                </button>
                <button className="admin-primary-button" type="submit">
                  <Plus size={15} />
                  {modalMode === "edit" ? `Update ${label}` : `Add ${label}`}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
