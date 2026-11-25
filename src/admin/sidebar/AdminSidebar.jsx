import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Ticket,
  BarChart3,
  CalendarDays,
  CalendarCheck,
  Building2,
  Users,
  Tags,
  Music2,
  Mic2,
  LockKeyhole,
  LogOut,
  ChevronDown,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

import "./AdminSidebar.css";

function AdminSidebar({ isOpen, onClose, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [salesOpen, setSalesOpen] = useState(true);
  const [eventsOpen, setEventsOpen] = useState(true);

  const closeSidebar = () => {
    if (onClose) onClose();
  };

  const handleGroupClick = (group) => {
    if (collapsed) {
      setCollapsed(false);

      if (group === "sales") setSalesOpen(true);
      if (group === "events") setEventsOpen(true);

      return;
    }

    if (group === "sales") setSalesOpen(!salesOpen);
    if (group === "events") setEventsOpen(!eventsOpen);
  };

  const eventLinks = [
    { name: "Events List", path: "/admin/events", icon: CalendarDays },
    { name: "Event Phases", path: "/admin/event-phases", icon: CalendarCheck },
    { name: "Clubs", path: "/admin/clubs", icon: Building2 },
    { name: "Club Managers", path: "/admin/club-managers", icon: Users },
    { name: "Category Management", path: "/admin/categories", icon: Tags },
    { name: "Genres Management", path: "/admin/genres", icon: Music2 },
  ];

  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      end
      title={collapsed ? children : ""}
      onClick={closeSidebar}
      className={({ isActive }) =>
        `mini-nav-link ${isActive ? "active" : ""}`
      }
    >
      <span className="mini-nav-icon">
        <Icon size={19} strokeWidth={1.8} />
      </span>

      <span className="mini-nav-label">{children}</span>

      <span className="mini-active-dot" />
    </NavLink>
  );

  return (
    <>
      {isOpen && (
        <div
          className="mini-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`mini-sidebar ${
          collapsed ? "collapsed" : ""
        } ${isOpen ? "mobile-open" : ""}`}
      >
        {/* BRAND HEADER */}
        <div className="mini-sidebar-header">
          <Link
            to="/admin/sales-report"
            className="mini-brand"
            onClick={closeSidebar}
            title="RIZZ TIX"
          >
            <div className="mini-brand-logo">
              <Ticket size={23} />
            </div>

            <div className="mini-brand-details">
              <h2>RIZZ<span>TIX</span></h2>
              <p>ADMIN PANEL</p>
            </div>
          </Link>

          <button
            className="mini-mobile-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        {/* COLLAPSE BUTTON */}
        <button
          className="mini-collapse-button"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <Menu size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

        {/* NAVIGATION */}
        <div className="mini-sidebar-scroll">

          <div className="mini-section-title">
            <span>OVERVIEW</span>
          </div>

          {/* SALES ANALYSIS */}
          <div className="mini-nav-group">
            <button
              className={`mini-parent-link ${
                salesOpen && !collapsed ? "expanded" : ""
              }`}
              onClick={() => handleGroupClick("sales")}
              title={collapsed ? "Sales Analysis" : ""}
            >
              <span className="mini-nav-icon">
                <BarChart3 size={19} />
              </span>

              <span className="mini-nav-label">
                Sales Analysis
              </span>

              <ChevronDown
                size={16}
                className={`mini-parent-chevron ${
                  salesOpen ? "rotated" : ""
                }`}
              />
            </button>

            <div
              className={`mini-submenu ${
                salesOpen && !collapsed ? "show" : ""
              }`}
            >
              <NavItem
                to="/admin/sales-report"
                icon={BarChart3}
              >
                Sales Report
              </NavItem>

              <NavItem
                to="/admin/event-end-report"
                icon={CalendarCheck}
              >
                Event End Report
              </NavItem>
            </div>
          </div>

          {/* EVENTS */}
          <div className="mini-nav-group">
            <button
              className={`mini-parent-link ${
                eventsOpen && !collapsed ? "expanded" : ""
              }`}
              onClick={() => handleGroupClick("events")}
              title={collapsed ? "Events" : ""}
            >
              <span className="mini-nav-icon">
                <CalendarDays size={19} />
              </span>

              <span className="mini-nav-label">
                Events
              </span>

              <ChevronDown
                size={16}
                className={`mini-parent-chevron ${
                  eventsOpen ? "rotated" : ""
                }`}
              />
            </button>

            <div
              className={`mini-submenu ${
                eventsOpen && !collapsed ? "show" : ""
              }`}
            >
              {eventLinks.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                >
                  {item.name}
                </NavItem>
              ))}
            </div>
          </div>

          <div className="mini-section-title mini-section-spaced">
            <span>MANAGEMENT</span>
          </div>

          <NavItem to="/admin/artists" icon={Mic2}>
            Artists
          </NavItem>

          <NavItem
            to="/admin/venue-booking"
            icon={Building2}
          >
            Venue & Table Booking
          </NavItem>

          <div className="mini-section-title mini-section-spaced">
            <span>SETTINGS</span>
          </div>

          <NavItem
            to="/admin/change-password"
            icon={LockKeyhole}
          >
            Change Password
          </NavItem>
        </div>

        {/* FOOTER */}
        <div className="mini-sidebar-footer">

          <button
            className="mini-logout-button"
            onClick={onLogout}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={19} />
            <span className="mini-nav-label">Logout</span>
          </button>

          <div className="mini-sidebar-status">
            <span className="mini-status-dot" />
            <span className="mini-status-text">
              System Online
            </span>
          </div>

        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;