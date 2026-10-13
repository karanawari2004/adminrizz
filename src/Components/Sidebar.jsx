
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  House,
  CalendarDays,
  Utensils,
  CalendarCheck,
  Mail,
  UserRound,
  ArrowUpRight,
  X,
} from "lucide-react";
import "./Sidebar.css";

const menuItems = [
  { number: "I", label: "HOME", path: "/", Icon: House },
  { number: "II", label: "EVENINGS", path: "/evenings", Icon: CalendarDays },
  { number: "III", label: "THE MENU", path: "/menu", Icon: Utensils },
  {
    number: "IV",
    label: "PRIVATE EVENTS",
    path: "/private-events",
    Icon: CalendarCheck,
  },
  { number: "V", label: "CONTACT", path: "/contact", Icon: Mail },
  {
    number: "VI",
    label: "MY ACCOUNT",
    path: "/my-account",
    Icon: UserRound,
  },
];

function MenuIcon({ isOpen }) {
  return isOpen ? <X size={22} /> : (
    <span className="sidebar-hamburger" aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const wasOpenRef = useRef(false);

  const location = useLocation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const routeContent = document.getElementById("route-content");

    if (routeContent) {
      routeContent.inert = isOpen;
    }

    document.body.classList.toggle("sidebar-is-open", isOpen);

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !isOpen) return;

      const navigation = document.getElementById("site-navigation");
      const focusable = navigation?.querySelectorAll(
        'a[href], button:not([disabled])'
      );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    if (isOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      menuButtonRef.current?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (routeContent) {
        routeContent.inert = false;
      }

      document.body.classList.remove("sidebar-is-open");
    };
  }, [isOpen]);

  return (
    <>
      <header
        className="site-header"
        id="site-header"
        inert={isOpen}
        aria-hidden={isOpen}
      >
        <button
          className="sidebar-menu-button"
          id="sidebar-menu-button"
          ref={menuButtonRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="site-navigation"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="sidebar-menu-button-label">
            {isOpen ? "CLOSE" : "MENU"}
          </span>
          <MenuIcon isOpen={isOpen} />
        </button>

        <Link
          className="sidebar-brand-link"
          id="sidebar-brand-link"
          to="/"
          aria-label="Belmarose home"
        >
          BELMAROSE
        </Link>

        <Link
          className="sidebar-account-link"
          id="sidebar-account-link"
          to="/my-account"
          aria-label="My Account"
        >
          <UserRound size={20} strokeWidth={1.7} />
          <span className="sidebar-account-label">ACCOUNT</span>
        </Link>
      </header>

      <aside
        id="site-navigation"
        className={`sidebar-navigation-overlay ${
          isOpen ? "sidebar-navigation-overlay-open" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="sidebar-navigation-topline">
          <div className="sidebar-brand-small">
            <span className="sidebar-brand-mark">B.</span>
            <span>BELMAROSE</span>
          </div>

          <span className="sidebar-navigation-note">
            A PLACE FOR THE EVENING
          </span>

          <button
            className="sidebar-close-button"
            id="sidebar-close-button"
            ref={closeButtonRef}
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
          >
            <span>CLOSE</span>
            <X size={22} strokeWidth={1.7} />
          </button>
        </div>

        <div className="sidebar-navigation-content">
          <p className="sidebar-navigation-eyebrow">
            <span className="sidebar-eyebrow-line" />
            EXPLORE BELMAROSE
          </p>

          <nav
            className="sidebar-navigation-links"
            aria-label="Main navigation"
          >
            <ul className="sidebar-navigation-list">
              {menuItems.map((item, index) => {
                const Icon = item.Icon;

                return (
                  <motion.li
                    className={`sidebar-navigation-item sidebar-navigation-item-${item.number.toLowerCase()}`}
                    key={item.number}
                    initial={{
                      opacity: reducedMotion ? 1 : 0,
                      y: reducedMotion ? 0 : 25,
                    }}
                    animate={{
                      opacity: isOpen ? 1 : 0,
                      y: isOpen || reducedMotion ? 0 : 15,
                    }}
                    transition={{
                      duration: reducedMotion ? 0.01 : 0.65,
                      delay: isOpen && !reducedMotion ? index * 0.07 : 0,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                  >
                    <NavLink
                      className={({ isActive }) =>
                        `sidebar-navigation-link ${
                          isActive ? "sidebar-navigation-link-active" : ""
                        }`
                      }
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="sidebar-navigation-number">
                        {item.number}
                      </span>

                      <span className="sidebar-navigation-icon">
                        <Icon size={21} strokeWidth={1.7} />
                      </span>

                      <span className="sidebar-navigation-label">
                        {item.label}
                      </span>

                      <span className="sidebar-navigation-arrow">
                        <ArrowUpRight size={21} strokeWidth={1.5} />
                      </span>
                    </NavLink>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <div className="sidebar-navigation-bottom">
            <span className="sidebar-bottom-star">✳</span>
            <p>WHERE EVERY EVENING BECOMES A MEMORY</p>
          </div>
        </div>

        <div className="sidebar-navigation-footer">
          <span>EST. FOR EXTRAORDINARY EVENINGS</span>
          <span>INDULGE IN THE MOMENT.</span>
        </div>
      </aside>

      {isOpen && (
        <button
          className="sidebar-backdrop-button"
          id="sidebar-backdrop-button"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
