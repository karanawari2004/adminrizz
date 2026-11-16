import { useState } from "react";
import AdminHeading from "../../AdminHeading";
import "./ClubManagersPage.css";

export default function ClubManagersPage() {
  const [club, setClub] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function invite(event) {
    event.preventDefault();-
    setMessage(`Demo invite prepared for ${name} (${email}).`);
  }

  return (
    <div className="admin-club-managers-page">
      <AdminHeading title="Club Managers" section="Events" parent="Club Management" />
      <section className="admin-managers-form">
        <label className="admin-manager-club">
          Club
          <select onChange={(event) => setClub(event.target.value)} value={club}>
            <option value="">Select A Club</option><option>Maushi</option><option>Nesco</option><option>Sunburn</option>
          </select>
        </label>
        <h2>Invite Club Manager</h2>
        <form onSubmit={invite}>
          <label>Email Address<input onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
          <label>Name<input onChange={(event) => setName(event.target.value)} placeholder="Display Name" required value={name} /></label>
          <button className="admin-primary-button" disabled={!club} type="submit">Send Invite</button>
        </form>
        {message && <p className="admin-report-feedback" role="status">{message}</p>}
        <h2 className="admin-managers-list-title">Managers For This Club</h2>
        <p className="admin-no-result">No Result Found!</p>
        <button className="admin-primary-button" onClick={() => setMessage("Manager list refreshed.")} type="button">Refresh</button>
      </section>
    </div>
  );
}
