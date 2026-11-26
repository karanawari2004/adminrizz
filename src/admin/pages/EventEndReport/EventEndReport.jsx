import { useEffect, useRef, useState } from "react";
import "./EventEndReport.css";

/* =====================================================
   DATA  (replace with your API response later)
   ===================================================== */
const clubs = ["All Partners", "Thalaasa", "Goa Club", "Rizztixx"];

// Completed events (SAMPLE). Thalaasa has none in the date range, like your screenshot.
const completedEvents = [
  { id: "ev-1", club: "Goa Club", name: "GOA SUNSPLASH", date: "2026-11-17" },
  { id: "ev-2", club: "Goa Club", name: "After Dark", date: "2026-11-16" },
];

const fmtDate = (d) => d.split("-").reverse().join("-");

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Floating glowing sparks behind the page */
function Sparks() {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReduced()) return undefined;
    const cv = ref.current;
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
   PAGE
   ===================================================== */
export default function EventEndReport({ onDownload }) {
  const [club, setClub] = useState("All Partners");
  const [fromDate, setFromDate] = useState("2026-11-15");
  const [toDate, setToDate] = useState("2026-11-19");
  const [selectedEvent, setSelectedEvent] = useState("");

  const clubSelected = club !== "All Partners";

  const available = completedEvents.filter(
    (e) => e.club === club && e.date >= fromDate && e.date <= toDate
  );

  const changeClub = (value) => {
    setClub(value);
    setSelectedEvent("");
  };

  const handleDownload = () => {
    const ev = available.find((e) => e.id === selectedEvent);
    if (ev && onDownload) onDownload(ev);
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
          <div className="er-select-wrap">
            <select value={club} onChange={(e) => changeClub(e.target.value)}>
              {clubs.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

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

      {clubSelected && (
        <div className="er-card er-main-card">
          {/* DATE RANGE */}
          <div className="er-heading-row">
            <div>
              <h3>Event Date Range</h3>
              <p>
                Filters Events By Start Date And Matches The Sales Report. Pick Ongoing,
                Upcoming, Or Past, Then Click Load Report.
              </p>
            </div>

            <span className="er-badge">{club}</span>
          </div>

          <div className="er-date-fields">
            <label className="er-field">
              From
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setSelectedEvent("");
                }}
              />
            </label>

            <label className="er-field">
              To
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setSelectedEvent("");
                }}
              />
            </label>
          </div>

          <div className="er-divider" />

          {/* COMPLETED EVENTS */}
          <div className="er-heading-row">
            <div>
              <h3>Completed Events</h3>
              <p>
                Download The Full Event Summary After All Scanner Devices Have Synced And
                Closed. Separate From The Sales Report Event Filter Above.
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
                <option value="">No Completed Events In This Date Range</option>
              ) : (
                <>
                  <option value="">Select a completed event</option>
                  {available.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} · {fmtDate(e.date)}
                    </option>
                  ))}
                </>
              )}
            </select>
          </label>

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