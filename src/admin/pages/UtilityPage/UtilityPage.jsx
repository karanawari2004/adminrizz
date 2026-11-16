import { useState } from "react";
import AdminHeading from "../../AdminHeading";
import "./UtilityPage.css";

export default function UtilityPage({ title, section = "Apps" }) {
  const [submitted, setSubmitted] = useState(false);

  if (title === "Change Password") {
    return (
      <div className="admin-change-password-page">
        <AdminHeading title={title} section={section} />
        <form className="admin-utility-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
          <label>Current Password<input required type="password" /></label>
          <label>New Password<input required minLength="8" type="password" /></label>
          <label>Confirm Password<input required minLength="8" type="password" /></label>
          <button className="admin-primary-button" type="submit">Update Password</button>
          {submitted && <p className="admin-report-feedback" role="status">Password management is a visual demo and is not connected to authentication.</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-utility-page">
      <AdminHeading title={title} section="Management" />
      <section className="admin-utility-card">
        <h2>{title}</h2>
        <p>This section is available in the admin menu. Data and actions are demo-only.</p>
      </section>
    </div>
  );
}
