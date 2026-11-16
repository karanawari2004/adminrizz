import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AdminHeading from "../AdminHeading";
import AdminModal from "../AdminModal";
import "./ManageCatalog.css";

export default function ManageCatalog({ title, placeholder, columns, rows, count, label, pageClass }) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const visibleRows = rows.filter((row) =>
    row.some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className={`admin-catalog-page ${pageClass}`}>
      <AdminHeading title={title} />
      <div className="admin-catalog-toolbar">
        <input onChange={(event) => setSearch(event.target.value)} placeholder={placeholder} value={search} />
        <button className="admin-primary-button" onClick={() => setShowAdd(true)} type="button"><Plus size={15} /> Add {label}</button>
      </div>
      <div className="admin-table-card">
        <table className="admin-table admin-catalog-table">
          <thead>
            <tr>{columns.map((column, index) => <th key={column}>{column}{index === 0 && count != null && <span className="admin-count">{count}</span>}</th>)}<th>Actions</th></tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={String(row[0])}>
                {row.map((value, index) => <td key={`${row[0]}-${index}`}>{value}</td>)}
                <td>
                  <button aria-label={`Edit ${row[0]}`} className="admin-icon-action" type="button"><Pencil size={18} /></button>
                  <button aria-label={`Delete ${row[0]}`} className="admin-icon-action delete" type="button"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {visibleRows.length === 0 && <tr><td className="admin-empty-row" colSpan={columns.length + 1}>No results found.</td></tr>}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <AdminModal
          description={`${label} management is a visual demo and is not connected to a backend.`}
          onClose={() => setShowAdd(false)}
          title={`Add ${label}`}
        />
      )}
    </div>
  );
}
