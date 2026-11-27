import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import AdminHeading from "../../AdminHeading";
import "./ClubManagersPage.css";

/* =========================================================
   DEMO DATA  (replace with your API data)
========================================================= */

const CLUBS = [
  { value: "Maushi", title: "Maushi", sub: "3 managers", tone: "mint" },
  { value: "Nesco", title: "Nesco", sub: "2 managers", tone: "amber" },
  { value: "Sunburn", title: "Sunburn", sub: "5 managers", tone: "lavender" },
];

/* =========================================================
   HELPERS
========================================================= */

const initialsOf = (title) => {
  const words = String(title)
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/gi, ""))
    .filter(Boolean);

  if (!words.length) return "·";

  return (
    words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)
  ).toUpperCase();
};

const portalHost = (el) =>
  (el && el.closest(".admin-club-managers-page")) || document.body;

/* Opens the menu in a portal with fixed positioning, so it is never
   clipped by a card or section with overflow hidden. */
function usePopover(open, close, anchorRef, popRef) {
  const [pos, setPos] = useState(null);

  const place = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const r = anchor.getBoundingClientRect();
    const w = r.width;
    const h = popRef.current ? popRef.current.offsetHeight : 0;
    const gap = 8;
    const below = window.innerHeight - r.bottom - gap - 8;
    const above = r.top - gap - 8;
    const flip = h > below && above > below;

    setPos({
      left: Math.min(Math.max(8, r.left), window.innerWidth - w - 8),
      width: w,
      top: flip ? "auto" : r.bottom + gap,
      bottom: flip ? window.innerHeight - r.top + gap : "auto",
      maxHeight: Math.max(180, flip ? above : below),
    });
  }, [anchorRef, popRef]);

  useLayoutEffect(() => {
    if (open) place();
    else setPos(null);
  }, [open, place]);

  useEffect(() => {
    if (!open) return undefined;

    const onDown = (e) => {
      if (
        anchorRef.current?.contains(e.target) ||
        popRef.current?.contains(e.target)
      ) {
        return;
      }
      close();
    };

    const onKey = (e) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, close, place, anchorRef, popRef]);

  return pos;
}

/* =========================================================
   ICONS
========================================================= */

const svgProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const ClubIcon = () => (
  <svg {...svgProps}>
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-6h6v6" />
    <path d="M9 10h.01M15 10h.01" />
  </svg>
);

const ChevronIcon = () => (
  <svg {...svgProps} className="ux-chevron">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CheckIcon = () => (
  <svg {...svgProps} className="ux-check" width={15} height={15} strokeWidth={2.5}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* =========================================================
   CUSTOM SELECT
========================================================= */

function Select({ id, value, onChange, options, placeholder, icon }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const anchorRef = useRef(null);
  const popRef = useRef(null);
  const listId = useId();

  const close = useCallback(() => setOpen(false), []);
  const pos = usePopover(open, close, anchorRef, popRef);

  const selected = options.find((o) => o.value === value);

  // Keep the highlighted option in view
  useEffect(() => {
    if (!open || !popRef.current) return;
    popRef.current
      .querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open, pos]);

  const openMenu = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (option) => {
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (options[active]) choose(options[active]);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const style = pos
    ? {
        left: pos.left,
        top: pos.top,
        bottom: pos.bottom,
        width: pos.width,
        maxHeight: pos.maxHeight,
      }
    : { left: 0, top: 0, visibility: "hidden" };

  return (
    <div className="ux-select" ref={anchorRef}>
      <button
        id={id}
        type="button"
        className={`ux-trigger${open ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span className="ux-icon">{icon}</span>

        <span className={`ux-value${selected ? "" : " is-placeholder"}`}>
          {selected ? selected.title : placeholder}
        </span>

        <ChevronIcon />
      </button>

      {open &&
        createPortal(
          <ul
            id={listId}
            ref={popRef}
            role="listbox"
            className="ux-pop ux-menu"
            style={style}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  data-index={index}
                  className={`ux-option${isSelected ? " is-selected" : ""}${
                    index === active ? " is-active" : ""
                  }`}
                  onClick={() => choose(option)}
                  onMouseEnter={() => setActive(index)}
                >
                  <span className={`ux-avatar tone-${option.tone}`}>
                    {initialsOf(option.title)}
                  </span>

                  <span className="ux-option-text">
                    <strong>{option.title}</strong>
                    {option.sub && <small>{option.sub}</small>}
                  </span>

                  {isSelected && <CheckIcon />}
                </li>
              );
            })}
          </ul>,
          portalHost(anchorRef.current)
        )}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ClubManagersPage() {
  const [club, setClub] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = (event) => {
    event.preventDefault();

    if (!club || !email.trim() || !name.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    setMessage(`Invitation prepared for ${name}.`);
    setEmail("");
    setName("");
  };

  const handleRefresh = () => {
    setMessage("Manager list refreshed.");
  };

  return (
    <div className="admin-club-managers-page">
      <AdminHeading
        title="Club Managers"
        section="Events"
        parent="Club Managers"
      />

      <div className="admin-managers-content">
        {/* CLUB SELECT */}
        <div className="admin-manager-club">
          <label htmlFor="club">Club</label>

          <Select
            icon={<ClubIcon />}
            id="club"
            onChange={setClub}
            options={CLUBS}
            placeholder="Select a club"
            value={club}
          />
        </div>

        {/* INVITE MANAGER */}
        <h2 className="admin-manager-heading">Invite Club Manager</h2>

        <form className="admin-manager-invite-form" onSubmit={handleInvite}>
          <div className="admin-manager-field">
            <label htmlFor="manager-email">Email Address</label>

            <input
              id="manager-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-manager-field">
            <label htmlFor="manager-name">Name</label>

            <input
              id="manager-name"
              type="text"
              placeholder="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-manager-invite-button"
            disabled={!club}
          >
            Send Invite
          </button>
        </form>

        {/* MESSAGE */}
        {message && (
          <p className="admin-manager-message" role="status">
            {message}
          </p>
        )}

        {/* MANAGERS */}
        <h2 className="admin-manager-list-heading">Managers For This Club</h2>

        <p className="admin-manager-empty">No Result Found!</p>

        {/* REFRESH */}
        <button
          type="button"
          className="admin-manager-refresh-button"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
