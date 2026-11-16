import { useState } from "react";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./sidebar/AdminSidebar";
import "./AdminLayout.css";
import "./components/AdminShared.css";

function AdminTopbar({ onMenuToggle, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="admin-topbar">
      <button
        aria-label="Toggle admin menu"
        className="admin-menu-toggle"
        onClick={onMenuToggle}
        type="button"
      >
        <Menu size={21} />
      </button>
      <button
        aria-expanded={profileOpen}
        className="admin-profile-button"
        onClick={() => setProfileOpen((open) => !open)}
        type="button"
      >
        System Admin <ChevronDown size={16} />
      </button>
      {profileOpen && (
        <div className="admin-profile-menu">
          <span>Signed in as</span>
          <strong>admin@example.com</strong>
          <button onClick={onLogout} type="button"><LogOut size={14} /> Logout</button>
        </div>
      )}
    </header>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  function logout() {
    navigate("/");
  }

  function toggleMenu() {
    setSidebarOpen((open) => !open);
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={logout}
      />
      <div className="admin-main">
        <AdminTopbar onLogout={logout} onMenuToggle={toggleMenu} />
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
}
