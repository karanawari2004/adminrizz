import {
  ChevronDown,
  Grid2X2,
  LockKeyhole,
  LogOut,
  Mic2,
  Shield,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const eventLinks = [
  ["Events List", "/admin/events"],
  ["Event Phases", "/admin/event-phases"],
  ["Clubs", "/admin/clubs"],
  ["Club Managers (Invite)", "/admin/club-managers"],
  ["Category Management", "/admin/categories"],
  ["Genres Management", "/admin/genres"],
];

function NavigationLink({ to, children, className = "", onNavigate }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `admin-nav-child ${isActive ? "is-active" : ""} ${className}`
      }
      onClick={onNavigate}
      to={to}
    >
      {children}
    </NavLink>
  );
}

export default function AdminSidebar({ isOpen, onClose, onLogout }) {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Close admin navigation"
          className="admin-drawer-backdrop"
          onClick={onClose}
          type="button"
        />
      )}
      <aside className={`admin-sidebar ${isOpen ? "admin-sidebar-open" : ""}`}>
        <Link
          aria-label="Rizztix admin home"
          className="admin-logo"
          onClick={onClose}
          to="/admin/sales-report"
        >
          <span aria-hidden="true" className="admin-logo-lines">▤</span>
          <strong>RIZZ</strong><span>TIX</span>
        </Link>
        <nav aria-label="Admin navigation" className="admin-navigation">
          <p className="admin-nav-caption">Management</p>
          <div className="admin-nav-group">
            <div className="admin-nav-parent admin-nav-heading">
              <Grid2X2 size={17} />
              <span>Sales Analysis</span>
              <ChevronDown size={14} />
            </div>
            <NavigationLink onNavigate={onClose} to="/admin/sales-report">Sales Report</NavigationLink>
            <NavigationLink onNavigate={onClose} to="/admin/event-end-report">Event End Report</NavigationLink>
          </div>

          <div className="admin-nav-group">
            <div className="admin-nav-parent admin-nav-heading">
              <Grid2X2 size={17} />
              <span>Events</span>
              <ChevronDown size={14} />
            </div>
            {eventLinks.map(([label, path]) => (
              <NavigationLink key={path} onNavigate={onClose} to={path}>{label}</NavigationLink>
            ))}
          </div>

          <NavigationLink className="admin-nav-icon-link" onNavigate={onClose} to="/admin/artists">
            <Mic2 size={17} /><span>Artists</span>
          </NavigationLink>
          <NavigationLink className="admin-nav-icon-link" onNavigate={onClose} to="/admin/venue-booking">
            <Shield size={17} /><span>Venue &amp; Table Booking</span>
          </NavigationLink>

          <p className="admin-nav-caption admin-apps-caption">Apps</p>
          <NavigationLink className="admin-nav-icon-link" onNavigate={onClose} to="/admin/change-password">
            <LockKeyhole size={17} /><span>Change Password</span>
          </NavigationLink>
          <button className="admin-nav-parent admin-logout" onClick={onLogout} type="button">
            <LogOut size={18} /><span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
