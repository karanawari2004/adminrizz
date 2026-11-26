import { useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./sidebar/AdminSidebar";
import { PageTransition } from "../Components/MotionEffects";

import "./AdminLayout.css";
import "./components/AdminShared.css";
import "./AdminTheme.css";

export default function AdminLayout() {
  const [theme, setTheme] = useState(() => (
    typeof window !== "undefined" &&
    window.localStorage.getItem("rizztix-admin-theme") === "dark"
      ? "dark"
      : "light"
  ));

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = useNavigate();

  function logout() {
    navigate("/");
  }

  function toggleMenu() {
    setSidebarOpen((open) => !open);
  }

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";

    window.localStorage.setItem("rizztix-admin-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <div
      className={`admin-shell ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
      data-theme={theme}
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={logout}
        onCollapseChange={setSidebarCollapsed}
      />

      <div className="admin-main">

        {/* THEME BUTTON */}
        <button
          aria-label={`Switch to ${
            theme === "light" ? "dark" : "light"
          } mode`}
          aria-pressed={theme === "dark"}
          className="admin-theme-toggle"
          onClick={toggleTheme}
          type="button"
        >
          {theme === "light" ? (
            <Sun aria-hidden="true" size={18} />
          ) : (
            <Moon aria-hidden="true" size={18} />
          )}

          <span>
            {theme === "light" ? "Light mode" : "Dark mode"}
          </span>
        </button>

        {/* MOBILE MENU */}
        <button
          aria-expanded={sidebarOpen}
          aria-label="Toggle admin menu"
          className="admin-mobile-menu-toggle"
          onClick={toggleMenu}
          type="button"
        >
          <Menu size={21} />
        </button>

        {/* PAGE CONTENT */}
        <main className="admin-content">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>

      </div>
    </div>
  );
}