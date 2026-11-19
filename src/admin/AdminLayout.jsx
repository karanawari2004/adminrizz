import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./sidebar/AdminSidebar";
import { PageTransition } from "../Components/MotionEffects";
import "./AdminLayout.css";
import "./components/AdminShared.css";

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
        <button
          aria-expanded={sidebarOpen}
          aria-label="Toggle admin menu"
          className="admin-mobile-menu-toggle"
          onClick={toggleMenu}
          type="button"
        >
          <Menu size={21} />
        </button>
        <main className="admin-content">
          <PageTransition><Outlet /></PageTransition>
        </main>
      </div>
    </div>
  );
}
