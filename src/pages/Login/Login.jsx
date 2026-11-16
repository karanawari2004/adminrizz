import { useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const DEMO_CREDENTIALS = {
  email: "admin@example.com",
  password: "Admin@123",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      navigate("/admin/sales-report");
      return;
    }

    setError("Incorrect email or password.");
  };

  return (
    <main className="login-page">

      <div className="bg-orbit bg-orbit-left" />
      <div className="bg-orbit bg-orbit-right" />
      <div className="bg-star star-one">✦</div>
      <div className="bg-star star-two">✦</div>

      <div className="login-logo">
        <div className="logo-ticket">
          <div className="logo-barcode">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <span key={item} />
            ))}
          </div>
        </div>
        <h1>RIZZ<span>TIX</span></h1>
      </div>

      <section className="login-card">

        <svg className="card-border-svg" viewBox="0 0 1000 1000"
          preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="ticketBorderGradient">
              <stop offset="0%" stopColor="#ff963e" />
              <stop offset="45%" stopColor="#ff552a" />
              <stop offset="100%" stopColor="#815675" />
            </linearGradient>
          </defs>
          <path
            d="M38 2 H962 Q998 2 998 38 V962 Q998 998 962 998 H38 Q2 998 2 962 V285 C2 265 29 265 29 245 C29 225 2 225 2 205 V38 Q2 2 38 2Z"
            fill="none"
            stroke="url(#ticketBorderGradient)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="login-header">
          <svg className="header-ticket-svg" viewBox="0 0 1000 190"
            preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="headerOrange">
                <stop offset="0%" stopColor="#f34a20" />
                <stop offset="48%" stopColor="#ff791e" />
                <stop offset="100%" stopColor="#ef431c" />
              </linearGradient>
            </defs>
            <path
              d="M35 2 H960 Q990 2 990 30 V36 C990 45 974 45 974 54 C974 63 990 63 990 72 V78 C990 87 974 87 974 96 C974 105 990 105 990 114 V120 C990 129 974 129 974 138 C974 147 990 147 990 156 V160 Q990 188 960 188 H55 Q35 188 35 166 V153 C35 137 8 137 8 120 C8 103 35 103 35 87 V25 Q35 2 58 2Z"
              fill="url(#headerOrange)"
            />
          </svg>

          <div className="header-content">
            <span className="login-tagline">HELLO</span>
            <h2>Welcome back</h2>
            <p>Sign in to continue</p>
          </div>

          <div className="header-stamp">RIZZ TIX <span>★</span></div>
          <div className="header-perforation" />

          <svg className="crowd-art" viewBox="0 0 500 125"
            preserveAspectRatio="none" aria-hidden="true">
            <g fill="#7d271d" opacity=".5">
              {Array.from({ length: 15 }, (_, i) => (
                <path
                  key={i}
                  d={`M${i * 34} 125 l6 -35 q7 -14 14 0 l7 35Z`}
                />
              ))}
            </g>
          </svg>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          <label htmlFor="login-email" className="field-label">
            <Mail size={19} />
            <span>Email address <b>*</b></span>
          </label>

          <div className="login-input">
            <Mail size={23} />
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="username"
              required
            />
          </div>

          <label htmlFor="login-password" className="field-label">
            <LockKeyhole size={19} />
            <span>Password <b>*</b></span>
          </label>

          <div className="login-input">
            <LockKeyhole size={23} />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
            >
              {showPassword ? <Eye size={21} /> : <EyeOff size={21} />}
            </button>
          </div>

          <div className="login-options">
            <label className="remember-option">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-button">
            <span>Sign in</span>
            <ArrowRight size={23} />
          </button>

          {error && <p className="login-error" role="alert">{error}</p>}

          <div className="login-security">
            <ShieldCheck size={18} />
            <span>Your information is kept secure</span>
          </div>

        </form>
      </section>
    </main>
  );
}