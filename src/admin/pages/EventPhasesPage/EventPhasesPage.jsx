import { useEffect, useId, useRef, useState } from "react";
import AdminHeading from "../../AdminHeading";
import "./EventPhasesPage.css";

/* =========================================================
   DEMO DATA  (replace with your API data)
========================================================= */

const CLUBS = [
  {
    id: "maushi",
    name: "Maushi",
    tone: "mint",
    events: [
      { id: "starly", name: "Starly", note: "Fri, 20 Nov" },
      { id: "after-dark", name: "After Dark", note: "Sat, 21 Nov" },
    ],
  },
  {
    id: "nesco",
    name: "Nesco",
    tone: "amber",
    events: [{ id: "after-dark-nesco", name: "After Dark", note: "Sat, 28 Nov" }],
  },
  {
    id: "sunburn",
    name: "Sunburn",
    tone: "lavender",
    events: [{ id: "starly-sunburn", name: "Starly", note: "Fri, 4 Dec" }],
  },
];

/* =========================================================
   HELPERS
========================================================= */

const pad = (n) => String(n).padStart(2, "0");

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const sameDay = (a, b) => Boolean(a && b) && a.getTime() === b.getTime();

const formatInput = (d) =>
  `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;

const formatShort = (d) =>
  d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const formatMonth = (d) =>
  d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const initials = (name) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Always 6 weeks (42 cells), weeks start on Monday.
function buildGrid(view) {
  const year = view.getFullYear();
  const month = view.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(year, month, 1 - offset + i);
    return { date, outside: date.getMonth() !== month };
  });
}

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

/* =========================================================
   ICONS
========================================================= */

const iconProps = {
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
  <svg {...iconProps}>
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-6h6v6" />
    <path d="M9 10h.01M15 10h.01" />
  </svg>
);

const EventIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3l2.4 5.6L20 9.3l-4.4 3.8 1.3 5.9L12 15.9 7.1 19l1.3-5.9L4 9.3l5.6-.7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="4.5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 2.5v4M16 2.5v4" />
  </svg>
);

const ChevronIcon = ({ direction = "down" }) => (
  <svg
    {...iconProps}
    style={{
      transform:
        direction === "up"
          ? "rotate(180deg)"
          : direction === "left"
          ? "rotate(90deg)"
          : direction === "right"
          ? "rotate(-90deg)"
          : undefined,
    }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CheckIcon = () => (
  <svg {...iconProps} width={15} height={15} strokeWidth={2.4}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* =========================================================
   CUSTOM SELECT
========================================================= */

function Select({ label, icon, options, value, onChange, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const uid = useId();

  useClickOutside(rootRef, () => setOpen(false));

  const selected = options.find((option) => option.value === value);

  // Keep the keyboard-highlighted option visible
  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current
      .querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const openMenu = () => {
    if (disabled) return;
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (option) => {
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
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

  return (
    <div className="admin-field">
      <span className="admin-field-label" id={`${uid}-label`}>
        {label}
      </span>

      <div className="admin-select" ref={rootRef}>
        <button
          aria-controls={`${uid}-list`}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-labelledby={`${uid}-label`}
          className={`admin-select-trigger ${open ? "is-open" : ""}`}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={handleKeyDown}
          type="button"
        >
          <span className="admin-select-icon">{icon}</span>
          <span
            className={`admin-select-value ${selected ? "" : "is-placeholder"}`}
          >
            {selected ? selected.title : placeholder}
          </span>
          <span className="admin-select-chevron">
            <ChevronIcon direction={open ? "up" : "down"} />
          </span>
        </button>

        {open && (
          <ul
            aria-labelledby={`${uid}-label`}
            className="admin-select-menu"
            id={`${uid}-list`}
            ref={listRef}
            role="listbox"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li
                  aria-selected={isSelected}
                  className={`admin-select-option ${
                    isSelected ? "is-selected" : ""
                  } ${index === active ? "is-active" : ""}`}
                  data-index={index}
                  key={option.value}
                  onClick={() => choose(option)}
                  onMouseEnter={() => setActive(index)}
                  role="option"
                >
                  <span className={`admin-avatar tone-${option.tone}`}>
                    {initials(option.title)}
                  </span>
                  <span className="admin-option-text">
                    <strong>{option.title}</strong>
                    <small>{option.sub}</small>
                  </span>
                  {isSelected && (
                    <span className="admin-option-check">
                      <CheckIcon />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   DATE RANGE PICKER
========================================================= */

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

function DateRangePicker({ label, start, end, onChange }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const base = start || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const rootRef = useRef(null);
  const uid = useId();
  const today = startOfDay(new Date());

  useClickOutside(rootRef, () => setOpen(false));

  const shiftMonth = (delta) =>
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));

  const pick = (day) => {
    if (!start || end || day < start) {
      onChange({ start: day, end: null });
      return;
    }
    onChange({ start, end: day });
    setOpen(false);
  };

  const triggerText = start
    ? `${formatInput(start)} → ${end ? formatInput(end) : "…"}`
    : "Select dates";

  const footer = !start
    ? "Pick a start date"
    : !end
    ? `${formatShort(start)}, ${start.getFullYear()} – pick an end date`
    : `${formatShort(start)} – ${formatShort(end)}, ${end.getFullYear()}`;

  return (
    <div className="admin-field">
      <span className="admin-field-label" id={`${uid}-label`}>
        {label}
      </span>

      <div
        className="admin-select"
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        ref={rootRef}
      >
        <button
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-labelledby={`${uid}-label`}
          className={`admin-select-trigger ${open ? "is-open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          type="button"
        >
          <span className="admin-select-icon">
            <CalendarIcon />
          </span>
          <span className={`admin-select-value ${start ? "" : "is-placeholder"}`}>
            {triggerText}
          </span>
          <span className="admin-select-chevron">
            <ChevronIcon direction={open ? "up" : "down"} />
          </span>
        </button>

        {open && (
          <div
            aria-label="Choose sale dates"
            className="admin-calendar"
            role="dialog"
          >
            <p className="admin-calendar-eyebrow">Select dates</p>

            <div className="admin-calendar-nav">
              <button
                aria-label="Previous month"
                className="admin-calendar-arrow"
                onClick={() => shiftMonth(-1)}
                type="button"
              >
                <ChevronIcon direction="left" />
              </button>
              <strong aria-live="polite">{formatMonth(view)}</strong>
              <button
                aria-label="Next month"
                className="admin-calendar-arrow"
                onClick={() => shiftMonth(1)}
                type="button"
              >
                <ChevronIcon direction="right" />
              </button>
            </div>

            <div className="admin-calendar-weekdays" aria-hidden="true">
              {WEEKDAYS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            <div className="admin-calendar-grid">
              {buildGrid(view).map(({ date, outside }) => {
                const isStart = sameDay(date, start);
                const isEnd = sameDay(date, end);
                const hasRange = start && end && !sameDay(start, end);
                const inRange = hasRange && date > start && date < end;

                const cellClass = [
                  "admin-calendar-cell",
                  inRange && "in-range",
                  hasRange && isStart && "range-start",
                  hasRange && isEnd && "range-end",
                ]
                  .filter(Boolean)
                  .join(" ");

                const dayClass = [
                  "admin-calendar-day",
                  outside && "is-outside",
                  sameDay(date, today) && "is-today",
                  isStart && "is-start",
                  isEnd && "is-end",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div className={cellClass} key={date.getTime()}>
                    <button
                      aria-label={date.toDateString()}
                      aria-pressed={isStart || isEnd}
                      className={dayClass}
                      onClick={() => pick(date)}
                      type="button"
                    >
                      {date.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="admin-calendar-footer">{footer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function EventPhasesPage() {
  const [clubId, setClubId] = useState("");
  const [eventId, setEventId] = useState("");
  const [saved, setSaved] = useState(false);
  const [range, setRange] = useState({ start: null, end: null });

  const club = CLUBS.find((c) => c.id === clubId);

  const clubOptions = CLUBS.map((c) => ({
    value: c.id,
    title: c.name,
    sub: `${c.events.length} ${c.events.length === 1 ? "event" : "events"}`,
    tone: c.tone,
  }));

  const eventOptions = (club ? club.events : []).map((e) => ({
    value: e.id,
    title: e.name,
    sub: e.note,
    tone: club.tone,
  }));

  return (
    <div className="admin-event-phases-page">
      <AdminHeading title="Event Phases" />

      <section className="admin-phases-panel">
        {/* PRICING BANNER */}
        <div className="admin-pricing-banner">
          <div>
            <span>DOOR PRICING</span>
            <h2>Event Pricing</h2>
            <p>
              Set ticket sale phases, a one-shot table hike, and automatic
              table price tiers. Customers and POS only see the live price.
            </p>
          </div>

          <button
            className="admin-primary-button"
            onClick={() => setSaved(true)}
            type="button"
          >
            Save Pricing
          </button>
        </div>

        {/* CLUB AND EVENT SELECT */}
        <div className="admin-phase-selects">
          <Select
            icon={<ClubIcon />}
            label="Club"
            onChange={(value) => {
              setClubId(value);
              setEventId("");
              setSaved(false);
            }}
            options={clubOptions}
            placeholder="Select a club"
            value={clubId}
          />

          <Select
            disabled={!club}
            icon={<EventIcon />}
            label="Event"
            onChange={(value) => {
              setEventId(value);
              setSaved(false);
            }}
            options={eventOptions}
            placeholder={club ? "Select an event" : "Select a club first"}
            value={eventId}
          />
        </div>

        {/* EVENT CONFIGURATION */}
        {eventId ? (
          <div className="admin-phase-config">
            <h3>Ticket Sale Phases</h3>

            <div className="admin-phase-inputs">
              <label className="admin-field">
                <span className="admin-field-label">Phase Name</span>
                <input placeholder="Early Bird" />
              </label>

              <label className="admin-field">
                <span className="admin-field-label">Ticket Price</span>
                <input min="0" placeholder="500" type="number" />
              </label>

              <label className="admin-field">
                <span className="admin-field-label">Ticket Quantity</span>
                <input min="1" placeholder="100" type="number" />
              </label>

              <DateRangePicker
                end={range.end}
                label="Sale Dates"
                onChange={(next) => {
                  setRange(next);
                  setSaved(false);
                }}
                start={range.start}
              />

              <label className="admin-field">
                <span className="admin-field-label">Starts At</span>
                <input defaultValue="18:00" type="time" />
              </label>

              <label className="admin-field">
                <span className="admin-field-label">Ends At</span>
                <input defaultValue="23:59" type="time" />
              </label>
            </div>

            <p className="admin-phase-info">
              Table hike and automatic table price tiers can be configured
              after selecting an event.
            </p>

            {saved && (
              <p className="admin-report-feedback" role="status">
                Pricing saved for this demo.
              </p>
            )}
          </div>
        ) : (
          <div className="admin-pick-night">
            <div className="admin-pick-icon">✦</div>
            <h3>Pick A Night</h3>
            <p>
              Choose an event to configure ticket phases, table hike,
              and auto tiers.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
