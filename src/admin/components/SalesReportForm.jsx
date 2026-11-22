import { useEffect, useRef, useState } from "react";
import "./SalesReportForm.css";

/* =====================================================
   DATA  (replace with your API response later)
   ===================================================== */
const salesData = {
  ticketsSold: 29,
  totalRevenue: 14000,
  bookings: 3,
  guests: 24,
  tableRevenue: 340000,
  minSpend: 340000,

  channels: [
    { name: "Online", tickets: 16, amount: 14000, color: "online" },
    { name: "Offline (Paid)", tickets: 0, amount: 0, color: "offline" },
    { name: "On Ground", tickets: 8, amount: 10000, color: "ground" },
    { name: "Guestlist", tickets: 5, amount: 0, color: "guestlist" },
  ],

  addons: [
    { name: "Ticket Add-On", amount: 0, icon: "🎟️" },
    { name: "Table Add-On", amount: 0, icon: "🍾" },
    { name: "Preorder", amount: 0, icon: "🛒" },
    { name: "Preorder Extra (Online)", amount: 0, icon: "⭐" },
  ],

  // SAMPLE values for the bar chart. Connect to your real per-month revenue.
  monthly: [
    { month: "Jan", value: 11000},
    { month: "Feb", value: 50000 },
    { month: "Mar", value: 5000 },
    { month: "Apr", value: 15000},
    { month: "May", value: 2000 },
    { month: "Jun", value: 30000 },
    { month: "Jul", value: 20000 },
    { month: "Aug", value: 10000 },
    { month: "Sep", value: 15000},
    { month: "Oct", value: 1000 },
    { month: "Nov", value: 14000 },
    { month: "Dec", value: 100},
  ],

  events: [
    {
      name: "GOA SUNSPLASH",
      date: "17 Nov 2026, 11:06 PM",
      orders: 29,
      sold: 29,
      capacity: 300,
      revenue: 14000,
      commission: 495.6,
      cgst: 37.8,
      sgst: 37.8,
      status: "Ended",
    },
  ],

  categories: [
    { name: "GA", sold: 6, capacity: 100, revenue: 0, price: 0, online: 6, offline: 0, guestlist: 0 },
    { name: "VVIP", sold: 17, capacity: 100, revenue: 6000, price: 1000, online: 6, offline: 0, guestlist: 5 },
    { name: "Couple Entry", sold: 6, capacity: 100, revenue: 8000, price: 2000, online: 4, offline: 0, guestlist: 0 },
  ],

  staff: [
    {
      name: "Thalaasa Employee",
      reference: "THEM1594",
      bookings: 2,
      guests: 14,
      revenue: 140000,
      minSpend: 140000,
    },
  ],
};

/* =====================================================
   HELPERS
   ===================================================== */
const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`;

const formatFixedCurrency = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/* Compact currency for narrow bar labels: ₹14K, ₹1.2L, ₹2.5Cr */
const formatCompact = (n) => {
  if (n >= 10000000) return `₹${+(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${+(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${+(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

const fmtDate = (d) => d.split("-").reverse().join("-");

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =====================================================
   ANIMATION COMPONENTS
   ===================================================== */

/* Numbers that count up from 0 */
function CountUp({ to, prefix = "", decimals = 0, duration = 1900, delay = 400 }) {
  const [val, setVal] = useState(prefersReduced() ? to : 0);

  useEffect(() => {
    if (prefersReduced()) {
      setVal(to);
      return undefined;
    }
    let raf;
    const t0 = performance.now() + delay;
    const tick = (now) => {
      const p = Math.max(0, Math.min((now - t0) / duration, 1));
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, delay]);

  return (
    <>
      {prefix}
      {val.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </>
  );
}

/* Card that tilts in 3D and has a spotlight following the mouse */
function Tilt({ className = "", delay = 0, children }) {
  const onMove = (e) => {
    if (prefersReduced()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    const rx = (y / r.height - 0.5) * -9;
    const ry = (x / r.width - 0.5) * 9;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  };

  const onLeave = (e) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <div
      className={className}
      style={{ "--d": `${delay}s` }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

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

  return <canvas ref={ref} className="sr-sparks" />;
}

/* Donut chart: tickets by channel */
function DonutChart({ channels, total }) {
  const [ready, setReady] = useState(prefersReduced());

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  const C = 2 * Math.PI * 48;
  let acc = 0;
  const segments = channels.map((ch) => {
    const len = total ? (ch.tickets / total) * C : 0;
    const seg = { ...ch, len, offset: -acc };
    acc += len;
    return seg;
  });

  return (
    <div className="sr-donut-wrap">
      <div className="sr-donut-box">
        <svg className="sr-donut" viewBox="0 0 120 120">
          <circle className="sr-donut-bg" cx="60" cy="60" r="48" />
          {segments.map(
            (s) =>
              s.len > 0 && (
                <circle
                  key={s.name}
                  className={`sr-donut-seg ${s.color}`}
                  cx="60"
                  cy="60"
                  r="48"
                  style={{
                    strokeDasharray: ready
                      ? `${Math.max(s.len - 6, 0.1)} ${C}`
                      : `0 ${C}`,
                    strokeDashoffset: s.offset,
                  }}
                />
              )
          )}
        </svg>

        <div className="sr-donut-center">
          <strong>
            <CountUp to={total} />
          </strong>
          <span>tickets</span>
        </div>
      </div>

      <div className="sr-legend">
        {channels.map((ch) => (
          <div key={ch.name}>
            <i className={ch.color} />
            {ch.name}
            <b>{ch.tickets}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Bar chart: revenue by month (12 vertical bars) */
function BarChart({ data }) {
  const [ready, setReady] = useState(prefersReduced());

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  const max = Math.max(...data.map((d) => Number(d.value) || 0), 1);

  const getBarColor = (value) => {
    const percentage = (Number(value) / max) * 100;

    if (percentage <= 20) return "#BFDBFE";
    if (percentage <= 40) return "#93C5FD";
    if (percentage <= 60) return "#60A5FA";
    if (percentage <= 80) return "#3B82F6";
    return "#1D4ED8";
  };

  return (
    <div
      className="sr-bars sr-bars-12"
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "10px",
        width: "100%",
        height: "220px",
        padding: "12px 4px 0",
        boxSizing: "border-box",
      }}
    >
      {data.map((d) => {
        const value = Number(d.value) || 0;
        const barHeight = Math.max((value / max) * 100, 4);

        return (
          <div
            key={d.month}
            title={`${d.month}: ${formatCurrency(value)}`}
            style={{
              flex: "1 1 0",
              minWidth: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <em
              style={{
                minHeight: "18px",
                marginBottom: "5px",
                fontSize: "10px",
                fontStyle: "normal",
                fontWeight: 600,
                color: "#64748B",
                whiteSpace: "nowrap",
              }}
            >
              {value > 0 ? formatCompact(value) : ""}
            </em>

            <div
              style={{
                width: " min(22px, 75%)",
                height: ready ? `${barHeight}%` : "0%",
                minHeight: ready ? "5px" : "0",
                backgroundColor: getBarColor(value),
                borderRadius: "8px 8px 0 0",
                transition: "height 900ms cubic-bezier(0.22, 1, 0.36, 1), background-color 250ms ease",
                boxShadow: value > 0 ? "0 3px 10px rgba(37, 99, 235, 0.12)" : "none",
              }}
            />

            <span
              style={{
                marginTop: "8px",
                fontSize: "11px",
                lineHeight: 1,
                color: "#475569",
                whiteSpace: "nowrap",
              }}
            >
              {d.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* =====================================================
   LAYOUT COMPONENTS
   ===================================================== */
function Section({ title, subtitle, children }) {
  return (
    <section className="sr-section">
      <div className="sr-section-heading">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="sr-section-content">{children}</div>
    </section>
  );
}

function StatCard({ icon, title, value, subtitle, hero = false, delay = 0 }) {
  return (
    <Tilt className={`sr-stat-card${hero ? " sr-hero" : ""}`} delay={delay}>
      <span>
        {icon && <b className="sr-icon">{icon}</b>}
        {title}
      </span>
      <h2>{value}</h2>
      {subtitle && <p>{subtitle}</p>}
    </Tilt>
  );
}

/* =====================================================
   MAIN PAGE
   ===================================================== */
export default function SalesReportForm({ club = "Thalaasa" }) {
  const [selectedClub, setSelectedClub] = useState(club);
  const [eventType, setEventType] = useState("All Types");
  const [event, setEvent] = useState("GOA SUNSPLASH");
  const [channel, setChannel] = useState("All Channels");
  const [employee, setEmployee] = useState("All Employees");

  const [fromDate, setFromDate] = useState("2026-11-15");
  const [toDate, setToDate] = useState("2026-11-19");

  const [loaded, setLoaded] = useState(false);

  const ev = salesData.events[0];
  const totalTickets = salesData.channels.reduce((sum, c) => sum + c.tickets, 0);
  const guestlist = salesData.channels.find((c) => c.name === "Guestlist");
  const topCategory = [...salesData.categories].sort((a, b) => b.sold - a.sold)[0];

  const tickerItems = [
    { icon: "🔥", text: `${ev.name} · ${salesData.ticketsSold} tickets sold` },
    { icon: "💰", text: `${formatCurrency(salesData.totalRevenue)} online revenue` },
    {
      icon: "🍾",
      text: `${salesData.bookings} table bookings · ${formatCurrency(salesData.tableRevenue)}`,
    },
    { icon: "🎉", text: `${guestlist ? guestlist.tickets : 0} guestlist entries` },
    { icon: "⚡", text: `${topCategory.name} is the top-selling category` },
  ];

  return (
    <div className="sales-report-page">
      <div className="sr-bg" aria-hidden="true">
        <div className="sr-aurora">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="sr-grid-bg" />
        <Sparks />
      </div>

      {/* HEADER */}
      <header className="sr-header">
        <div>
          <h2>Sales Report</h2>
          <p className="sr-subtitle">
            {event} · {fmtDate(fromDate)} to {fmtDate(toDate)} · {selectedClub}
          </p>
        </div>

        <div className="sr-header-right">
          <div className="sr-live">
            <i /> Live data
          </div>

          <div className="sr-breadcrumb">
            <span>⌂</span>
            <span>Sales Analysis</span>
            <b>/</b>
            <span className="sr-current">Sales Report</span>
          </div>
        </div>
      </header>

      {/* CLUB FILTER */}
      <div className="sr-filter-card sr-club-filter">
        <label>Club (Admin)</label>

        <select value={selectedClub} onChange={(e) => setSelectedClub(e.target.value)}>
          <option>Thalaasa</option>
          <option>All Partners</option>
          <option>Goa Club</option>
          <option>Rizztixx</option>
        </select>
      </div>

      {/* DATE RANGE */}
      <div className="sr-filter-card sr-date-filter">
        <div className="sr-filter-heading">
          <div>
            <h3>Event Date Range</h3>
            <p>
              Filters Events By Start Date And Matches The Sales Report. Pick Ongoing,
              Upcoming, Or Past, Then Click Load Report.
            </p>
          </div>

          <span className="sr-club-badge">{selectedClub}</span>
        </div>

        <div className="sr-date-fields">
          <label>
            From
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>

          <label>
            To
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>
        </div>
      </div>

      {/* REPORT FILTERS */}
      <div className="sr-filter-card sr-main-filter">
        <h3>Sales Report</h3>

        <div className="sr-filter-grid">
          <label>
            Event Type
            <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
              <option>All Types</option>
              <option>Ongoing</option>
              <option>Upcoming</option>
              <option>Past</option>
            </select>
          </label>

          <label>
            Event
            <select value={event} onChange={(e) => setEvent(e.target.value)}>
              <option>GOA SUNSPLASH</option>
              <option>Starly</option>
              <option>After Dark</option>
            </select>
          </label>

          <label>
            Sale Channel
            <select value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option>All Channels</option>
              <option>Online</option>
              <option>Offline</option>
              <option>On Ground</option>
              <option>Guestlist</option>
            </select>
          </label>

          <label>
            Sold By (Employee)
            <select value={employee} onChange={(e) => setEmployee(e.target.value)}>
              <option>All Employees</option>
              <option>System Admin</option>
              <option>Thalaasa Employee</option>
              <option>Box Office</option>
            </select>

            <small>
              Filters Offline Ticket Sales And Table Bookings.
              <br />
              Referred Via Emp Ref.
            </small>
          </label>
        </div>

        <button className="sr-load-button" onClick={() => setLoaded(true)} type="button">
          ✨ Load Report ↗
        </button>
      </div>

      {loaded && (
        <div className="sr-dashboard">
          {/* TICKER */}
          <div className="sr-ticker">
            <div className="sr-ticker-track">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i}>
                  <b>{item.icon}</b>
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="sr-summary-grid">
            <StatCard
              icon="🎟️"
              title="Tickets Sold"
              value={<CountUp to={salesData.ticketsSold} />}
              subtitle={`${ev.orders} Bookings (Orders)`}
              delay={0.1}
            />

            <StatCard
              hero
              icon="💰"
              title="Total Revenue"
              value={<CountUp to={salesData.totalRevenue} prefix="₹" />}
              subtitle="All channels"
              delay={0.2}
            />

            <StatCard
              icon="🍾"
              title="Table Revenue"
              value={<CountUp to={salesData.tableRevenue} prefix="₹" />}
              subtitle={`${salesData.bookings} bookings · ${salesData.guests} guests`}
              delay={0.3}
            />

            <StatCard
              icon="📈"
              title="Rizztixx Commission (2%)"
              value={<CountUp to={ev.commission} prefix="₹" decimals={2} />}
              subtitle={`CGST ${formatFixedCurrency(ev.cgst)} · SGST ${formatFixedCurrency(ev.sgst)}`}
              delay={0.4}
            />
          </div>

          {/* CHANNEL OVERVIEW */}
          <Section title="Channel Overview">
            <div className="sr-chart-grid">
              <Tilt className="sr-chart-card" delay={0.1}>
                <span className="sr-card-label">Tickets By Channel</span>
                <DonutChart channels={salesData.channels} total={totalTickets} />
              </Tilt>

              <Tilt className="sr-chart-card" delay={0.2}>
                <span className="sr-card-label">Revenue By Month (₹)</span>
                <BarChart data={salesData.monthly} />
              </Tilt>
            </div>

            <div className="sr-channel-grid">
              {salesData.channels.map((item, i) => (
                <Tilt
                  className={`sr-channel-card ${item.color}`}
                  delay={0.15 + i * 0.1}
                  key={item.name}
                >
                  <div className="sr-channel-card-heading">
                    <span>Channel</span>
                    <b className={`sr-channel-tag ${item.color}`}>
                      {item.name.replace(" (Paid)", "").toUpperCase()}
                    </b>
                  </div>

                  <h2 className={item.name === "Guestlist" ? "sr-small-title" : ""}>
                    {item.name === "Guestlist" ? (
                      "Complimentary (No Revenue)"
                    ) : item.tickets === 0 ? (
                      "—"
                    ) : (
                      <CountUp to={item.amount} prefix="₹" />
                    )}
                  </h2>

                  <p>
                    {item.tickets} Orders · {item.tickets} Tickets
                  </p>
                </Tilt>
              ))}
            </div>
          </Section>

          {/* TABLE BOOKINGS */}
          <Section title="Table Bookings">
            <div className="sr-section-top">
              <button className="sr-outline-button" type="button">
                ♧ Share Table Sheet
              </button>
            </div>

            <div className="sr-booking-grid">
              <StatCard icon="📅" title="Bookings" value={<CountUp to={salesData.bookings} />} delay={0.1} />
              <StatCard icon="👥" title="Guests" value={<CountUp to={salesData.guests} />} delay={0.2} />
              <StatCard
                icon="💵"
                title="Revenue Collected"
                value={<CountUp to={salesData.tableRevenue} prefix="₹" />}
                delay={0.3}
              />
              <StatCard
                icon="🍸"
                title="Min. Spend Total"
                value={<CountUp to={salesData.minSpend} prefix="₹" />}
                delay={0.4}
              />
            </div>
          </Section>

          {/* ADDONS */}
          <Section title="Add-Ons & Preorder (Booking Snapshots)">
            <div className="sr-addon-grid">
              {salesData.addons.map((item, i) => (
                <StatCard
                  key={item.name}
                  icon={item.icon}
                  title={item.name}
                  value={<CountUp to={item.amount} prefix="₹" />}
                  delay={0.1 + i * 0.1}
                />
              ))}
            </div>
          </Section>

          {/* SALES BY EVENT */}
          <Section
            title="Sales By Event"
            subtitle="Ticket Sales For The Selected Event. Table Bookings Are Shown In The Section Below."
          >
            <div className="sr-table-wrapper">
              <table className="sr-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>When</th>
                    <th>Ticket Orders</th>
                    <th>Tickets Sold</th>
                    <th>Online Revenue</th>
                    <th>Rizztixx Commission (2%)</th>
                    <th>Cgst (9%)</th>
                    <th>Sgst (9%)</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {salesData.events.map((item) => (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>{item.date}</td>
                      <td>{item.orders}</td>

                      <td>
                        <strong>{item.sold}</strong>
                        <span className="sr-capacity">/ {item.capacity}</span>

                        <div className="sr-progress">
                          <div style={{ width: `${(item.sold / item.capacity) * 100}%` }} />
                        </div>
                      </td>

                      <td>{formatFixedCurrency(item.revenue)}</td>
                      <td>{formatFixedCurrency(item.commission)} ⓘ</td>
                      <td>{formatFixedCurrency(item.cgst)}</td>
                      <td>{formatFixedCurrency(item.sgst)}</td>

                      <td>
                        <span className="sr-status">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* CATEGORY BREAKDOWN */}
          <Section
            title="Category Breakdown"
            subtitle={`Ticket Types For ${event}. Includes All Tiers On The Event, Even With Zero Sales.`}
          >
            <div className="sr-table-wrapper">
              <table className="sr-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Tickets Sold</th>
                    <th>Online Revenue</th>
                    <th>Price</th>
                    <th>Online Tickets</th>
                    <th>Offline Tickets</th>
                    <th>Guestlist</th>
                  </tr>
                </thead>

                <tbody>
                  {salesData.categories.map((item) => (
                    <tr key={item.name}>
                      <td>{item.name}</td>

                      <td>
                        <strong>{item.sold}</strong>
                        <span className="sr-capacity">/ {item.capacity}</span>

                        <div className="sr-progress">
                          <div style={{ width: `${(item.sold / item.capacity) * 100}%` }} />
                        </div>
                      </td>

                      <td>{formatFixedCurrency(item.revenue)}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{item.online}</td>
                      <td>{item.offline}</td>
                      <td>{item.guestlist || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* TABLE BOOKING DETAILS */}
          <Section title="Table Bookings">
            <div className="sr-table-wrapper">
              <table className="sr-table">
                <thead>
                  <tr>
                    <th>Bookings</th>
                    <th>Guests</th>
                    <th>Table Revenue</th>
                    <th>Min. Spend</th>
                    <th>Rizztixx Commission</th>
                    <th>Cgst (9%)</th>
                    <th>Sgst (9%)</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>{salesData.bookings}</td>
                    <td>{salesData.guests}</td>
                    <td>{formatFixedCurrency(salesData.tableRevenue)}</td>
                    <td>{formatFixedCurrency(salesData.minSpend)}</td>
                    <td>₹7,741.39 ⓘ</td>
                    <td>₹590.44</td>
                    <td>₹590.45</td>
                    <td>
                      <button className="sr-view-button" type="button">
                        View Table Bookings
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* STAFF REFERENCE */}
          <Section
            title="Table Bookings By Staff Reference"
            subtitle="Referred Table Bookings Only — Separate From Offline Ticket Sales Below."
          >
            <div className="sr-table-wrapper">
              <table className="sr-table">
                <thead>
                  <tr>
                    <th>Staff</th>
                    <th>Emp Ref</th>
                    <th>Bookings</th>
                    <th>Guests</th>
                    <th>Total Revenue</th>
                    <th>Min. Spend</th>
                  </tr>
                </thead>

                <tbody>
                  {salesData.staff.map((item) => (
                    <tr key={item.reference}>
                      <td>{item.name}</td>
                      <td>{item.reference}</td>
                      <td>{item.bookings}</td>
                      <td>{item.guests}</td>
                      <td>{formatFixedCurrency(item.revenue)}</td>
                      <td>{formatFixedCurrency(item.minSpend)}</td>
                    </tr>
                  ))}

                  <tr className="sr-total-row">
                    <td>Total</td>
                    <td>—</td>
                    <td>2</td>
                    <td>14</td>
                    <td>{formatFixedCurrency(140000)}</td>
                    <td>{formatFixedCurrency(140000)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="sr-footer-note">
              Only Bookings Where The Guest Entered A Staff Reference.
            </p>
          </Section>
        </div>
      )}
    </div>
  );
}