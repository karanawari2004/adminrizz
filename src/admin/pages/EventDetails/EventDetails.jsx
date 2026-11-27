import { Fragment, useEffect, useState } from "react";
import {
  ArrowLeft,
  Ban,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  LayoutGrid,
  MapPin,
  Pencil,
  Percent,
  RotateCcw,
  Trash2,
  User,
  UsersRound,
  X,
} from "lucide-react";

import "./EventDetails.css";

/* =====================================================
   HELPERS
===================================================== */

const num = (v) => Number(v) || 0;

const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const parseLoose = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const hasClock = (value) => /\d{1,2}:\d{2}/.test(String(value || ""));

const clock = (d) =>
  d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

// { main: "Fri 27 Nov 2026", sub: "7:00 PM" }
const whenParts = (value) => {
  const d = parseLoose(value);

  if (!d) return { main: value ? String(value) : "Not set", sub: "" };

  return {
    main: d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    sub: hasClock(value) ? clock(d) : "",
  };
};

const shortWhen = (value) => {
  const d = parseLoose(value);
  if (!d) return "";

  const day = `${d.getDate()} ${d.toLocaleDateString("en-US", {
    month: "short",
  })}`;

  return hasClock(value) ? `${day}, ${clock(d)}` : day;
};

const asList = (...values) => {
  for (const v of values) {
    if (Array.isArray(v) && v.length) return v.map(String);

    if (typeof v === "string" && v.trim()) {
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const TONES = ["mint", "amber", "lavender", "sky", "rose"];

const hashOf = (value) => {
  let h = 0;
  for (const ch of String(value || "")) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
};

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

const statusKey = (status) =>
  String(status || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

// Accepts the form's ticketDetails, or an array in `tickets`
const ticketsOf = (event) => {
  const raw = Array.isArray(event.ticketDetails)
    ? event.ticketDetails
    : Array.isArray(event.tickets)
    ? event.tickets
    : [];

  return raw
    .filter((t) => t && typeof t === "object")
    .map((t, i) => ({
      key: t.id ?? i,
      type: t.type ?? t.name ?? t.ticketType ?? "Ticket",
      price: num(t.price),
      total: num(t.total ?? t.totalTickets ?? t.quantity),
      passes: num(t.passes) || 1,
      gst: t.gst,
      desc: t.CatagoryDescription ?? t.description ?? "",
      sold: num(t.sold ?? t.ticketSold),
      hasSold: t.sold != null || t.ticketSold != null,
      online: !!t.online,
      offline: !!t.offline,
    }));
};

/* About / Terms text comes from a plain textarea with **bold**, _italic_,
   <u>underline</u> and "- " list markers. Render them without raw HTML. */

function renderInline(text) {
  return text
    .split(/(\*\*[^*]+\*\*|_[^_]+_|<u>[^<]+<\/u>)/g)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }

      if (part.startsWith("<u>") && part.endsWith("</u>")) {
        return <u key={i}>{part.slice(3, -4)}</u>;
      }

      if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }

      return <Fragment key={i}>{part}</Fragment>;
    });
}

function RichText({ text, empty }) {
  const [open, setOpen] = useState(false);

  const value = String(text || "").trim();

  if (!value) return <p className="ed-empty">{empty}</p>;

  const blocks = [];

  value.split("\n").forEach((line) => {
    const item = line.match(/^\s*[-•]\s+(.*)$/);

    if (item) {
      const last = blocks[blocks.length - 1];

      if (last && last.list) last.items.push(item[1]);
      else blocks.push({ list: true, items: [item[1]] });
    } else if (line.trim()) {
      blocks.push({ text: line });
    }
  });

  const long = value.length > 340 || value.split("\n").length > 6;

  return (
    <div>
      <div className={`ed-rich${long && !open ? " is-clamped" : ""}`}>
        {blocks.map((b, i) =>
          b.list ? (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ul>
          ) : (
            <p key={i}>{renderInline(b.text)}</p>
          )
        )}
      </div>

      {long && (
        <button
          type="button"
          className="ed-more"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function Fact({ label, value, sub, icon }) {
  return (
    <div className="ed-fact">
      <span className="ed-fact-label">
        {icon}
        {label}
      </span>

      <strong>{value}</strong>

      {sub && <small>{sub}</small>}
    </div>
  );
}

function Labelled({ label, children }) {
  return (
    <div className="ed-field">
      <span className="ed-field-label">{label}</span>
      {children}
    </div>
  );
}

/* =====================================================
   EVENT DETAILS
   Props: event, onBack, onDelete, onStatusChange(status)
   Optional: onEdit(event) shows the pencil button
===================================================== */

export default function EventDetails({
  event,
  onBack,
  onDelete,
  onStatusChange,
  onEdit,
}) {
  const [copied, setCopied] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);

  useEffect(() => {
    if (!layoutOpen) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") setLayoutOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [layoutOpen]);

  if (!event) return null;

  /* ---------- derived ---------- */

  const status = statusKey(event.status);
  const isClosed = ["completed", "past", "ended"].includes(status);
  const isCancelled = status === "cancelled";
  const canAct = !isClosed && !isCancelled;

  const idText = String(event.number ?? "").startsWith("EV-")
    ? event.number
    : `#${event.number ?? event.id ?? "—"}`;

  const mongoId = typeof event._id === "string" ? event._id : "";

  const start = whenParts(event.eventStart || event.date);
  const end = whenParts(event.eventEnd);

  const bookingFrom = shortWhen(event.bookingStart);
  const bookingTo = shortWhen(event.bookingEnd);

  const genres = asList(event.genres, event.genre, event.type);
  const categories = asList(event.categories, event.category);
  const artists = asList(event.artists, event.artist).filter(
    (name) => name !== "Not Assigned"
  );
  const employees = asList(event.employees);
  const languages = asList(event.language);

  const location = event.venueAnnouncement
    ? "Venue to be announced"
    : event.location || event.venue || "Location not set";

  const tickets = ticketsOf(event);
  const capacity = tickets.reduce((s, t) => s + t.total, 0);

  const sold =
    event.sold != null
      ? num(event.sold)
      : tickets.reduce((s, t) => s + t.sold, 0);

  const pct = capacity ? Math.min(100, (sold / capacity) * 100) : 0;

  const potential = tickets.reduce((s, t) => s + t.total * t.price, 0);

  const hasLayout = !!(event.layoutImage || event.layoutDescription);

  /* ---------- actions ---------- */

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(mongoId || idText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const change = (next, message) => {
    if (window.confirm(message)) onStatusChange?.(next);
  };

  const remove = () => {
    if (window.confirm(`Delete "${event.name}"? This can't be undone.`)) {
      onDelete?.();
    }
  };

  /* ---------- render ---------- */

  return (
    <div className="ed-page">
      {/* HEADER */}

      <header className="ed-header">
        <button type="button" className="ed-back" onClick={onBack}>
          <ArrowLeft size={15} />
          Back
        </button>

        <h1>View Event</h1>

        <nav className="ed-crumbs" aria-label="Breadcrumb">
          <span>Events</span>
          <i>/</i>
          <span>List</span>
          <i>/</i>
          <b>View Event</b>
        </nav>
      </header>

      {/* HERO */}

      <section className="ed-card ed-hero">
        <div className="ed-media">
          <div className="ed-poster">
            {event.image ? (
              <img src={event.image} alt={`${event.name} poster`} />
            ) : (
              <span aria-hidden="true">
                {String(event.name || "?").trim().charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {hasLayout && (
            <button
              type="button"
              className="ed-btn ed-btn-quiet"
              onClick={() => setLayoutOpen(true)}
            >
              <LayoutGrid size={15} />
              View layout
            </button>
          )}
        </div>

        <div className="ed-hero-main">
          <div className="ed-hero-top">
            <div className="ed-title-block">
              <div className="ed-badges">
                {event.eighteenthEvent && <span>18+</span>}
                {event.sponsored && <span>Sponsored</span>}
                {event.clubTableBooking && <span>Table booking</span>}
              </div>

              <h2>{event.name}</h2>

              <div className="ed-id">
                <span>
                  Event ID <b>{idText}</b>
                </span>

                {mongoId && <code>{mongoId}</code>}

                <button
                  type="button"
                  className="ed-copy"
                  aria-label="Copy event ID"
                  onClick={copyId}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="ed-side">
              <div className="ed-status">
                <span>Event status</span>

                <span className={`admin-status-pill ${status}`}>
                  <span className="admin-status-dot" />
                  {event.status || "Unknown"}
                </span>
              </div>

              <div className="ed-actions">
                {onEdit && (
                  <button
                    type="button"
                    className="ed-icon-btn"
                    aria-label="Edit event"
                    title="Edit event"
                    onClick={() => onEdit(event)}
                  >
                    <Pencil size={16} />
                  </button>
                )}

                <button
                  type="button"
                  className="ed-icon-btn is-danger"
                  aria-label="Delete event"
                  title="Delete event"
                  onClick={remove}
                >
                  <Trash2 size={16} />
                </button>

                {canAct && (
                  <>
                    <button
                      type="button"
                      className="ed-btn ed-btn-danger"
                      onClick={() =>
                        change(
                          "Cancelled",
                          `Cancel "${event.name}"? Guests will no longer be able to book.`
                        )
                      }
                    >
                      <Ban size={15} />
                      Cancel event
                    </button>

                    <button
                      type="button"
                      className="ed-btn ed-btn-primary"
                      onClick={() =>
                        change("Completed", `Close "${event.name}" as completed?`)
                      }
                    >
                      <CheckCircle2 size={15} />
                      Close event
                    </button>
                  </>
                )}

                {!canAct && (
                  <button
                    type="button"
                    className="ed-btn"
                    onClick={() =>
                      change("Upcoming", `Reopen "${event.name}" as upcoming?`)
                    }
                  >
                    <RotateCcw size={15} />
                    Reopen event
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="ed-facts">
            <Fact
              icon={<CalendarDays size={14} />}
              label="Starts"
              value={start.main}
              sub={start.sub}
            />

            <Fact
              icon={<CalendarDays size={14} />}
              label="Ends"
              value={end.main}
              sub={end.sub}
            />

            <Fact
              icon={<User size={14} />}
              label="Organiser"
              value={event.organiser || "Not assigned"}
              sub={event.club && event.club !== "None / Platform-Wide" ? event.club : ""}
            />

            <Fact
              icon={<Percent size={14} />}
              label="Booking %"
              value={
                event.bookingPercentage !== undefined &&
                event.bookingPercentage !== ""
                  ? `${event.bookingPercentage}%`
                  : "—"
              }
              sub={
                bookingFrom && bookingTo
                  ? `Booking ${bookingFrom} → ${bookingTo}`
                  : ""
              }
            />
          </div>

          <div className="ed-location">
            <MapPin size={16} />
            <div>
              <span>Location</span>
              <strong>{location}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* SALES SNAPSHOT */}

      <section className="ed-stats" aria-label="Sales snapshot">
        <div className="ed-stat">
          <span>Tickets sold</span>

          <strong>
            {sold.toLocaleString("en-IN")}
            {capacity > 0 && <small>of {capacity.toLocaleString("en-IN")}</small>}
          </strong>

          {capacity > 0 && (
            <div
              className="ed-progress"
              role="progressbar"
              aria-label="Tickets sold"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
            >
              <i style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>

        <div className="ed-stat">
          <span>Potential revenue</span>
          <strong>{potential ? money(potential) : "—"}</strong>
        </div>

        <div className="ed-stat">
          <span>Ticket types</span>
          <strong>{tickets.length}</strong>
        </div>

        <div className="ed-stat">
          <span>Table booking fee</span>
          <strong>
            {event.clubTableBooking && event.fixedTableFee !== undefined
              ? money(event.fixedTableFee)
              : "Off"}
          </strong>
        </div>
      </section>

      {/* LINE-UP */}

      <section className="ed-card">
        <h3 className="ed-card-title">Line-up and tags</h3>

        <div className="ed-fields">
          <Labelled label="Language">
            <div className="ed-chips">
              {languages.length ? (
                languages.map((l) => (
                  <span className="ed-chip" key={l}>
                    {l}
                  </span>
                ))
              ) : (
                <span className="ed-empty">Not set</span>
              )}
            </div>
          </Labelled>

          <Labelled label="Genres">
            <div className="ed-chips">
              {genres.length ? (
                genres.map((g) => (
                  <span className="ed-chip" key={g}>
                    {g}
                  </span>
                ))
              ) : (
                <span className="ed-empty">Not set</span>
              )}
            </div>
          </Labelled>

          <Labelled label="Category">
            <div className="ed-chips">
              {categories.length ? (
                categories.map((c) => (
                  <span className="ed-chip" key={c}>
                    {c}
                  </span>
                ))
              ) : (
                <span className="ed-empty">Not set</span>
              )}
            </div>
          </Labelled>

          <Labelled label="Artists">
            <div className="ed-chips">
              {artists.length ? (
                artists.map((a) => (
                  <span className="ed-chip ed-chip-artist" key={a}>
                    <span
                      className={`ed-avatar tone-${
                        TONES[hashOf(a) % TONES.length]
                      }`}
                      aria-hidden="true"
                    >
                      {initialsOf(a)}
                    </span>
                    {a}
                  </span>
                ))
              ) : (
                <span className="ed-empty">No artists added</span>
              )}
            </div>
          </Labelled>

          {(employees.length > 0 || event.club) && (
            <Labelled label="Team">
              <div className="ed-chips">
                {event.club && (
                  <span className="ed-chip">
                    <Building2 size={14} />
                    {event.club}
                  </span>
                )}

                {employees.map((name) => (
                  <span className="ed-chip" key={name}>
                    <UsersRound size={14} />
                    {name}
                  </span>
                ))}
              </div>
            </Labelled>
          )}
        </div>
      </section>

      {/* ABOUT + TERMS */}

      <div className="ed-grid-2">
        <section className="ed-card">
          <h3 className="ed-card-title">About</h3>
          <RichText text={event.description} empty="No description added." />
        </section>

        <section className="ed-card">
          <h3 className="ed-card-title">Terms</h3>
          <RichText text={event.terms} empty="No terms added." />
        </section>
      </div>

      {/* TICKETS */}

      <section className="ed-card ed-card-flush">
        <h3 className="ed-card-title ed-card-title-pad">Tickets</h3>

        {tickets.length === 0 ? (
          <p className="ed-empty ed-empty-pad">
            No ticket details have been added for this event.
          </p>
        ) : (
          <div className="ed-table-wrap">
            <table className="ed-table">
              <thead>
                <tr>
                  <th>Ticket type</th>
                  <th>Price</th>
                  <th>GST</th>
                  <th>Total tickets</th>
                  <th>Passes</th>
                  <th>Description</th>
                  <th>Sold</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((t) => {
                  const p = t.total ? Math.min(100, (t.sold / t.total) * 100) : 0;

                  return (
                    <tr key={t.key}>
                      <td>
                        <strong>{t.type}</strong>

                        {(t.online || t.offline) && (
                          <div className="ed-flags">
                            {t.online && <span>Online sold out</span>}
                            {t.offline && <span>Offline sold out</span>}
                          </div>
                        )}
                      </td>

                      <td>{money(t.price)}</td>

                      <td>
                        {t.gst !== undefined && t.gst !== "" ? `${t.gst}%` : "—"}
                      </td>

                      <td>{t.total.toLocaleString("en-IN")}</td>

                      <td>{t.passes}</td>

                      <td className="ed-desc">{t.desc || "—"}</td>

                      <td>
                        {t.hasSold ? (
                          <div className="ed-sold">
                            <span>
                              <b>{t.sold}</b> / {t.total}
                            </span>

                            <div className="ed-progress">
                              <i style={{ width: `${p}%` }} />
                            </div>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr>
                  <td>Total</td>
                  <td />
                  <td />
                  <td>{capacity.toLocaleString("en-IN")}</td>
                  <td />
                  <td />
                  <td>{sold.toLocaleString("en-IN")} sold</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      {/* LAYOUT LIGHTBOX */}

      {layoutOpen && (
        <div
          className="ed-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Venue layout"
          onClick={() => setLayoutOpen(false)}
        >
          <div className="ed-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ed-lightbox-close"
              aria-label="Close layout"
              onClick={() => setLayoutOpen(false)}
            >
              <X size={18} />
            </button>

            <h3>Venue layout</h3>

            {event.layoutImage && (
              <img src={event.layoutImage} alt="Venue layout" />
            )}

            {event.layoutDescription && <p>{event.layoutDescription}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
