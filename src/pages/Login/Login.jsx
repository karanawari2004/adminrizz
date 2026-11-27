import { useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

/*
  Logo files: put both PNGs in your project's /public folder:
    public/rizztixx-logo-light-theme.png
    public/rizztixx-logo-dark-theme.png
  The CSS shows the right one for the current theme.
*/
const LOGO_LIGHT = "./rizztixx-logo-light-theme.png";
const LOGO_DARK = "./rizztixx-logo-dark-theme.png";

/* RIZZTIXX logo (light + dark versions) */
function RizzTixLogo() {
  return (
    <>
      <img
        src={LOGO_LIGHT}
        alt="rizztixx"
        className="rizztix-logo rizztix-logo-light"
      />
      <img
        src={LOGO_DARK}
        alt=""
        aria-hidden="true"
        className="rizztix-logo rizztix-logo-dark"
      />
    </>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Demo-only client-side check; use a backend for real authentication.
    if (
      email.trim().toLowerCase() === "admin@example.com" &&
      password === "Admin@123"
    ) {
      setError("");
      navigate("/admin");
      return;
    }

    setError("Invalid email or password.");
  };

  return (
    <main className="login-page">
      {/* Background Decorations */}
      <div className="bg-shape bg-shape-one"></div>
      <div className="bg-shape bg-shape-two"></div>
      <div className="bg-shape bg-shape-three"></div>

      <div className="bg-decoration decoration-one"></div>
      <div className="bg-decoration decoration-two"></div>

      {/* Logo */}
      <div className="login-logo">
        <RizzTixLogo />
      </div>

      {/* Login Card */}
      <section className="login-card">
        <div className="login-content">
          {/* Heading */}
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="login-input-group">
              <div className="login-input">
                <Mail size={25} />

                <input
                  type="email"
                  placeholder="Email Address"
                  aria-label="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-input-group">
              <div className="login-input">
                <LockKeyhole size={25} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  aria-label="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={23} /> : <EyeOff size={23} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />

                <span>Remember Me</span>
              </label>

              <a href="/forgot-password">Forgot Password?</a>
            </div>

            {/* Error */}
            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button type="submit" className="login-button">
              <span>Login</span>

              <ArrowRight size={25} />
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>
              Don't have an account?
              <a href="/contact-admin"> Contact Admin</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
