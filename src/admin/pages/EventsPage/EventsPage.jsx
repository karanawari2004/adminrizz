import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bold,
  CalendarDays,
  Check,
  ImagePlus,
  Italic,
  List,
  MapPin,
  Plus,
  Save,
  Search,
  Trash2,
  Underline,
  User,
  UsersRound,
  X,
} from "lucide-react";

import AdminHeading from "../../AdminHeading";
import { events as initialEvents } from "../../data";
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

const GST_OPTIONS = ["0", "5", "12", "18", "28"];

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
    eventStart: show(!form.eventStart) && "Select the start time.",
    eventEnd:
      (show(!form.eventEnd) && "Select the end time.") ||
      (endBad && "End time must be after the start."),
    bookingStart: show(!form.bookingStart) && "Select when booking opens.",
    bookingEnd:
      (show(!form.bookingEnd) && "Select when booking closes.") ||
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
                    <select
                      id="ae-language"
                      className={`ae-input${err.language ? " has-error" : ""}`}
                      value={form.language}
                      onChange={(e) => updateField("language", e.target.value)}
                    >
                      <option value="">Select language</option>
                      {LANGUAGES.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
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
              <div className="ae-grid-2">
                <Field
                  label="Event Start Timings"
                  required
                  htmlFor="ae-start"
                  error={err.eventStart}
                >
                  <input
                    id="ae-start"
                    type="datetime-local"
                    className={`ae-input${err.eventStart ? " has-error" : ""}`}
                    value={form.eventStart}
                    onChange={(e) => updateField("eventStart", e.target.value)}
                  />
                </Field>

                <Field
                  label="Event End Timings"
                  required
                  htmlFor="ae-end"
                  error={err.eventEnd}
                >
                  <input
                    id="ae-end"
                    type="datetime-local"
                    className={`ae-input${err.eventEnd ? " has-error" : ""}`}
                    value={form.eventEnd}
                    onChange={(e) => updateField("eventEnd", e.target.value)}
                  />
                </Field>

                <Field
                  label="Booking Start Time"
                  required
                  htmlFor="ae-bstart"
                  error={err.bookingStart}
                >
                  <input
                    id="ae-bstart"
                    type="datetime-local"
                    className={`ae-input${err.bookingStart ? " has-error" : ""}`}
                    value={form.bookingStart}
                    onChange={(e) => updateField("bookingStart", e.target.value)}
                  />
                </Field>

                <Field
                  label="Booking End Time"
                  required
                  htmlFor="ae-bend"
                  error={err.bookingEnd}
                >
                  <input
                    id="ae-bend"
                    type="datetime-local"
                    className={`ae-input${err.bookingEnd ? " has-error" : ""}`}
                    value={form.bookingEnd}
                    onChange={(e) => updateField("bookingEnd", e.target.value)}
                  />
                </Field>
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
                  <select
                    id="ae-organiser"
                    className={`ae-input${err.organiser ? " has-error" : ""}`}
                    value={form.organiser}
                    onChange={(e) => updateField("organiser", e.target.value)}
                  >
                    <option value="">Select</option>
                    {ORGANISERS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Club" optional htmlFor="ae-club">
                  <select
                    id="ae-club"
                    className="ae-input"
                    value={form.club}
                    onChange={(e) => updateField("club", e.target.value)}
                  >
                    {CLUBS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
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
                        <select
                          aria-label="Ticket type"
                          className={`ae-input${bad(!ticket.type)}`}
                          value={ticket.type}
                          onChange={(e) =>
                            handleTicketChange(ticket.id, "type", e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          {TICKET_TYPES.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </Field>

                      <Field label="GST (All Inc)">
                        <select
                          aria-label="GST percentage"
                          className="ae-input"
                          value={ticket.gst}
                          onChange={(e) =>
                            handleTicketChange(ticket.id, "gst", e.target.value)
                          }
                        >
                          {GST_OPTIONS.map((item) => (
                            <option key={item} value={item}>
                              {item}%
                            </option>
                          ))}
                        </select>
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
   EVENTS PAGE
===================================================== */

export default function EventsPage({ theme = "auto" }) {
  const rootRef = useRef(null);
  const dark = useDarkMode(theme, rootRef);

  const [tab, setTab] = useState("Current Events");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [eventList, setEventList] = useState(initialEvents);

  const filteredEvents = useMemo(() => {
    return eventList.filter((item) => {
      const status = String(item.status || "").toLowerCase();

      const isPast = ["completed", "past", "ended"].includes(status);

      const matchesTab = tab === "Past Events" ? isPast : !isPast;

      const matchesSearch = `${item.name} ${item.artist} ${item.venue} ${item.number}`
        .toLowerCase()
        .includes(query.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [eventList, tab, query]);

  const handleSaveEvent = (newEvent) => {
    setEventList((prev) => [newEvent, ...prev]);
    setShowAdd(false);
    setTab("Current Events");
    setSearch("");
    setQuery("");
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

  return (
    <div
      ref={rootRef}
      className={`admin-events-page${dark ? " is-dark" : ""}`}
    >
      <AdminHeading title="Events" />

      <div className="admin-events-content">
        {/* TABS */}

        <div className="admin-tabs" role="tablist">
          {["Current Events", "Past Events"].map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={tab === item}
              className={tab === item ? "is-active" : ""}
              onClick={() => setTab(item)}
              type="button"
            >
              {item}

              <span className="admin-tab-count">
                {
                  eventList.filter((event) => {
                    const past = ["completed", "past", "ended"].includes(
                      String(event.status || "").toLowerCase()
                    );

                    return item === "Past Events" ? past : !past;
                  }).length
                }
              </span>
            </button>
          ))}
        </div>

        {/* TOOLBAR */}

        <div className="admin-events-toolbar">
          <div className="admin-toolbar-left">
            <button
              className="admin-primary-button"
              onClick={() => setShowAdd(true)}
              type="button"
            >
              <Plus size={16} />
              Add Event
            </button>

            <button className="admin-secondary-button" type="button">
              <UsersRound size={16} />
              Clubs
            </button>
          </div>

          <select aria-label="Filter events" defaultValue="All Events">
            <option>All Events</option>
            <option>Music</option>
          </select>
        </div>

        {/* SEARCH */}

        <div className="admin-search-bar admin-events-search">
          <Search size={17} />

          <input
            placeholder="Search events details, event number, location, artist, language, Catagory, date, price"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setQuery(e.target.value);
            }}
          />

          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearch("");
                setQuery("");
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* EVENTS TABLE */}

        <div className="admin-table-card admin-events-table-wrap">
          <table className="admin-table admin-events-table">
            <thead>
              <tr>
                <th>
                  Event Details
                  <span className="admin-count">{filteredEvents.length}</span>
                </th>

                <th>Artist</th>
                <th>Event Timings</th>
                <th>Ticket Details</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="admin-table-filters">
                <td />

                <td>
                  <select aria-label="Filter by artist">
                    <option>Select</option>
                    <option>ARGY</option>
                    <option>&amp;Me</option>
                  </select>
                </td>

                <td>
                  <input
                    aria-label="Filter by date"
                    placeholder="Select Date"
                    type="date"
                  />
                </td>

                <td />

                <td>
                  <select aria-label="Filter by status">
                    <option>Select</option>
                    <option>Ongoing</option>
                    <option>Upcoming</option>
                    <option>Completed</option>
                    <option>Draft</option>
                  </select>
                </td>
              </tr>

              {filteredEvents.map((item, index) => (
                <tr
                  key={item.id || item.number || index}
                  style={{ "--event-index": index }}
                >
                  <td>
                    <div className="admin-event-detail">
                      <span className="admin-event-poster">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <CalendarDays size={22} />
                        )}
                      </span>

                      <div className="admin-event-info">
                        <strong>{item.name}</strong>

                        <small>Event ID: {item.number}</small>

                        <small>{item.venue}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="admin-event-artist-info">
                      <span className="admin-type-pill">{item.type}</span>

                      <strong className="admin-event-artist">
                        {item.artist}
                      </strong>
                    </div>
                  </td>

                  <td>
                    <div className="admin-event-timing">
                      <CalendarDays size={15} />

                      <span>{item.date}</span>
                    </div>
                  </td>

                  <td>
                    <div className="admin-event-ticket-info">
                      <strong>Ticket Price</strong>

                      <span>{item.tickets}</span>
                    </div>
                  </td>

                  <td>
                    <div className="admin-event-status">
                      <strong>Tickets Sold: {item.sold}</strong>

                      <span
                        className={`admin-status-pill ${String(
                          item.status
                        ).toLowerCase()}`}
                      >
                        <span className="admin-status-dot" />

                        {item.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEvents.length === 0 && (
                <tr>
                  <td className="admin-empty-row" colSpan="5">
                    No {tab.toLowerCase()} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
