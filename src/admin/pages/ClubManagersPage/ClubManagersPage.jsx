
import { useState } from "react";
import AdminHeading from "../../AdminHeading";
import "./ClubManagersPage.css";

export default function ClubManagersPage() {
  const [club, setClub] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = (event) => {
    event.preventDefault();

    if (!club || !email.trim() || !name.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    setMessage(`Invitation prepared for ${name}.`);
    setEmail("");
    setName("");
  };

  const handleRefresh = () => {
    setMessage("Manager list refreshed.");
  };

  return (
    <div className="admin-club-managers-page">

      <AdminHeading
        title="Club Managers"
        section="Events"
        parent="Club Managers"
      />

      <div className="admin-managers-content">

        {/* CLUB SELECT */}
        <div className="admin-manager-club">
          <label htmlFor="club">Club</label>

          <select
            id="club"
            value={club}
            onChange={(e) => setClub(e.target.value)}
          >
            <option value="">Select A Club</option>
            <option value="Maushi">Maushi</option>
            <option value="Nesco">Nesco</option>
            <option value="Sunburn">Sunburn</option>
          </select>
        </div>

        {/* INVITE MANAGER */}
        <h2 className="admin-manager-heading">
          Invite Club Manager
        </h2>

        <form
          className="admin-manager-invite-form"
          onSubmit={handleInvite}
        >

          <div className="admin-manager-field">
            <label htmlFor="manager-email">
              Email Address
            </label>

            <input
              id="manager-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-manager-field">
            <label htmlFor="manager-name">
              Name
            </label>

            <input
              id="manager-name"
              type="text"
              placeholder="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-manager-invite-button"
            disabled={!club}
          >
            Send Invite
          </button>

        </form>

        {/* MESSAGE */}
        {message && (
          <p className="admin-manager-message" role="status">
            {message}
          </p>
        )}

        {/* MANAGERS */}
        <h2 className="admin-manager-list-heading">
          Managers For This Club
        </h2>

        <p className="admin-manager-empty">
          No Result Found!
        </p>

        {/* REFRESH */}
        <button
          type="button"
          className="admin-manager-refresh-button"
          onClick={handleRefresh}
        >
          Refresh
        </button>

      </div>
    </div>
  );
}
