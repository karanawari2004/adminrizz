import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Bold,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  ImagePlus,
  Italic,
  Languages,
  List,
  MapPin,
  MoreVertical,
  Percent,
  Plus,
  Save,
  Search,
  Ticket,
  Trash2,
  Underline,
  User,
  UsersRound,
  X,
} from "lucide-react";

import AdminHeading from "../../AdminHeading";
import { events as initialEvents } from "../../data";
import EventDetails from "../EventDetails/EventDetails";
import "./EventsPage.css";

/* =====================================================
   OPTIONS
===================================================== */

const LANGUAGES = [
  "English",
  "Hindi",
  "Marathi",
  "Punjabi",
  "Multiple Languages",
];

const GENRES = [
  "EDM",
  "House",
  "Techno",
  "Bollywood",
  "Commercial",
  "Hip-Hop",
  "Live Music",
  "Other",
];

const CATEGORIES = [
  "Music",
  "Nightlife",
  "Festival",
  "Concert",
  "Day Party",
  "Pool Party",
];

const ORGANISERS = ["Admin", "Event Manager", "System Admin"];
const CLUBS = ["None / Platform-Wide", "Thalaasa", "Goa Club", "Rizztixx"];
const EMPLOYEES = ["Employee 1", "Employee 2", "Box Office", "Door Staff"];
const ARTIST_SUGGESTIONS = ["ARGY", "&Me", "DJ Snake"];

const TICKET_TYPES = [
  "Early Bird",
  "General",
  "VIP",
  "VVIP",
  "Couple",
  "Table",
];

const GST_OPTIONS = ["0", "5", "12", "18", "28"].map((g) => ({
  value: g,
  title: `${g}%`,
  sub: g === "0" ? "No GST" : "Included in price",
}));

// Quick status chips shown above the table, per tab
const STATUS_CHIPS = {
  current: [
    { value: "", label: "All" },
    { value: "ongoing", label: "Ongoing" },
    { value: "upcoming", label: "Upcoming" },
    { value: "draft", label: "Draft" },
  ],
  past: [
    { value: "", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ],
};

const SECTIONS = [
  { id: "ae-basics", label: "Event basics" },
  { id: "ae-schedule", label: "Date & time" },
  { id: "ae-venue", label: "Venue" },
  { id: "ae-details", label: "About & terms" },
  { id: "ae-team", label: "Organiser & team" },
  { id: "ae-fees", label: "Settings & fees" },
  { id: "ae-tickets", label: "Tickets" },
  { id: "ae-table", label: "Table booking", optional: true },
];

/* =====================================================
   HELPERS
===================================================== */

const num = (v) => Number(v) || 0;

const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const formatWhen = (value) => {
  if (!value) return "Date not set";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Date not set";

  return d.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

const makeTicket = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  type: "",
  gst: "0",
  price: "",
  total: "",
  passes: "1",
  cover: "0",
  CatagoryDescription: "",
  online: false,
  offline: false,
});

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// Same key is used for the table rows and for opening the details page
const keyOf = (event) => event.id ?? event.number;

/* ---------- date helpers ---------- */

const pad2 = (n) => String(n).padStart(2, "0");

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const monthOf = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

const sameDay = (a, b) => Boolean(a && b) && a.getTime() === b.getTime();

const fmtDMY = (d) =>
  `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;

const fmtShort = (d) =>
  d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const fmtMonth = (d) =>
  d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

// "2026-11-20T20:00"  <->  { date: Date, time: "20:00" }
const splitDT = (value) => {
  if (!value) return { date: null, time: "" };
  const [d, t = ""] = value.split("T");
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return { date: null, time: "" };
  return { date: new Date(y, m - 1, day), time: t.slice(0, 5) };
};

const joinDT = (date, time) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate()
  )}T${time}`;

const time12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${pad2(m)} ${h >= 12 ? "PM" : "AM"}`;
};

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const value = `${pad2(Math.floor(i / 2))}:${i % 2 ? "30" : "00"}`;
  return { value, title: time12(value) };
});

// Always 6 weeks (42 cells), weeks start on Monday
const buildGrid = (view) => {
  const y = view.getFullYear();
  const m = view.getMonth();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(y, m, 1 - offset + i);
    return { date, outside: date.getMonth() !== m };
  });
};

const parseLoose = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

/* ---------- option helpers ---------- */

const TONES = ["mint", "amber", "lavender", "sky", "rose"];

const normOptions = (options) =>
  options.map((o, i) =>
    typeof o === "string"
      ? { value: o, title: o, tone: TONES[i % TONES.length] }
      : { tone: TONES[i % TONES.length], ...o }
  );

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

/* =====================================================
   THEME DETECTION (light / dark)
   Follows your app: data-theme, class="dark", the page text
   colour, then the system setting. Pass theme="light" or
   theme="dark" to force one.
===================================================== */

const THEME_ATTRS = [
  "data-theme",
  "data-bs-theme",
  "data-mode",
  "data-color-scheme",
];

const detectDark = (startEl) => {
  if (typeof document === "undefined") return false;

  const roots = [];

  for (
    let n = startEl ? startEl.parentElement : null;
    n && n.nodeType === 1;
    n = n.parentElement
  ) {
    roots.push(n);
  }

  [document.body, document.documentElement].forEach((e) => {
    if (e && !roots.includes(e)) roots.push(e);
  });

  for (const el of roots) {
    for (const attr of THEME_ATTRS) {
      const v = el.getAttribute(attr);
      if (v) return /dark/i.test(v);
    }

    const cls = typeof el.className === "string" ? el.className : "";

    if (/(^|\s)(dark|dark-mode|dark-theme|theme-dark)(\s|$)/i.test(cls))
      return true;

    if (/(^|\s)(light|light-mode|light-theme|theme-light)(\s|$)/i.test(cls))
      return false;
  }

  const rgb = (getComputedStyle(document.body).color || "").match(
    /\d+(\.\d+)?/g
  );

  if (rgb && rgb.length >= 3) {
    const [r, g, b] = rgb.slice(0, 3).map(Number);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55;
  }

  return false;
};

function useDarkMode(theme, rootRef) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (theme === "light" || theme === "dark") return undefined;

    const update = () => setDark(detectDark(rootRef.current));

    update();

    const onClick = () => setTimeout(update, 80);
    window.addEventListener("click", onClick);

    const observer = new MutationObserver(update);

    [document.documentElement, document.body].forEach((el) => {
      if (el) {
        observer.observe(el, {
          attributes: true,
          attributeFilter: ["class", ...THEME_ATTRS],
        });
      }
    });

    const mq = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

    if (mq && mq.addEventListener) mq.addEventListener("change", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("click", onClick);
      if (mq && mq.removeEventListener) mq.removeEventListener("change", update);
    };
  }, [theme, rootRef]);

  if (theme === "dark") return true;
  if (theme === "light") return false;

  return dark;
}

/* =====================================================
   POPOVER (shared by the select, the calendar and the row menu)
   Opens in a portal with fixed positioning, so it is never
   clipped by a table or card with overflow: hidden. It is
   mounted inside the page root, so the light/dark variables
   still apply.
===================================================== */

const portalHost = (el) =>
  (el && el.closest(".add-event-page, .admin-events-page")) || document.body;

function usePopover(open, close, anchorRef, popRef, options = {}) {
  const { width, minWidth = 0 } = options;
  const [pos, setPos] = useState(null);

  const place = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const r = anchor.getBoundingClientRect();
    const w = width
      ? Math.min(width, window.innerWidth - 16)
      : Math.max(r.width, minWidth);

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
  }, [anchorRef, popRef, width, minWidth]);

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

const popStyle = (pos) =>
  pos
    ? {
        left: pos.left,
        top: pos.top,
        bottom: pos.bottom,
        width: pos.width,
        maxHeight: pos.maxHeight,
      }
    : { left: 0, top: 0, visibility: "hidden" };

/* =====================================================
   CUSTOM SELECT
   size: "md" (forms) · "compact" (toolbar) · "mini" (dense filters)
===================================================== */

function Select({
  id,
  value,
  onChange,
  options,
  placeholder = "Select",
  icon,
  avatar = true,
  size = "md",
  invalid = false,
  disabled = false,
  ariaLabel,
}) {
  const items = normOptions(options);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const anchorRef = useRef(null);
  const popRef = useRef(null);
  const listId = useId();

  const close = useCallback(() => setOpen(false), []);

  const pos = usePopover(open, close, anchorRef, popRef, {
    minWidth: size === "md" ? 0 : 190,
  });

  const selected = items.find((i) => i.value === value);

  // Keep the highlighted option in view
  useEffect(() => {
    if (!open || !popRef.current) return;
    popRef.current
      .querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open, pos]);

  const openMenu = () => {
    if (disabled) return;
    setActive(Math.max(0, items.findIndex((i) => i.value === value)));
    setOpen(true);
  };

  const choose = (item) => {
    onChange(item.value);
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

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (items[active]) choose(items[active]);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className={`ux-select is-${size}`} ref={anchorRef}>
      <button
        id={id}
        type="button"
        className={`ux-trigger${open ? " is-open" : ""}${
          invalid ? " has-error" : ""
        }${icon ? "" : " no-icon"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
      >
        {icon && <span className="ux-icon">{icon}</span>}

        <span className={`ux-value${selected ? "" : " is-placeholder"}`}>
          {selected ? selected.title : placeholder}
        </span>

        <ChevronDown size={16} className="ux-chevron" aria-hidden="true" />
      </button>

      {open &&
        createPortal(
          <ul
            id={listId}
            ref={popRef}
            role="listbox"
            className={`ux-pop ux-menu is-${size}`}
            style={popStyle(pos)}
          >
            {items.map((item, index) => {
              const isSelected = item.value === value;

              return (
                <li
                  key={`${item.value}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  data-index={index}
                  className={`ux-option${isSelected ? " is-selected" : ""}${
                    index === active ? " is-active" : ""
                  }`}
                  onClick={() => choose(item)}
                  onMouseEnter={() => setActive(index)}
                >
                  {avatar && (
                    <span className={`ux-avatar tone-${item.tone}`}>
                      {initialsOf(item.title)}
                    </span>
                  )}

                  <span className="ux-option-text">
                    <strong>{item.title}</strong>
                    {item.sub && <small>{item.sub}</small>}
                  </span>

                  {isSelected && (
                    <Check size={16} strokeWidth={2.5} className="ux-check" />
                  )}
                </li>
              );
            })}
          </ul>,
          portalHost(anchorRef.current)
        )}
    </div>
  );
}

/* Time of day, every 30 minutes, in the same select style */
function TimeSelect({ value, onChange, disabled, ariaLabel }) {
  const options =
    value && !TIME_OPTIONS.some((o) => o.value === value)
      ? [...TIME_OPTIONS, { value, title: time12(value) }].sort((a, b) =>
          a.value.localeCompare(b.value)
        )
      : TIME_OPTIONS;

  return (
    <Select
      ariaLabel={ariaLabel}
      avatar={false}
      disabled={disabled}
      icon={<Clock size={15} />}
      onChange={onChange}
      options={options}
      placeholder="Time"
      value={value}
    />
  );
}

/* =====================================================
   DATE RANGE CALENDAR
===================================================== */

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

function DateRangePicker({
  id,
  start,
  end,
  onChange,
  placeholder = "Select dates",
  size = "md",
  invalid = false,
  ariaLabel,
  clearable = false,
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => monthOf(start || new Date()));

  const anchorRef = useRef(null);
  const popRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  const pos = usePopover(open, close, anchorRef, popRef, { width: 330 });

  const today = startOfDay(new Date());

  const toggle = () => {
    if (!open) setView(monthOf(start || new Date()));
    setOpen((o) => !o);
  };

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
    ? `${fmtDMY(start)} → ${end ? fmtDMY(end) : "…"}`
    : placeholder;

  const footer = !start
    ? "Pick a start date"
    : !end
    ? `${fmtShort(start)}, ${start.getFullYear()} – pick an end date`
    : sameDay(start, end)
    ? `${fmtShort(start)}, ${start.getFullYear()}`
    : `${fmtShort(start)} – ${fmtShort(end)}, ${end.getFullYear()}`;

  return (
    <div className={`ux-select is-${size}`} ref={anchorRef}>
      <button
        id={id}
        type="button"
        className={`ux-trigger${open ? " is-open" : ""}${
          invalid ? " has-error" : ""
        }`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={toggle}
      >
        <span className="ux-icon">
          <CalendarDays size={15} />
        </span>

        <span className={`ux-value${start ? "" : " is-placeholder"}`}>
          {triggerText}
        </span>

        <ChevronDown size={16} className="ux-chevron" aria-hidden="true" />
      </button>

      {open &&
        createPortal(
          <div
            ref={popRef}
            role="dialog"
            aria-label="Choose dates"
            className="ux-pop ux-cal"
            style={popStyle(pos)}
          >
            <p className="ux-cal-eyebrow">Select dates</p>

            <div className="ux-cal-nav">
              <button
                type="button"
                className="ux-cal-arrow"
                aria-label="Previous month"
                onClick={() => shiftMonth(-1)}
              >
                <ChevronLeft size={16} />
              </button>

              <strong aria-live="polite">{fmtMonth(view)}</strong>

              <button
                type="button"
                className="ux-cal-arrow"
                aria-label="Next month"
                onClick={() => shiftMonth(1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="ux-cal-weekdays" aria-hidden="true">
              {WEEKDAYS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            <div className="ux-cal-grid">
              {buildGrid(view).map(({ date, outside }) => {
                const single = sameDay(start, end);
                const isStart = sameDay(date, start);
                const isEnd = !single && sameDay(date, end);
                const hasRange = Boolean(start && end) && !single;
                const inRange = hasRange && date > start && date < end;

                const cellClass = [
                  "ux-cal-cell",
                  inRange && "in-range",
                  hasRange && isStart && "range-start",
                  hasRange && isEnd && "range-end",
                ]
                  .filter(Boolean)
                  .join(" ");

                const dayClass = [
                  "ux-cal-day",
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
                      type="button"
                      className={dayClass}
                      aria-label={date.toDateString()}
                      aria-pressed={isStart || isEnd}
                      onClick={() => pick(date)}
                    >
                      {date.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="ux-cal-footer">
              <span>{footer}</span>

              {clearable && start && (
                <button
                  type="button"
                  className="ux-cal-clear"
                  onClick={() => {
                    onChange({ start: null, end: null });
                    setOpen(false);
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>,
          portalHost(anchorRef.current)
        )}
    </div>
  );
}

/* A date range plus a start time and an end time.
   Keeps the "YYYY-MM-DDTHH:mm" strings the form already uses. */
function ScheduleRange({
  label,
  required,
  idBase,
  startValue,
  endValue,
  onChange,
  defaultStartTime,
  defaultEndTime,
  error,
}) {
  const s = splitDT(startValue);
  const e = splitDT(endValue);

  const setDates = ({ start, end }) =>
    onChange(
      start ? joinDT(start, s.time || defaultStartTime) : "",
      end ? joinDT(end, e.time || defaultEndTime) : ""
    );

  return (
    <Field
      label={label}
      required={required}
      htmlFor={`${idBase}-dates`}
      error={error}
    >
      <div className="ux-range-row">
        <div className="ux-range-cell ux-range-dates">
          <span className="ux-mini-label">Dates</span>

          <DateRangePicker
            id={`${idBase}-dates`}
            ariaLabel={`${label} dates`}
            invalid={!!error}
            start={s.date}
            end={e.date}
            onChange={setDates}
          />
        </div>

        <div className="ux-range-cell">
          <span className="ux-mini-label">Starts</span>

          <TimeSelect
            ariaLabel={`${label} start time`}
            disabled={!s.date}
            value={s.time}
            onChange={(t) => onChange(joinDT(s.date, t), endValue)}
          />
        </div>

        <div className="ux-range-cell">
          <span className="ux-mini-label">Ends</span>

          <TimeSelect
            ariaLabel={`${label} end time`}
            disabled={!e.date}
            value={e.time}
            onChange={(t) => onChange(startValue, joinDT(e.date, t))}
          />
        </div>
      </div>
    </Field>
  );
}

/* =====================================================
   SMALL FORM PIECES
===================================================== */

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`ae-switch${checked ? " is-on" : ""}`}
      onClick={() => onChange(!checked)}
    />
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="ae-row">
      <div>
        <b>{title}</b>
        {description && <span>{description}</span>}
      </div>

      <Switch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

function Field({ label, required, optional, error, hint, htmlFor, children }) {
  return (
    <div className="ae-field">
      {label && (
        <label className="ae-label" htmlFor={htmlFor}>
          {label}
          {required && <i>*</i>}
          {optional && <em>Optional</em>}
        </label>
      )}

      {children}

      {error ? (
        <p className="ae-error">{error}</p>
      ) : (
        hint && <p className="ae-hint">{hint}</p>
      )}
    </div>
  );
}

function ChipGroup({ options, value, onToggle, label }) {
  return (
    <div className="ae-chips" role="group" aria-label={label}>
      {options.map((option) => {
        const on = value.includes(option);

        return (
          <button
            key={option}
            type="button"
            aria-pressed={on}
            className={`ae-chip${on ? " is-on" : ""}`}
            onClick={() => onToggle(option)}
          >
            {on && <Check size={13} />}
            {option}
          </button>
        );
      })}
    </div>
  );
}

function SectionCard({ id, number, title, subtitle, action, children }) {
  return (
    <section className="ae-card" id={id}>
      <div className="ae-card-head">
        <span className="ae-num">{number}</span>

        <div className="ae-card-title">
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

function ImageUpload({ image, onPick, onClear, label, hint, ratio }) {
  return (
    <div className="ae-upload">
      {image ? (
        <>
          <div className="ae-upload-preview" style={{ aspectRatio: ratio }}>
            <img src={image.preview} alt={`${label} preview`} />
          </div>

          <div className="ae-upload-actions">
            <label className="ae-btn ae-btn-sm">
              <ImagePlus size={14} />
              Change
              <input type="file" accept="image/*" hidden onChange={onPick} />
            </label>

            <button
              type="button"
              className="ae-btn ae-btn-sm ae-btn-danger"
              onClick={onClear}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </>
      ) : (
        <label className="ae-dropzone" style={{ aspectRatio: ratio }}>
          <ImagePlus size={26} />
          <b>{label}</b>
          <span>{hint}</span>
          <input type="file" accept="image/*" hidden onChange={onPick} />
        </label>
      )}
    </div>
  );
}

/* Text area with a working B / I / U / list toolbar */
function RichField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  max = 2000,
}) {
  const ref = useRef(null);

  const format = (kind) => {
    const el = ref.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const picked = value.slice(start, end) || "text";

    const wraps = {
      bold: ["**", "**"],
      italic: ["_", "_"],
      underline: ["<u>", "</u>"],
      list: ["- ", ""],
    };

    const [before, after] = wraps[kind];
    const next =
      value.slice(0, start) + before + picked + after + value.slice(end);

    onChange(next.slice(0, max));

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + picked.length
      );
    });
  };

  return (
    <div className="ae-field">
      <label className="ae-label" htmlFor={id}>
        {label}
        <i>*</i>
      </label>

      <div className={`ae-editor${error ? " has-error" : ""}`}>
        <div className="ae-editor-bar" role="toolbar" aria-label="Formatting">
          <button type="button" aria-label="Bold" onClick={() => format("bold")}>
            <Bold size={15} />
          </button>
          <button
            type="button"
            aria-label="Italic"
            onClick={() => format("italic")}
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            aria-label="Underline"
            onClick={() => format("underline")}
          >
            <Underline size={15} />
          </button>
          <button
            type="button"
            aria-label="Bulleted list"
            onClick={() => format("list")}
          >
            <List size={15} />
          </button>
        </div>

        <textarea
          id={id}
          ref={ref}
          maxLength={max}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <div className="ae-count-row">
        {error ? (
          <span className="ae-error">{error}</span>
        ) : (
          <span className="ae-hint">{hint}</span>
        )}

        <span className="ae-hint">
          {value.length}/{max}
        </span>
      </div>
    </div>
  );
}

/* =====================================================
   ADD EVENT FORM
===================================================== */

function AddEventForm({ onBack, onSave, theme = "auto" }) {
  const rootRef = useRef(null);
  const dark = useDarkMode(theme, rootRef);

  const [form, setForm] = useState({
    title: "",
    location: "",
    eventStart: "",
    eventEnd: "",
    bookingStart: "",
    bookingEnd: "",
    language: "",
    genres: [],
    organiser: "",
    club: "None / Platform-Wide",
    employees: [],
    artists: [],
    categories: [],
    description: "",
    terms: "",
    bookingPercentage: "",
    fixedTableFee: "200",
    venueAnnouncement: false,
    sponsored: false,
    eighteenthEvent: false,
    clubTableBooking: false,
    layoutDescription: "",
  });

  const [artistDraft, setArtistDraft] = useState("");
  const [eventImage, setEventImage] = useState(null);
  const [layoutImage, setLayoutImage] = useState(null);
  const [tickets, setTickets] = useState([makeTicket()]);
  const [tried, setTried] = useState(false);
  const [notice, setNotice] = useState("");

  /* ---------- updaters ---------- */

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateFields = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const toggleIn = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((x) => x !== value)
        : [...prev[name], value],
    }));
  };

  const addArtist = () => {
    const value = artistDraft.trim();

    if (value && !form.artists.includes(value)) {
      updateField("artists", [...form.artists, value]);
    }

    setArtistDraft("");
  };

  const handleTicketChange = (id, field, value) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  const addTicket = () => setTickets((prev) => [...prev, makeTicket()]);

  const removeTicket = (id) =>
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));

  const handleImage = (e, setter) => {
    const file = e.target.files?.[0];

    if (file) {
      setter({ file, preview: URL.createObjectURL(file) });
    }

    e.target.value = "";
  };

  /* ---------- validation ---------- */

  const start = new Date(form.eventStart);
  const end = new Date(form.eventEnd);
  const bookingOpen = new Date(form.bookingStart);
  const bookingClose = new Date(form.bookingEnd);

  const endBad =
    !Number.isNaN(end.getTime()) &&
    !Number.isNaN(start.getTime()) &&
    end <= start;

  const bookingBad =
    !Number.isNaN(bookingClose.getTime()) &&
    !Number.isNaN(end.getTime()) &&
    bookingClose > end;

  const ticketsValid =
    tickets.length > 0 &&
    tickets.every(
      (t) => t.type && t.price !== "" && num(t.total) > 0 && num(t.passes) > 0
    );

  const done = {
    "ae-basics": !!(
      form.title.trim() &&
      form.language &&
      form.genres.length &&
      form.categories.length &&
      form.artists.length
    ),
    "ae-schedule": !!(
      form.eventStart &&
      form.eventEnd &&
      form.bookingStart &&
      form.bookingEnd &&
      !endBad &&
      !bookingBad
    ),
    "ae-venue": form.venueAnnouncement || !!form.location.trim(),
    "ae-details": !!(form.description.trim() && form.terms.trim()),
    "ae-team": !!form.organiser,
    "ae-fees": form.bookingPercentage !== "" && form.fixedTableFee !== "",
    "ae-tickets": ticketsValid,
  };

  const requiredIds = Object.keys(done);
  const doneCount = requiredIds.filter((id) => done[id]).length;
  const missing = requiredIds.length - doneCount;
  const progress = Math.round((doneCount / requiredIds.length) * 100);

  const show = (condition) => tried && condition;

  const err = {
    title: show(!form.title.trim()) && "Enter an event title.",
    language: show(!form.language) && "Select a language.",
    genres: show(!form.genres.length) && "Choose at least one genre.",
    categories: show(!form.categories.length) && "Choose at least one Catagory.",
    artists: show(!form.artists.length) && "Add at least one artist.",
    eventDates:
      (show(!form.eventStart || !form.eventEnd) &&
        "Choose the event start and end dates.") ||
      (endBad && "End time must be after the start."),
    bookingDates:
      (show(!form.bookingStart || !form.bookingEnd) &&
        "Choose when booking opens and closes.") ||
      (bookingBad && "Booking must close before the event ends."),
    location:
      show(!form.venueAnnouncement && !form.location.trim()) &&
      "Enter the location, or mark the venue as to be announced.",
    description: show(!form.description.trim()) && "This field is required.",
    terms: show(!form.terms.trim()) && "This field is required.",
    organiser: show(!form.organiser) && "Select an organiser.",
    bookingPercentage:
      show(form.bookingPercentage === "") && "Enter a booking percentage.",
    fixedTableFee:
      show(form.fixedTableFee === "") && "Enter the fixed fee.",
  };

  /* ---------- derived values ---------- */

  const hours =
    end > start && !Number.isNaN(end.getTime()) && !Number.isNaN(start.getTime())
      ? (end - start) / 36e5
      : 0;

  const windowDays =
    bookingClose > bookingOpen &&
    !Number.isNaN(bookingClose.getTime()) &&
    !Number.isNaN(bookingOpen.getTime())
      ? Math.round((bookingClose - bookingOpen) / 864e5)
      : 0;

  const capacity = tickets.reduce((sum, t) => sum + num(t.total), 0);

  const potentialRevenue = tickets.reduce(
    (sum, t) => sum + num(t.total) * num(t.price),
    0
  );

  const prices = tickets.filter((t) => t.price !== "").map((t) => num(t.price));
  const fromPrice = prices.length ? money(Math.min(...prices)) : "—";

  /* ---------- save ---------- */

  const buildEvent = (status) => {
    const artistText = form.artists.join(", ");
    const genreText = form.genres.join(", ");

    return {
      id: Date.now(),
      number: `EV-${Date.now()}`,
      name: form.title,
      artist: artistText || "Not Assigned",
      venue: form.venueAnnouncement
        ? "Venue to be announced"
        : form.location,
      type: genreText || "General",
      date: form.eventStart,
      tickets: tickets.length,
      sold: 0,
      status,
      ...form,
      genre: genreText,
      ticketDetails: tickets,
      image: eventImage?.preview || null,
      layoutImage: layoutImage?.preview || null,
    };
  };

  const flash = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 2600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTried(true);

    if (missing > 0) {
      const first = requiredIds.find((id) => !done[id]);
      scrollToId(first);
      flash(
        `${missing} required ${missing === 1 ? "section needs" : "sections need"} attention`
      );
      return;
    }

    onSave(buildEvent("Upcoming"));
  };

  const handleDraft = () => {
    if (!form.title.trim()) {
      setTried(true);
      scrollToId("ae-basics");
      flash("Add an event title to save a draft");
      return;
    }

    onSave(buildEvent("Draft"));
  };

  /* ---------- render ---------- */

  return (
    <div
      ref={rootRef}
      className={`add-event-page${dark ? " is-dark" : ""}`}
    >
      {/* HEADER */}

      <div className="add-event-header">
        <button type="button" className="event-back-button" onClick={onBack}>
          <ArrowLeft size={15} />
          Back
        </button>

        <h2>Add Event</h2>

        <span className="ae-draft-pill">Draft</span>

        <div className="event-breadcrumb">
          Events <span>/</span> Events List <span>/</span> Add Event
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="ae-layout">
          {/* PROGRESS RAIL */}

          <nav className="ae-card ae-rail ae-sticky" aria-label="Form sections">
            <div className="ae-rail-head">
              <div>
                <b>Progress</b>
                <span>
                  {doneCount} of {requiredIds.length}
                </span>
              </div>

              <div className="ae-progress">
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>

            {SECTIONS.map((section, index) => {
              const isDone = !!done[section.id];

              return (
                <button
                  key={section.id}
                  type="button"
                  className="ae-step"
                  onClick={() => scrollToId(section.id)}
                >
                  <span className={`ae-dot${isDone ? " is-done" : ""}`}>
                    {isDone ? <Check size={12} strokeWidth={3} /> : index + 1}
                  </span>

                  <span className="ae-step-label">{section.label}</span>

                  {section.optional && (
                    <span className="ae-step-optional">Optional</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* MAIN FORM */}

          <div className="ae-main">
            {/* 1 BASICS */}

            <SectionCard
              id="ae-basics"
              number="1"
              title="Event basics"
              subtitle="The first things guests see on the event page."
            >
              <div className="ae-basics-top">
                <div className="ae-poster">
                  <span className="ae-label">Cover image</span>

                  <ImageUpload
                    image={eventImage}
                    label="Upload Image"
                    hint="JPG or PNG, 4:5"
                    ratio="4 / 5"
                    onPick={(e) => handleImage(e, setEventImage)}
                    onClear={() => setEventImage(null)}
                  />
                </div>

                <div className="ae-stack">
                  <Field
                    label="Title"
                    required
                    htmlFor="ae-title"
                    error={err.title}
                  >
                    <input
                      id="ae-title"
                      className={`ae-input${err.title ? " has-error" : ""}`}
                      placeholder="Enter Event Title"
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                    />
                  </Field>

                  <Field
                    label="Language"
                    required
                    htmlFor="ae-language"
                    error={err.language}
                  >
                    <Select
                      id="ae-language"
                      icon={<Languages size={15} />}
                      invalid={!!err.language}
                      options={LANGUAGES}
                      placeholder="Select language"
                      value={form.language}
                      onChange={(v) => updateField("language", v)}
                    />
                  </Field>

                  <Field label="Genres" required error={err.genres}>
                    <ChipGroup
                      label="Genres"
                      options={GENRES}
                      value={form.genres}
                      onToggle={(v) => toggleIn("genres", v)}
                    />
                  </Field>
                </div>
              </div>

              <div className="ae-stack ae-gap-top">
                <Field label="Categories" required error={err.categories}>
                  <ChipGroup
                    label="Categories"
                    options={CATEGORIES}
                    value={form.categories}
                    onToggle={(v) => toggleIn("categories", v)}
                  />
                </Field>

                <Field
                  label="Artist/s"
                  required
                  htmlFor="ae-artist"
                  error={err.artists}
                  hint="Type a name and press Enter."
                >
                  <div className="ae-inline">
                    <input
                      id="ae-artist"
                      list="ae-artist-list"
                      className={`ae-input${err.artists ? " has-error" : ""}`}
                      placeholder="Add artist"
                      value={artistDraft}
                      onChange={(e) => setArtistDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addArtist();
                        }
                      }}
                    />

                    <datalist id="ae-artist-list">
                      {ARTIST_SUGGESTIONS.map((item) => (
                        <option key={item} value={item} />
                      ))}
                    </datalist>

                    <button type="button" className="ae-btn" onClick={addArtist}>
                      Add
                    </button>
                  </div>

                  {form.artists.length > 0 && (
                    <div className="ae-chips ae-chips-gap">
                      {form.artists.map((artist) => (
                        <button
                          key={artist}
                          type="button"
                          className="ae-chip is-removable"
                          aria-label={`Remove ${artist}`}
                          onClick={() =>
                            updateField(
                              "artists",
                              form.artists.filter((x) => x !== artist)
                            )
                          }
                        >
                          {artist}
                          <X size={13} />
                        </button>
                      ))}
                    </div>
                  )}
                </Field>
              </div>
            </SectionCard>

            {/* 2 SCHEDULE */}

            <SectionCard
              id="ae-schedule"
              number="2"
              title="Date & time"
              subtitle="When the event runs and when guests can book."
            >
              <div className="ae-stack ae-stack-lg">
                <ScheduleRange
                  label="Event Dates & Timings"
                  required
                  idBase="ae-event"
                  startValue={form.eventStart}
                  endValue={form.eventEnd}
                  defaultStartTime="20:00"
                  defaultEndTime="23:00"
                  error={err.eventDates}
                  onChange={(s, e) =>
                    updateFields({ eventStart: s, eventEnd: e })
                  }
                />

                <ScheduleRange
                  label="Booking Window"
                  required
                  idBase="ae-booking"
                  startValue={form.bookingStart}
                  endValue={form.bookingEnd}
                  defaultStartTime="10:00"
                  defaultEndTime="18:00"
                  error={err.bookingDates}
                  onChange={(s, e) =>
                    updateFields({ bookingStart: s, bookingEnd: e })
                  }
                />
              </div>

              <div className="ae-pills">
                <div className="ae-pill">
                  <b>{hours ? `${+hours.toFixed(1)} h` : "—"}</b>
                  event length
                </div>

                <div className="ae-pill">
                  <b>{windowDays ? `${windowDays} days` : "—"}</b>
                  booking window
                </div>
              </div>
            </SectionCard>

            {/* 3 VENUE */}

            <SectionCard
              id="ae-venue"
              number="3"
              title="Venue"
              subtitle="Where it happens, and the floor layout guests will see."
            >
              <ToggleRow
                title="Venue To Be Announced?"
                description="Hide the address on the event page until you confirm it."
                checked={form.venueAnnouncement}
                onChange={(v) => updateField("venueAnnouncement", v)}
              />

              <Field
                label="Location"
                required
                htmlFor="ae-location"
                error={err.location}
              >
                <div className="ae-prefix">
                  <MapPin size={16} />

                  <input
                    id="ae-location"
                    className={`ae-input${err.location ? " has-error" : ""}`}
                    placeholder="Enter Event Location"
                    value={form.location}
                    disabled={form.venueAnnouncement}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                </div>
              </Field>

              <div className="ae-layout-row">
                <div className="ae-poster">
                  <span className="ae-label">Layout image</span>

                  <ImageUpload
                    image={layoutImage}
                    label="Upload Layout"
                    hint="Optional"
                    ratio="4 / 3"
                    onPick={(e) => handleImage(e, setLayoutImage)}
                    onClear={() => setLayoutImage(null)}
                  />
                </div>

                <Field label="Layout Description" htmlFor="ae-layout-desc">
                  <textarea
                    id="ae-layout-desc"
                    className="ae-input ae-textarea"
                    placeholder="Layout Description"
                    value={form.layoutDescription}
                    onChange={(e) =>
                      updateField("layoutDescription", e.target.value)
                    }
                  />
                </Field>
              </div>
            </SectionCard>

            {/* 4 DETAILS */}

            <SectionCard
              id="ae-details"
              number="4"
              title="About & terms"
              subtitle="What guests read before they buy."
            >
              <div className="ae-stack ae-stack-lg">
                <RichField
                  id="ae-about"
                  label="About"
                  placeholder="Write Description..."
                  hint="Shown on the event page."
                  value={form.description}
                  error={err.description}
                  onChange={(v) => updateField("description", v)}
                />

                <RichField
                  id="ae-terms"
                  label="Terms"
                  placeholder="Write Terms..."
                  hint="Guests accept these at checkout."
                  value={form.terms}
                  error={err.terms}
                  onChange={(v) => updateField("terms", v)}
                />
              </div>
            </SectionCard>

            {/* 5 TEAM */}

            <SectionCard
              id="ae-team"
              number="5"
              title="Organiser & team"
              subtitle="Who runs the event and who can sell tickets for it."
            >
              <div className="ae-grid-2">
                <Field
                  label="Assign Organiser"
                  required
                  htmlFor="ae-organiser"
                  error={err.organiser}
                >
                  <Select
                    id="ae-organiser"
                    icon={<User size={15} />}
                    invalid={!!err.organiser}
                    options={ORGANISERS}
                    placeholder="Select organiser"
                    value={form.organiser}
                    onChange={(v) => updateField("organiser", v)}
                  />
                </Field>

                <Field label="Club" optional htmlFor="ae-club">
                  <Select
                    id="ae-club"
                    icon={<Building2 size={15} />}
                    options={CLUBS}
                    value={form.club}
                    onChange={(v) => updateField("club", v)}
                  />
                </Field>
              </div>

              <div className="ae-gap-top">
                <Field label="Assign Employees And Operators" optional>
                  <ChipGroup
                    label="Employees and operators"
                    options={EMPLOYEES}
                    value={form.employees}
                    onToggle={(v) => toggleIn("employees", v)}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* 6 SETTINGS & FEES */}

            <SectionCard
              id="ae-fees"
              number="6"
              title="Settings & fees"
              subtitle="Audience rules and platform fees."
            >
              <ToggleRow
                title="Sponsored Event?"
                description="Mark the event as sponsored on the listing."
                checked={form.sponsored}
                onChange={(v) => updateField("sponsored", v)}
              />

              <ToggleRow
                title="18+ Event"
                description="Guests must show a valid ID at the door."
                checked={form.eighteenthEvent}
                onChange={(v) => updateField("eighteenthEvent", v)}
              />

              <div className="ae-grid-2 ae-gap-top">
                <Field
                  label="Booking %"
                  required
                  htmlFor="ae-booking-pct"
                  error={err.bookingPercentage}
                >
                  <div className="ae-suffix">
                    <input
                      id="ae-booking-pct"
                      type="number"
                      min="0"
                      max="100"
                      className={`ae-input${
                        err.bookingPercentage ? " has-error" : ""
                      }`}
                      placeholder="Enter Booking %"
                      value={form.bookingPercentage}
                      onChange={(e) =>
                        updateField("bookingPercentage", e.target.value)
                      }
                    />
                    <span>%</span>
                  </div>
                </Field>

                <Field
                  label="Fixed Table Booking Fee (₹)"
                  required
                  htmlFor="ae-table-fee"
                  error={err.fixedTableFee}
                >
                  <div className="ae-prefix">
                    <span className="ae-prefix-text">₹</span>

                    <input
                      id="ae-table-fee"
                      type="number"
                      min="0"
                      className={`ae-input${
                        err.fixedTableFee ? " has-error" : ""
                      }`}
                      value={form.fixedTableFee}
                      onChange={(e) =>
                        updateField("fixedTableFee", e.target.value)
                      }
                    />
                  </div>
                </Field>
              </div>
            </SectionCard>

            {/* 7 TICKETS */}

            <SectionCard
              id="ae-tickets"
              number="7"
              title="Add Ticket"
              subtitle="Add each ticket type with its price, GST and quantity."
              action={
                <button
                  type="button"
                  className="ae-btn ae-btn-primary"
                  onClick={addTicket}
                >
                  <Plus size={15} />
                  Add Ticket
                </button>
              }
            >
              <div className="ae-pills">
                <div className="ae-pill">
                  <b>{tickets.length}</b>
                  ticket types
                </div>

                <div className="ae-pill">
                  <b>{capacity.toLocaleString("en-IN")}</b>
                  total tickets
                </div>

                <div className="ae-pill">
                  <b>{money(potentialRevenue)}</b>
                  potential revenue
                </div>
              </div>

              {tickets.map((ticket, index) => {
                const price = num(ticket.price);
                const gst = num(ticket.gst);
                const gstAmount = Math.round((price * gst) / (100 + gst));

                const bad = (condition) =>
                  tried && condition ? " has-error" : "";

                return (
                  <div className="ae-ticket" key={ticket.id}>
                    <div className="ae-ticket-head">
                      <span className="ae-num ae-num-plain">{index + 1}</span>

                      <h4>{ticket.type || "New ticket"}</h4>

                      <button
                        type="button"
                        className="ae-btn ae-btn-sm ae-btn-danger"
                        onClick={() => removeTicket(ticket.id)}
                        disabled={tickets.length === 1}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>

                    <div className="ae-grid-4">
                      <Field label="Ticket Type" required>
                        <Select
                          ariaLabel="Ticket type"
                          icon={<Ticket size={15} />}
                          invalid={tried && !ticket.type}
                          options={TICKET_TYPES}
                          placeholder="Select type"
                          value={ticket.type}
                          onChange={(v) =>
                            handleTicketChange(ticket.id, "type", v)
                          }
                        />
                      </Field>

                      <Field label="GST (All Inc)">
                        <Select
                          ariaLabel="GST percentage"
                          avatar={false}
                          icon={<Percent size={15} />}
                          options={GST_OPTIONS}
                          value={ticket.gst}
                          onChange={(v) =>
                            handleTicketChange(ticket.id, "gst", v)
                          }
                        />
                      </Field>

                      <Field label="Ticket Price" required>
                        <div className="ae-prefix">
                          <span className="ae-prefix-text">₹</span>

                          <input
                            type="number"
                            min="0"
                            aria-label="Ticket price"
                            className={`ae-input${bad(ticket.price === "")}`}
                            placeholder="0.00"
                            value={ticket.price}
                            onChange={(e) =>
                              handleTicketChange(
                                ticket.id,
                                "price",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </Field>

                      <Field label="Total Number Of Tickets" required>
                        <input
                          type="number"
                          min="0"
                          aria-label="Total number of tickets"
                          className={`ae-input${bad(num(ticket.total) <= 0)}`}
                          placeholder="Enter Total"
                          value={ticket.total}
                          onChange={(e) =>
                            handleTicketChange(ticket.id, "total", e.target.value)
                          }
                        />
                      </Field>

                      <Field label="Passes Per Ticket" required>
                        <input
                          type="number"
                          min="1"
                          aria-label="Passes per ticket"
                          className={`ae-input${bad(num(ticket.passes) <= 0)}`}
                          value={ticket.passes}
                          onChange={(e) =>
                            handleTicketChange(
                              ticket.id,
                              "passes",
                              e.target.value
                            )
                          }
                        />
                      </Field>

                      <Field label="Cover Amount (₹)">
                        <div className="ae-prefix">
                          <span className="ae-prefix-text">₹</span>

                          <input
                            type="number"
                            min="0"
                            aria-label="Cover amount"
                            className="ae-input"
                            value={ticket.cover}
                            onChange={(e) =>
                              handleTicketChange(
                                ticket.id,
                                "cover",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </Field>

                      <div className="ae-span-2">
                        <Field label="Catagory Description">
                          <input
                            aria-label="Catagory description"
                            className="ae-input"
                            placeholder="Catagory Description"
                            value={ticket.CatagoryDescription}
                            onChange={(e) =>
                              handleTicketChange(
                                ticket.id,
                                "CatagoryDescription",
                                e.target.value
                              )
                            }
                          />
                        </Field>
                      </div>
                    </div>

                    <p className="ae-hint ae-gst-note">
                      {price > 0
                        ? `Guests pay ${money(price)} · includes ${gst}% GST (${money(gstAmount)})`
                        : "Enter a price to see the GST included."}
                    </p>

                    <div className="ae-ticket-switches">
                      <label className="ae-inline-switch">
                        <Switch
                          checked={ticket.online}
                          label="Online and queue sold out"
                          onChange={(v) =>
                            handleTicketChange(ticket.id, "online", v)
                          }
                        />
                        Online / Queue Sold Out
                      </label>

                      <label className="ae-inline-switch">
                        <Switch
                          checked={ticket.offline}
                          label="Offline sold out"
                          onChange={(v) =>
                            handleTicketChange(ticket.id, "offline", v)
                          }
                        />
                        Offline Sold Out
                      </label>
                    </div>
                  </div>
                );
              })}
            </SectionCard>

            {/* 8 TABLE BOOKING */}

            <section className="ae-card" id="ae-table">
              <div className="ae-card-head ae-card-head-row">
                <span className="ae-num">8</span>

                <div className="ae-card-title">
                  <h3>
                    Club Table Booking <em>Optional</em>
                  </h3>
                  <p>Let guests reserve tables for this event.</p>
                </div>

                <Switch
                  checked={form.clubTableBooking}
                  label="Enable club table booking"
                  onChange={(v) => updateField("clubTableBooking", v)}
                />
              </div>

              {form.clubTableBooking && (
                <div className="ae-callout">
                  Table booking is on. A fixed fee of{" "}
                  {money(form.fixedTableFee)} applies to each table booking.
                </div>
              )}
            </section>
          </div>

          {/* LIVE PREVIEW */}

          <aside className="ae-preview ae-sticky" aria-label="Live preview">
            <span className="ae-preview-label">Live preview</span>

            <div className="ae-card ae-preview-card">
              <div
                className="ae-preview-poster"
                style={
                  eventImage
                    ? { backgroundImage: `url(${eventImage.preview})` }
                    : undefined
                }
              >
                <div className="ae-preview-badges">
                  {form.eighteenthEvent && <span>18+</span>}
                  {form.sponsored && <span>Sponsored</span>}
                </div>

                <div className="ae-preview-title">
                  {!eventImage && <small>No cover image yet</small>}
                  {form.title.trim() || "Untitled event"}
                </div>
              </div>

              <div className="ae-preview-body">
                <div className="ae-meta">
                  <CalendarDays size={16} />
                  <span>{formatWhen(form.eventStart)}</span>
                </div>

                <div className="ae-meta">
                  <MapPin size={16} />
                  <span>
                    {form.venueAnnouncement
                      ? "Venue to be announced"
                      : form.location.trim() || "Location not set"}
                  </span>
                </div>

                <div className="ae-meta">
                  <User size={16} />
                  <span>
                    {form.artists.length
                      ? form.artists.join(", ")
                      : "No artists yet"}
                  </span>
                </div>

                {form.genres.length > 0 && (
                  <div className="ae-chips">
                    {form.genres.map((genre) => (
                      <span className="ae-tag" key={genre}>
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                <div className="ae-preview-foot">
                  <div>
                    <small>Tickets from</small>
                    <strong>{fromPrice}</strong>
                  </div>

                  <span className="ae-btn ae-btn-primary ae-btn-static">
                    Book now
                  </span>
                </div>
              </div>
            </div>

            <p className="ae-hint ae-preview-hint">
              Updates as you type. This is how the event card looks to guests.
            </p>
          </aside>
        </div>

        {/* ACTION BAR */}

        {notice && (
          <div className="ae-toast" role="status">
            {notice}
          </div>
        )}

        <div className="ae-actionbar">
          <div className="ae-actionbar-inner">
            <div className="ae-status">
              <span className={`ae-dot${missing === 0 ? " is-done" : ""}`}>
                {missing === 0 ? <Check size={12} strokeWidth={3} /> : missing}
              </span>

              {missing === 0
                ? "Everything required is filled in. Ready to create."
                : `${missing} required ${missing === 1 ? "section" : "sections"} left`}
            </div>

            <div className="add-event-actions">
              <button
                type="button"
                className="event-cancel-button"
                onClick={onBack}
              >
                Cancel
              </button>

              <button
                type="button"
                className="event-cancel-button"
                onClick={handleDraft}
              >
                <Save size={15} />
                Save Draft
              </button>

              <button type="submit" className="event-save-button">
                <Plus size={16} />
                Create Event
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

/* =====================================================
   EVENTS LIST · HELPERS
===================================================== */

const isPastStatus = (status) =>
  ["completed", "past", "ended", "cancelled"].includes(
    String(status || "").toLowerCase()
  );

const statusKey = (status) =>
  String(status || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

const hashOf = (value) => {
  let h = 0;
  for (const ch of String(value || "")) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
};

const hasClock = (value) => /\d{1,2}:\d{2}/.test(String(value || ""));

const dayLabel = (d) =>
  `${d.toLocaleDateString("en-US", { weekday: "short" })} ${d.getDate()} ${d.toLocaleDateString(
    "en-US",
    { month: "short" }
  )}`;

const clockLabel = (d) =>
  d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

// Everything the "When" column needs, from either the form fields or the sample data
const whenOf = (item) => {
  const rawStart = item.eventStart || item.date;
  const start = parseLoose(rawStart);

  if (!start) return { fallback: rawStart ? String(rawStart) : "Date not set" };

  const end = parseLoose(item.eventEnd);
  const sameDate = !end || sameDay(startOfDay(start), startOfDay(end));

  let time = "";

  if (hasClock(rawStart)) {
    time = clockLabel(start);
    if (end && hasClock(item.eventEnd)) time += ` – ${clockLabel(end)}`;
  }

  return {
    month: start.toLocaleDateString("en-US", { month: "short" }),
    day: start.getDate(),
    range: sameDate ? dayLabel(start) : `${dayLabel(start)} - ${dayLabel(end)}`,
    time,
  };
};

// Sold / capacity / price range. Reads the form's ticketDetails first, then
// capacity-style fields. Adjust here if your data uses different names.
const ticketStats = (item) => {
  const list = Array.isArray(item.ticketDetails) ? item.ticketDetails : [];
  const sold = num(item.sold);

  let capacity = num(
    item.capacity ?? item.totalTickets ?? item.totalCapacity ?? item.ticketsTotal
  );

  let priceText = typeof item.tickets === "string" ? item.tickets : "";

  if (list.length) {
    capacity = capacity || list.reduce((sum, t) => sum + num(t.total), 0);

    const prices = list
      .filter((t) => t.price !== "" && t.price != null)
      .map((t) => num(t.price));

    if (prices.length) {
      const lo = Math.min(...prices);
      const hi = Math.max(...prices);
      priceText = lo === hi ? money(lo) : `${money(lo)} – ${money(hi)}`;
    }
  }

  const pct = capacity ? Math.min(100, (sold / capacity) * 100) : 0;

  return { sold, capacity, priceText, pct };
};

const artistsOf = (item) =>
  String(item.artist || "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

/* Three-dot menu at the end of each row */
function RowMenu({ name, onView, onDelete }) {
  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);
  const popRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  const pos = usePopover(open, close, anchorRef, popRef, { width: 176 });

  const run = (fn) => {
    setOpen(false);
    fn();
  };

  // Clicks and keys here must not open the row's details page
  return (
    <div
      className="ev-menu"
      ref={anchorRef}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className={`ev-kebab${open ? " is-open" : ""}`}
        aria-label={`Actions for ${name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <MoreVertical size={17} />
      </button>

      {open &&
        createPortal(
          <div
            ref={popRef}
            role="menu"
            className="ux-pop ev-menu-pop"
            style={popStyle(pos)}
          >
            <button
              type="button"
              role="menuitem"
              className="ev-menu-item"
              onClick={() => run(onView)}
            >
              <Eye size={15} />
              View details
            </button>

            <button
              type="button"
              role="menuitem"
              className="ev-menu-item is-danger"
              onClick={() => run(onDelete)}
            >
              <Trash2 size={15} />
              Delete event
            </button>
          </div>,
          portalHost(anchorRef.current)
        )}
    </div>
  );
}

/* =====================================================
   EVENTS PAGE
===================================================== */

export default function EventsPage({ theme = "auto" }) {
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const dark = useDarkMode(theme, rootRef);

  const [tab, setTab] = useState("current");
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [eventList, setEventList] = useState(initialEvents);
  const [viewKey, setViewKey] = useState(null);

  const [artistFilter, setArtistFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const selectedEvent =
    viewKey === null ? null : eventList.find((e) => keyOf(e) === viewKey);

  // Press "/" anywhere on the list to jump to the search box
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;

      const t = e.target;
      const tag = t && t.tagName;

      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (t && t.isContentEditable)
      ) {
        return;
      }

      if (!searchRef.current) return;

      e.preventDefault();
      searchRef.current.focus();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const artistOptions = useMemo(() => {
    const fromData = eventList.flatMap((item) =>
      artistsOf(item).filter((name) => name !== "Not Assigned")
    );

    const names = Array.from(new Set([...ARTIST_SUGGESTIONS, ...fromData]));

    return [{ value: "", title: "All artists" }, ...names];
  }, [eventList]);

  const counts = useMemo(
    () => ({
      current: eventList.filter((e) => !isPastStatus(e.status)).length,
      past: eventList.filter((e) => isPastStatus(e.status)).length,
    }),
    [eventList]
  );

  const stats = useMemo(() => {
    const current = eventList.filter((e) => !isPastStatus(e.status));
    const is = (e, s) => String(e.status || "").toLowerCase() === s;

    return {
      live: current.filter((e) => is(e, "ongoing")).length,
      soon: current.filter((e) => is(e, "upcoming")).length,
      sold: current.reduce((sum, e) => sum + num(e.sold), 0),
      capacity: current.reduce((sum, e) => sum + ticketStats(e).capacity, 0),
    };
  }, [eventList]);

  const filteredEvents = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return eventList.filter((item) => {
      const isPast = isPastStatus(item.status);

      const matchesTab = tab === "past" ? isPast : !isPast;

      const matchesSearch = `${item.name} ${item.artist} ${item.venue} ${item.number}`
        .toLowerCase()
        .includes(needle);

      const matchesArtist =
        !artistFilter ||
        String(item.artist || "")
          .toLowerCase()
          .includes(artistFilter.toLowerCase());

      const matchesStatus =
        !statusFilter ||
        String(item.status || "").toLowerCase() === statusFilter;

      let matchesDate = true;

      if (dateRange.start) {
        const d = parseLoose(item.eventStart || item.date);

        if (d) {
          const day = startOfDay(d);
          const to = dateRange.end || dateRange.start;
          matchesDate = day >= dateRange.start && day <= to;
        }
      }

      return (
        matchesTab &&
        matchesSearch &&
        matchesArtist &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [eventList, tab, query, artistFilter, statusFilter, dateRange]);

  const handleSaveEvent = (newEvent) => {
    setEventList((prev) => [newEvent, ...prev]);
    setShowAdd(false);
    setTab("current");
    setStatusFilter("");
    setQuery("");
  };

  const handleStatusChange = (status) => {
    setEventList((prev) =>
      prev.map((e) => (keyOf(e) === viewKey ? { ...e, status } : e))
    );
  };

  const deleteByKey = (key) => {
    setEventList((prev) => prev.filter((e) => keyOf(e) !== key));
  };

  const handleDelete = () => {
    deleteByKey(viewKey);
    setViewKey(null);
  };

  const switchTab = (next) => {
    setTab(next);
    setStatusFilter("");
  };

  if (showAdd) {
    return (
      <AddEventForm
        theme={theme}
        onBack={() => setShowAdd(false)}
        onSave={handleSaveEvent}
      />
    );
  }

  if (selectedEvent) {
    return (
      <div
        ref={rootRef}
        className={`admin-events-page${dark ? " is-dark" : ""}`}
      >
        <EventDetails
          event={selectedEvent}
          onBack={() => setViewKey(null)}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`admin-events-page${dark ? " is-dark" : ""}`}
    >
      <AdminHeading title="Events" />

      <div className="ev-content">
        {/* SUMMARY */}

        <section className="ev-stats" aria-label="Events summary">
          <div className="ev-stat">
            <span className="ev-stat-label">Live now</span>
            <strong className="ev-stat-value">{stats.live}</strong>
          </div>

          <div className="ev-stat">
            <span className="ev-stat-label">Starting soon</span>
            <strong className="ev-stat-value">{stats.soon}</strong>
          </div>

          <div className="ev-stat">
            <span className="ev-stat-label">Tickets sold</span>
            <strong className="ev-stat-value">
              {stats.sold.toLocaleString("en-IN")}
              {stats.capacity > 0 && (
                <small>of {stats.capacity.toLocaleString("en-IN")}</small>
              )}
            </strong>
          </div>
        </section>

        {/* TABS + ACTIONS */}

        <div className="ev-bar">
          <div className="ev-tabs" role="tablist">
            {[
              { id: "current", label: "Current" },
              { id: "past", label: "Past" },
            ].map((item) => (
              <button
                key={item.id}
                role="tab"
                type="button"
                aria-selected={tab === item.id}
                className={`ev-tab${tab === item.id ? " is-active" : ""}`}
                onClick={() => switchTab(item.id)}
              >
                {item.label}
                <span className="ev-tab-count">{counts[item.id]}</span>
              </button>
            ))}
          </div>

          <div className="ev-bar-actions">
            <button className="admin-secondary-button" type="button">
              <UsersRound size={16} />
              Clubs
            </button>

            <button
              className="admin-primary-button"
              onClick={() => setShowAdd(true)}
              type="button"
            >
              <Plus size={16} />
              Add event
            </button>
          </div>
        </div>

        {/* SEARCH + FILTERS */}

        <div className="ev-toolbar">
          <div className="admin-search-bar ev-search">
            <Search size={17} />

            <input
              ref={searchRef}
              aria-label="Search events"
              placeholder="Search by event, artist, venue or ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X size={16} />
              </button>
            ) : (
              <kbd className="ev-kbd" aria-hidden="true">
                /
              </kbd>
            )}
          </div>

          <div className="ev-chips" role="group" aria-label="Filter by status">
            {STATUS_CHIPS[tab].map((chip) => (
              <button
                key={chip.value || "all"}
                type="button"
                aria-pressed={statusFilter === chip.value}
                className={`ev-chip${statusFilter === chip.value ? " is-on" : ""}`}
                onClick={() => setStatusFilter(chip.value)}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="ev-filter">
            <Select
              ariaLabel="Filter by artist"
              avatar={false}
              options={artistOptions}
              placeholder="All artists"
              size="compact"
              value={artistFilter}
              onChange={setArtistFilter}
            />
          </div>

          <div className="ev-filter ev-filter-date">
            <DateRangePicker
              ariaLabel="Filter by date"
              clearable
              end={dateRange.end}
              onChange={setDateRange}
              placeholder="Any date"
              size="compact"
              start={dateRange.start}
            />
          </div>
        </div>

        {/* EVENTS TABLE */}

        <div className="ev-table-card">
          <div className="ev-table-wrap">
            <table className="ev-table">
              <colgroup>
                <col className="ev-col-event" />
                <col className="ev-col-when" />
                <col className="ev-col-artist" />
                <col className="ev-col-tickets" />
                <col className="ev-col-status" />
                <col className="ev-col-menu" />
              </colgroup>

              <thead>
                <tr>
                  <th>Event</th>
                  <th>When</th>
                  <th>Artist</th>
                  <th>Tickets</th>
                  <th>Status</th>
                  <th>
                    <span className="ev-sr">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredEvents.map((item, index) => {
                  const when = whenOf(item);
                  const tix = ticketStats(item);
                  const artists = artistsOf(item);
                  const firstArtist = artists[0] || "Not Assigned";
                  const status = statusKey(item.status);

                  const idText = String(item.number ?? "").startsWith("EV-")
                    ? item.number
                    : `#${item.number}`;

                  const sub = [
                    item.number != null && `Event ${idText}`,
                    item.venue,
                  ]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <tr
                      key={keyOf(item) ?? index}
                      className="is-clickable"
                      style={{ "--event-index": index }}
                      tabIndex={0}
                      aria-label={`View ${item.name}`}
                      onClick={() => setViewKey(keyOf(item))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setViewKey(keyOf(item));
                        }
                      }}
                    >
                      <td>
                        <div className="ev-event">
                          <span
                            className={`ev-tile g${hashOf(item.name) % 5}`}
                            aria-hidden="true"
                          >
                            {item.image ? (
                              <img src={item.image} alt="" />
                            ) : (
                              String(item.name || "?")
                                .trim()
                                .charAt(0)
                                .toUpperCase()
                            )}
                          </span>

                          <div className="ev-event-text">
                            <strong title={item.name}>{item.name}</strong>
                            <small title={sub}>{sub}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        {when.fallback ? (
                          <span className="ev-when-fallback">
                            {when.fallback}
                          </span>
                        ) : (
                          <div className="ev-when">
                            <span className="ev-date-badge">
                              <small>{when.month}</small>
                              <b>{when.day}</b>
                            </span>

                            <div className="ev-when-text">
                              <strong>{when.range}</strong>
                              {when.time && <small>{when.time}</small>}
                            </div>
                          </div>
                        )}
                      </td>

                      <td>
                        <div className="ev-artist">
                          <span
                            className={`ev-artist-avatar tone-${
                              TONES[hashOf(firstArtist) % TONES.length]
                            }`}
                            aria-hidden="true"
                          >
                            {initialsOf(firstArtist)}
                          </span>

                          <div className="ev-artist-text">
                            <strong title={artists.join(", ")}>
                              {firstArtist}
                              {artists.length > 1 && (
                                <em>+{artists.length - 1}</em>
                              )}
                            </strong>
                            <small>{item.type}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="ev-tickets">
                          <span className="ev-sold">
                            <b>{tix.sold}</b>
                            {tix.capacity > 0 && ` / ${tix.capacity}`} sold
                          </span>

                          {tix.capacity > 0 && (
                            <div
                              className="ev-progress"
                              role="progressbar"
                              aria-label="Tickets sold"
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={Math.round(tix.pct)}
                            >
                              <i style={{ width: `${tix.pct}%` }} />
                            </div>
                          )}

                          {tix.priceText && (
                            <small className="ev-price">{tix.priceText}</small>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className={`admin-status-pill ${status}`}>
                          <span className="admin-status-dot" />
                          {item.status}
                        </span>
                      </td>

                      <td className="ev-cell-menu">
                        <RowMenu
                          name={item.name}
                          onView={() => setViewKey(keyOf(item))}
                          onDelete={() => {
                            if (
                              window.confirm(
                                `Delete "${item.name}"? This can't be undone.`
                              )
                            ) {
                              deleteByKey(keyOf(item));
                            }
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}

                {filteredEvents.length === 0 && (
                  <tr>
                    <td className="ev-empty" colSpan={6}>
                      No {tab} events match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="ev-table-foot">
            Showing {filteredEvents.length} of {counts[tab]} {tab} events
          </div>
        </div>
      </div>
    </div>
  );
}
