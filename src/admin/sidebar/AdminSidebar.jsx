import { useState } from "react";

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
  const [salesOpen, setSalesOpen] = useState(true);
  const [eventsOpen, setEventsOpen] = useState(true);

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

      <aside
        className={`admin-sidebar ${
          isOpen ? "admin-sidebar-open" : ""
        }`}
      >
        {/* Logo */}
        <Link
          aria-label="Rizztix admin home"
          className="admin-logo"
          onClick={onClose}
          to="/admin/sales-report"
        >
          <span aria-hidden="true" className="admin-logo-lines">
            ▤
          </span>

          <strong>RIZZ</strong>
          <span>TIX</span>
        </Link>

        <nav aria-label="Admin navigation" className="admin-navigation">

          <p className="admin-nav-caption">Management</p>

          {/* SALES ANALYSIS */}
          <div className="admin-nav-group">

            <button
              className={`admin-nav-heading ${
                salesOpen ? "menu-expanded" : ""
              }`}
              onClick={() => setSalesOpen(!salesOpen)}
              type="button"
              aria-expanded={salesOpen}
            >
              <Grid2X2 size={18} />

              <span>Sales Analysis</span>

              <ChevronDown
                className="admin-chevron"
                size={16}
              />
            </button>

            <div className={`admin-submenu ${salesOpen ? "submenu-open" : ""}`}>
              <div className="admin-submenu-inner">

                <NavigationLink
                  onNavigate={onClose}
                  to="/admin/sales-report"
                >
                  Sales Report
                </NavigationLink>

                <NavigationLink
                  onNavigate={onClose}
                  to="/admin/event-end-report"
                >
                  Event End Report
                </NavigationLink>

              </div>
            </div>
          </div>

          {/* EVENTS */}
          <div className="admin-nav-group">

            <button
              className={`admin-nav-heading ${
                eventsOpen ? "menu-expanded" : ""
              }`}
              onClick={() => setEventsOpen(!eventsOpen)}
              type="button"
              aria-expanded={eventsOpen}
            >
              <Grid2X2 size={18} />

              <span>Events</span>

              <ChevronDown
                className="admin-chevron"
                size={16}
              />
            </button>

            <div className={`admin-submenu ${eventsOpen ? "submenu-open" : ""}`}>
              <div className="admin-submenu-inner">

                {eventLinks.map(([label, path]) => (
                  <NavigationLink
                    key={path}
                    onNavigate={onClose}
                    to={path}
                  >
                    {label}
                  </NavigationLink>
                ))}

              </div>
            </div>
          </div>

          {/* ARTISTS */}
          <NavigationLink
            className="admin-nav-icon-link"
            onNavigate={onClose}
            to="/admin/artists"
          >
            <Mic2 size={18} />
            <span>Artists</span>
          </NavigationLink>

          {/* VENUE */}
          <NavigationLink
            className="admin-nav-icon-link"
            onNavigate={onClose}
            to="/admin/venue-booking"
          >
            <Shield size={18} />
            <span>Venue &amp; Table Booking</span>
          </NavigationLink>

          {/* APPS */}
          <p className="admin-nav-caption admin-apps-caption">
            Apps
          </p>

          <NavigationLink
            className="admin-nav-icon-link"
            onNavigate={onClose}
            to="/admin/change-password"
          >
            <LockKeyhole size={18} />
            <span>Change Password</span>
          </NavigationLink>

          {/* LOGOUT */}
          <button
            className="admin-nav-parent admin-logout"
            onClick={onLogout}
            type="button"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </nav>
      </aside>
    </>
  );
}