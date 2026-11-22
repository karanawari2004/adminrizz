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

/* Barcode stripe thicknesses (top to bottom) */
const BAR_HEIGHTS = [3, 2, 4, 2, 3, 4, 2, 3, 2, 3, 4, 2, 3];

/* RIZZTIX ticket logo */
function RizzTixLogo({ className = "" }) {
  let y = 20;
  const bars = BAR_HEIGHTS.map((h, i) => {
    const bar = { key: i, y, h };
    y += h + 2;
    return bar;
  });

  return (
    <svg
      className={`rizztix-logo ${className}`}
      viewBox="0 0 240 100"
      role="img"
      aria-label="RIZZTIX"
    >
      {/* Ticket outline with notches on the divider */}
      <path
        d="M11 3 H62 A8 8 0 0 0 78 3 H229 Q237 3 237 11 V89 Q237 97 229 97 H78 A8 8 0 0 0 62 97 H11 Q3 97 3 89 V11 Q3 3 11 3 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Divider */}
      <path d="M70 11 V89" stroke="currentColor" strokeWidth="3" />

      {/* Barcode */}
      {bars.map((b) => (
        <rect
          key={b.key}
          x="15"
          y={b.y}
          width="43"
          height={b.h}
          fill="currentColor"
        />
      ))}

      {/* RIZZ (solid) */}
      <text
        x="84"
        y="71"
        fontSize="58"
        fontWeight="900"
        fontFamily="Montserrat, Poppins, 'Arial Black', Arial, sans-serif"
        fill="currentColor"
        textLength="88"
        lengthAdjust="spacingAndGlyphs"
      >
        RIZZ
      </text>

      {/* TIX (outline) */}
      <text
        x="174"
        y="71"
        fontSize="58"
        fontWeight="900"
        fontFamily="Montserrat, Poppins, 'Arial Black', Arial, sans-serif"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        textLength="58"
        lengthAdjust="spacingAndGlyphs"
      >
        TIX
      </text>
    </svg>
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
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <Eye size={23} />
                  ) : (
                    <EyeOff size={23} />
                  )}
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

              <a href="/forgot-password">
                Forgot Password?
              </a>

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