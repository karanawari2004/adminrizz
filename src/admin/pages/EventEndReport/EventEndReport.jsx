import { useEffect, useRef, useState } from "react";
import "./EventEndReport.css";

/* =====================================================
   DATA
===================================================== */

const clubs = [
  { name: "All Partners", initials: "AP", description: "Every club", tone: "all" },
  { name: "Thalaasa", initials: "TH", description: "12 events", tone: "teal" },
  { name: "Goa Club", initials: "GC", description: "8 events", tone: "orange" },
  { name: "Rizztixx", initials: "RZ", description: "5 events", tone: "purple" },
];

const completedEvents = [
  { id: "ev-1", club: "Goa Club", name: "GOA SUNSPLASH", date: "2026-11-17" },
  { id: "ev-2", club: "Goa Club", name: "After Dark", date: "2026-11-16" },
];

/* =====================================================
   DATE HELPERS
===================================================== */

const fmtDate = (d) => d.split("-").reverse().join("-");

const parseDate = (value) => {
  if (!value) return new Date();

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const formatISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const sameDate = (a, b) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =====================================================
   FLOATING SPARKS
===================================================== */

function Sparks() {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReduced()) return undefined;

    const cv = ref.current;
    if (!cv) return undefined;

    const parent = cv.parentElement;
    const cx = cv.getContext("2d");

    const colors = ["#ff8a1f", "#ff3d81", "#8b5cf6", "#22d3ee"];

    let W = 0;
    let H = 0;
    let raf;

    const size = () => {
      W = cv.width = parent.clientWidth;
      H = cv.height = parent.clientHeight;
    };

    size();

    const ro = new ResizeObserver(size);
    ro.observe(parent);

    const particles = Array.from({ length: 55 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.2 + 0.5,
      v: Math.random() * 0.5 + 0.15,
      c: colors[i % 4],
      o: Math.random() * 0.6 + 0.2,
    }));

    const loop = () => {
      cx.clearRect(0, 0, W, H);

      particles.forEach((p) => {
        p.y -= p.v;
        p.x += Math.sin(p.y / 60) * 0.3;

        if (p.y < -10) {
          p.y = H + 10;
          p.x = Math.random() * W;
        }

        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, 7);

        cx.fillStyle = p.c;
        cx.globalAlpha = p.o;
        cx.shadowBlur = 12;
        cx.shadowColor = p.c;

        cx.fill();
      });

      cx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="er-sparks" />;
}

/* =====================================================
   CUSTOM DATE PICKER
===================================================== */

function DatePicker({ label, value, onChange, rangeStart, rangeEnd }) {
  const [isOpen, setIsOpen] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(() => {
    return parseDate(value);
  });

  const pickerRef = useRef(null);

  const selectedDate = parseDate(value);

  const today = new Date();

  /* Update calendar month when selected date changes */

  useEffect(() => {
    if (value) {
      setCurrentMonth(parseDate(value));
    }
  }, [value]);

  /* Close calendar when clicking outside */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* Previous month */

  const previousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  /* Next month */

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  /* Calendar month information */

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);

  const lastDay = new Date(year, month + 1, 0);

  /* Monday as first day of week */

  const startOffset = (firstDay.getDay() + 6) % 7;

  const totalCells = Math.ceil(
    (startOffset + lastDay.getDate()) / 7
  ) * 7;

  const calendarDays = Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(year, month, index - startOffset + 1);

    return date;
  });

  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  /* Select date */

  const handleDateSelect = (date) => {
    onChange(formatISO(date));
    setCurrentMonth(date);
    setIsOpen(false);
  };

  /* Range calculations */

  const start = rangeStart ? parseDate(rangeStart) : null;
  const end = rangeEnd ? parseDate(rangeEnd) : null;

  const rangeIsValid = start && end && start <= end;

  const monthTitle = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="er-date-picker" ref={pickerRef}>
      <label className="er-field">
        {label}

        <input
          type="text"
          value={value ? fmtDate(value) : ""}
          placeholder="DD-MM-YYYY"
          readOnly
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={`${label} date`}
          aria-expanded={isOpen}
        />
      </label>

      {isOpen && (
        <div className="dp">
          {/* CALENDAR EYEBROW */}

          <p className="dp-eyebrow">SELECT DATE</p>

          {/* CALENDAR HEADER */}

          <div className="dp-header">
            <button
              type="button"
              className="dp-nav"
              onClick={previousMonth}
              aria-label="Previous month"
            >
              &#10094;
            </button>

            <h3 className="dp-title">{monthTitle}</h3>

            <button
              type="button"
              className="dp-nav"
              onClick={nextMonth}
              aria-label="Next month"
            >
              &#10095;
            </button>
          </div>

          {/* WEEKDAYS */}

          <div className="dp-weekdays">
            {weekdays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          {/* DATE GRID */}

          <div className="dp-grid">
            {calendarDays.map((date, index) => {
              const isoDate = formatISO(date);

              const isOutside = date.getMonth() !== month;

              const isSelected = sameDate(date, selectedDate);

              const isToday = sameDate(date, today);

              const isRangeStart =
                rangeIsValid && sameDate(date, start);

              const isRangeEnd =
                rangeIsValid && sameDate(date, end);

              const isInRange =
                rangeIsValid &&
                date > start &&
                date < end;

              const isSingleDay =
                isRangeStart && isRangeEnd;

              const classes = [
                "dp-day",
                isOutside && "is-outside",
                isToday && "is-today",
                isSelected && "is-selected",
                isInRange && "in-range",
                isRangeStart && "range-start",
                isRangeEnd && "range-end",
                isSingleDay && "range-start range-end",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={`${isoDate}-${index}`}
                  type="button"
                  className={classes}
                  onClick={() => handleDateSelect(date)}
                  aria-label={date.toLocaleDateString("en-US", {
                    dateStyle: "full",
                  })}
                  aria-pressed={isSelected}
                >
                  <span className="dp-day-num">
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* FOOTER */}

          <p className="dp-footer">
            {value ? `Selected: ${fmtDate(value)}` : "Choose a date"}
          </p>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   PAGE
===================================================== */

export default function EventEndReport({ onDownload }) {
  const [club, setClub] = useState("All Partners");

  const [fromDate, setFromDate] = useState("2026-11-15");

  const [toDate, setToDate] = useState("2026-11-19");

  const [selectedEvent, setSelectedEvent] = useState("");
  const [clubDropdownOpen, setClubDropdownOpen] = useState(false);
  const clubDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        clubDropdownRef.current &&
        !clubDropdownRef.current.contains(event.target)
      ) {
        setClubDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setClubDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const clubSelected = club !== "All Partners";

  /* Filter completed events */

  const available = completedEvents.filter(
    (e) =>
      e.club === club &&
      e.date >= fromDate &&
      e.date <= toDate
  );

  /* Change club */

  const changeClub = (value) => {
    setClub(value);
    setSelectedEvent("");
    setClubDropdownOpen(false);
  };

  /* Download event */

  const handleDownload = () => {
    const ev = available.find((e) => e.id === selectedEvent);

    if (ev && onDownload) {
      onDownload(ev);
    }
  };

  return (
    <div className="event-end-page">
      <div className="er-bg" aria-hidden="true">
        <div className="er-aurora">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="er-grid-bg" />

        <Sparks />
      </div>

      {/* HEADER */}

      <header className="er-header">
        <div>
          <h2>Event End Report</h2>

          <p className="er-subtitle">
            {clubSelected
              ? `${club} · ${fmtDate(fromDate)} to ${fmtDate(toDate)}`
              : "Choose a club to begin"}
          </p>
        </div>

        <div className="er-breadcrumb">
          <span>⌂</span>
          <span>Sales Analysis</span>
          <b>/</b>
          <span className="er-current">Event End Report</span>
        </div>
      </header>

      {/* CLUB FILTER */}

      <div className="er-card er-club-card">
        <label className="er-field">
          Club (Admin)

          <div className="er-select-wrap er-custom-select" ref={clubDropdownRef}>
            <button
              type="button"
              className={`er-select-trigger${clubDropdownOpen ? " is-open" : ""}`}
              onClick={() => setClubDropdownOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={clubDropdownOpen}
              aria-label={`Club (Admin): ${club}`}
            >
              <span className="er-select-value">
                <span className={`er-option-avatar er-avatar-${clubs.find((item) => item.name === club)?.tone || "all"}`}>
                  {clubs.find((item) => item.name === club)?.initials || "AP"}
                </span>
                <span className="er-select-current">{club}</span>
              </span>
              <span className={`er-select-chevron${clubDropdownOpen ? " is-open" : ""}`} aria-hidden="true" />
            </button>

            {clubDropdownOpen && (
              <div className="er-select-menu" role="listbox" aria-label="Choose a club">
                {clubs.map((item) => {
                  const isSelected = club === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`er-select-option${isSelected ? " is-selected" : ""}`}
                      onClick={() => changeClub(item.name)}
                    >
                      <span className={`er-option-avatar er-avatar-${item.tone}`}>
                        {item.initials}
                      </span>
                      <span className="er-option-copy">
                        <span className="er-option-title">{item.name}</span>
                        <span className="er-option-description">{item.description}</span>
                      </span>
                      {isSelected && (
                        <svg className="er-option-check" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="m5 10 3.2 3.2L15.5 6" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {clubSelected && (
              <button
                aria-label="Clear club"
                className="er-clear"
                onClick={() => changeClub("All Partners")}
                type="button"
              >
                ×
              </button>
            )}
          </div>
        </label>

        {!clubSelected && (
          <p className="er-hint">
            <i />
            Select A Club To Set The Event Date Range And Load Sales.
          </p>
        )}
      </div>

      {/* MAIN REPORT */}

      {clubSelected && (
        <div className="er-card er-main-card">

          {/* DATE RANGE */}

          <div className="er-heading-row">
            <div>
              <h3>Event Date Range</h3>

              <p>
                Filters Events By Start Date And Matches The Sales Report.
                Pick Ongoing, Upcoming, Or Past, Then Click Load Report.
              </p>
            </div>

            <span className="er-badge">{club}</span>
          </div>

          {/* CUSTOM DATE PICKERS */}

          <div className="er-date-fields">

            <DatePicker
              label="From"
              value={fromDate}
              onChange={(date) => {
                setFromDate(date);
                setSelectedEvent("");
              }}
              rangeStart={fromDate}
              rangeEnd={toDate}
            />

            <DatePicker
              label="To"
              value={toDate}
              onChange={(date) => {
                setToDate(date);
                setSelectedEvent("");
              }}
              rangeStart={fromDate}
              rangeEnd={toDate}
            />

          </div>

          <div className="er-divider" />

          {/* COMPLETED EVENTS */}

          <div className="er-heading-row">
            <div>
              <h3>Completed Events</h3>

              <p>
                Download The Full Event Summary After All Scanner Devices
                Have Synced And Closed. Separate From The Sales Report
                Event Filter Above.
              </p>
            </div>
          </div>

          <label className="er-field er-completed-field">
            Completed Event

            <select
              disabled={available.length === 0}
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              {available.length === 0 ? (
                <option value="">
                  No Completed Events In This Date Range
                </option>
              ) : (
                <>
                  <option value="">
                    Select a completed event
                  </option>

                  {available.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} · {fmtDate(e.date)}
                    </option>
                  ))}
                </>
              )}
            </select>
          </label>

          {/* DOWNLOAD BUTTON */}

          <button
            className="er-download-button"
            disabled={!selectedEvent}
            onClick={handleDownload}
            type="button"
          >
            ⬇ Download Event Summary
          </button>

        </div>
      )}
    </div>
  );
}