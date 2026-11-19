import { useState } from "react";
import AdminHeading from "../../AdminHeading";
import "./UtilityPage.css";

export default function UtilityPage({ title, section = "Apps" }) {
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (formData.newPassword === formData.currentPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setSubmitted(true);
    setError("");
  };

  if (title === "Change Password") {
    return (
      <div className="admin-utility-page">
        <AdminHeading title={title} section={section} />

        <div className="utility-content">
          <section className="utility-card password-card">

            <div className="utility-card-header">
              <div className="utility-icon">🔐</div>

              <div>
                <h2>Change Your Password</h2>
                <p>
                  Update your account password to keep your account secure.
                </p>
              </div>

              <span className="utility-badge">SECURITY</span>
            </div>

            <div className="utility-divider"></div>

            <form className="utility-form" onSubmit={handleSubmit}>

              <div className="utility-form-group">
                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="utility-form-group">
                <label htmlFor="newPassword">
                  New Password
                </label>

                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  minLength={8}
                  required
                />

                <small>Minimum 8 characters required.</small>
              </div>

              <div className="utility-form-group">
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                  required
                />
              </div>

              {error && (
                <div className="utility-message utility-error" role="alert">
                  ⚠️ {error}
                </div>
              )}

              {submitted && (
                <div className="utility-message utility-success" role="status">
                  ✓ Password validation successful. Connect this form to your
                  authentication API to update the password.
                </div>
              )}

              <button className="utility-submit-button" type="submit">
                <span>🔒</span>
                Update Password
              </button>

            </form>

            <div className="utility-security-note">
              <span>🛡️</span>
              <p>
                For better security, use a strong password that you don't use
                on other websites.
              </p>
            </div>

          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-utility-page">
      <AdminHeading title={title} section="Management" />

      <div className="utility-content">
        <section className="utility-card">

          <div className="utility-card-header">
            <div className="utility-icon">⚙️</div>

            <div>
              <h2>{title}</h2>
              <p>
                Manage and configure your {title?.toLowerCase()} settings.
              </p>
            </div>

            <span className="utility-badge">MANAGEMENT</span>
          </div>

          <div className="utility-divider"></div>

          <div className="utility-empty-state">
            <div className="utility-empty-icon">📋</div>

            <h3>{title}</h3>

            <p>
              This section is ready for configuration. Features and data
              management can be connected here.
            </p>

            <span className="utility-status">
              ● Available in Admin Menu
            </span>
          </div>

        </section>
      </div>
    </div>
  );
}