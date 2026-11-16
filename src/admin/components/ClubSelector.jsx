import "./ClubSelector.css";

export default function ClubSelector({ value, onChange }) {
  return (
    <section className="admin-club-card">
      <label htmlFor="admin-club">Club (Admin)</label>
      <select id="admin-club" onChange={(event) => onChange(event.target.value)} value={value}>
        <option>All Partners</option>
        <option>Belmarose</option>
        <option>High Energy Bar</option>
      </select>
      <p>Select a club to set the event date range and load sales.</p>
    </section>
  );
}
