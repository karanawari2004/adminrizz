import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BarChart3,
  CalendarDays,
  CalendarCheck,
  Building2,
  Users,
  Tags,
  Music,
  Mic2,
  Armchair,
  KeyRound,
  LogOut,
  ChevronDown,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

import "./AdminSidebar.css";

/* =====================================================
   NAVIGATION ITEM
===================================================== */

function NavItem({ to, icon: Icon, label, collapsed, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      title={collapsed ? label : ""}
      className={({ isActive }) =>
        `mini-nav-link ${isActive ? "active" : ""}`
      }
    >
      <Icon size={18} strokeWidth={1.9} />
      <span>{label}</span>
    </NavLink>
  );
}

/* =====================================================
   SIDEBAR COMPONENT
===================================================== */

export default function AdminSidebar({
  isOpen,
  onClose,
  onLogout,
  onCollapseChange,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [salesOpen, setSalesOpen] = useState(true);
  const [eventsOpen, setEventsOpen] = useState(true);

  /* CLOSE MOBILE SIDEBAR */

  const closeSidebar = () => {
    if (onClose) {
      onClose();
    }
  };

  /* COLLAPSE / EXPAND SIDEBAR */

  const handleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;

      if (onCollapseChange) {
        onCollapseChange(next);
      }

      return next;
    });
  };

  /* SALES SUBMENU */

  const toggleSales = () => {
    if (collapsed) {
      setCollapsed(false);
      onCollapseChange?.(false);
      setSalesOpen(true);
      return;
    }

    setSalesOpen((prev) => !prev);
  };

  /* EVENTS SUBMENU */

  const toggleEvents = () => {
    if (collapsed) {
      setCollapsed(false);
      onCollapseChange?.(false);
      setEventsOpen(true);
      return;
    }

    setEventsOpen((prev) => !prev);
  };

  return (
    <>
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      <div
        className={`mini-sidebar-overlay ${
          isOpen ? "visible" : ""
        }`}
        onClick={closeSidebar}
      />

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`mini-sidebar
          ${collapsed ? "collapsed" : ""}
          ${isOpen ? "mobile-open" : ""}
        `}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mini-sidebar-header">

          <div className="mini-sidebar-brand">

            <div className="mini-sidebar-logo">
              <LayoutDashboard size={25} color="#60a5fa" />
            </div>

            <span>RIZZ TIX</span>

          </div>

          {/* DESKTOP COLLAPSE BUTTON */}

          <button
            type="button"
            className="mini-sidebar-toggle"
            onClick={handleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <Menu size={19} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>

          {/* MOBILE CLOSE BUTTON */}

          <button
            type="button"
            className="mini-sidebar-toggle mobile-close-btn"
            onClick={closeSidebar}
            title="Close sidebar"
          >
            <X size={20} />
          </button>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="mini-sidebar-scroll">

          {/* MAIN MENU */}

          <div className="mini-sidebar-section">

            <div className="mini-sidebar-section-title">
              MAIN MENU
            </div>

            {/* SALES ANALYSIS */}

            <button
              type="button"
              className="mini-sidebar-parent"
              onClick={toggleSales}
              title={collapsed ? "Sales Analysis" : ""}
            >
              <BarChart3 size={19} />

              <span>Sales Analysis</span>

              {!collapsed && (
                <ChevronDown
                  className={`chevron ${
                    salesOpen ? "rotated" : ""
                  }`}
                  size={16}
                />
              )}
            </button>

            {salesOpen && !collapsed && (
              <div className="mini-sidebar-submenu">

                <NavItem
                  to="/admin/sales-report"
                  icon={BarChart3}
                  label="Sales Report"
                  collapsed={collapsed}
                  onClick={closeSidebar}
                />

                <NavItem
                  to="/admin/event-end-report"
                  icon={CalendarCheck}
                  label="Event End Report"
                  collapsed={collapsed}
                  onClick={closeSidebar}
                />

              </div>
            )}

            {/* EVENTS */}

            <button
              type="button"
              className="mini-sidebar-parent"
              onClick={toggleEvents}
              title={collapsed ? "Events" : ""}
            >
              <CalendarDays size={19} />

              <span>Events</span>

              {!collapsed && (
                <ChevronDown
                  className={`chevron ${
                    eventsOpen ? "rotated" : ""
                  }`}
                  size={16}
                />
              )}
            </button>

            {eventsOpen && !collapsed && (
              <div className="mini-sidebar-submenu">

                <NavItem
                  to="/admin/events"
                  icon={CalendarDays}
                  label="Events List"
                  collapsed={collapsed}
                  onClick={closeSidebar}
                />

                <NavItem
                  to="/admin/event-phases"
                  icon={CalendarCheck}
                  label="Event Phases"
                  collapsed={collapsed}
                  onClick={closeSidebar}
                />

                <NavItem
                  to="/admin/clubs"
                  icon={Building2}
                  label="Clubs"
                  collapsed={collapsed}
                  onClick={closeSidebar}
                />

                <NavItem
                  to="/admin/club-managers"
                  icon={Users}
                  label="Club Managers"
                  collapsed={collapsed}
                  onClick={closeSidebar}
                />

                <NavItem
                  to="/admin/categories"
                  icon={Tags}
                  label="Catagory Management"
                  collapsed={collapsed}
                  onClick={closeSidebar}
                />

                <NavItem
                  to="/admin/genres"
                  icon={Music}
                  label="Genres Management"
                  collapsed={collapsed}
                  onClick={closeSidebar}
                />

              </div>
            )}

          </div>

          {/* MANAGEMENT */}

          <div className="mini-sidebar-section">

            <div className="mini-sidebar-section-title">
              MANAGEMENT
            </div>

            <NavItem
              to="/admin/artists"
              icon={Mic2}
              label="Artists"
              collapsed={collapsed}
              onClick={closeSidebar}
            />

            <NavItem
              to="/admin/venue-booking"
              icon={Armchair}
              label="Venue & Table Booking"
              collapsed={collapsed}
              onClick={closeSidebar}
            />

          </div>

          {/* SETTINGS */}

          <div className="mini-sidebar-section">

            <div className="mini-sidebar-section-title">
              SETTINGS
            </div>

            <NavItem
              to="/admin/change-password"
              icon={KeyRound}
              label="Change Password"
              collapsed={collapsed}
              onClick={closeSidebar}
            />

          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mini-sidebar-footer">

          <button
            type="button"
            className="mini-sidebar-logout"
            onClick={onLogout}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
}