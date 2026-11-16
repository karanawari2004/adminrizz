import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AdminHeading from "../../AdminHeading";
import AdminModal from "../../AdminModal";
import { artists } from "../../data";
import "./ArtistsPage.css";

export default function ArtistsPage() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const visibleArtists = artists.filter((artist) => artist.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-artists-page">
      <AdminHeading title="Artists" section="Artists" />
      <div className="admin-artists-content">
        <div className="admin-artists-toolbar">
          <input onChange={(e) => setSearch(e.target.value)} placeholder="Search Artist..." value={search} />
          <button className="admin-primary-button" onClick={() => setShowAdd(true)} type="button"><Plus size={15} /> Add Artist</button>
        </div>
        <div className="admin-table-card">
          <table className="admin-table admin-artists-table">
            <thead><tr><th>Artists <span className="admin-count">71</span></th><th>About Artist</th><th>No. Of Followers</th><th>Actions</th></tr></thead>
            <tbody>
              {visibleArtists.map((artist) => (
                <tr key={artist.name}>
                  <td><div className="admin-artist-cell"><span aria-hidden="true">{artist.name.slice(0, 1)}</span><strong>{artist.name}</strong></div></td>
                  <td>{artist.about}</td><td>0</td>
                  <td><button aria-label={`Edit ${artist.name}`} className="admin-icon-action" type="button"><Pencil size={18} /></button><button aria-label={`Delete ${artist.name}`} className="admin-icon-action delete" type="button"><Trash2 size={18} /></button></td>
                </tr>
              ))}
              {visibleArtists.length === 0 && <tr><td className="admin-empty-row" colSpan="4">No artists match your search.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showAdd && (
        <AdminModal
          description="Artist management is a visual demo and is not connected to a backend."
          onClose={() => setShowAdd(false)}
          title="Add Artist"
        />
      )}
    </div>
  );
}
