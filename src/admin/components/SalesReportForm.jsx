import { useEffect, useRef, useState } from "react";
import "./SalesReportForm.css";

/* =====================================================
   DATA
   ===================================================== */
const salesData = {
  ticketsSold: 250,
  totalRevenue: 14000,
  bookings: 3,
  guests: 24,
  tableRevenue: 340000,
  minSpend: 340000,

  channels: [
    { name: "Online", tickets: 16, amount: 14000, color: "online" },
    { name: "Offline (Paid)", tickets: 0, amount: 17000, color: "offline" },
    { name: "On Ground", tickets: 8, amount: 10000, color: "ground" },
    { name: "Guestlist", tickets: 5, amount: 0, color: "guestlist" },
  ],

  addons: [
    { name: "Ticket Add-On", amount: 10, icon: "🎟️" },
    { name: "Table Add-On", amount: 20, icon: "🍾" },
    { name: "Preorder", amount: 30, icon: "🛒" },
    { name: "Preorder Extra (Online)", amount: 40, icon: "⭐" },
  ],

  events: [
    {
      name: "GOA SUNSPLASH",
      date: "17 Nov 2026, 11:06 PM",
      orders: 29,
      sold: 200,
      capacity: 300,
      revenue: 14000,
      commission: 495.6,
      cgst: 37.8,
      sgst: 37.8,
      status: "Ended",
    },
  ],

  categories: [
    {
      name: "GA",
      sold: 6,
      capacity: 100,
      revenue: 0,
      price: 0,
      online: 6,
      offline: 10,
      guestlist: 0,
    },
    {
      name: "VVIP",
      sold: 17,
      capacity: 100,
      revenue: 6000,
      price: 1000,
      online: 6,
      offline: 20,
      guestlist: 5,
    },
    {
      name: "Couple Entry",
      sold: 6,
      capacity: 100,
      revenue: 8000,
      price: 2000,
      online: 4,
      offline: 15,
      guestlist: 0,
    },
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
   YEARLY SALES TREND DATA
   Sample data for chart demonstration
   ===================================================== */
const yearlySalesData = [
  { month: "Jan", sales: 18000, online: 12000, offline: 3000, onGround: 2000, guestlist: 1000 },
  { month: "Feb", sales: 24000, online: 16000, offline: 4000, onGround: 3000, guestlist: 1000 },
  { month: "Mar", sales: 21000, online: 13000, offline: 4000, onGround: 3000, guestlist: 1000 },
  { month: "Apr", sales: 32000, online: 22000, offline: 4000, onGround: 4000, guestlist: 2000 },
  { month: "May", sales: 39000, online: 27000, offline: 5000, onGround: 5000, guestlist: 2000 },
  { month: "Jun", sales: 46000, online: 32000, offline: 6000, onGround: 6000, guestlist: 2000 },
  { month: "Jul", sales: 54890, online: 38000, offline: 7000, onGround: 7500, guestlist: 2390 },
  { month: "Aug", sales: 42000, online: 29000, offline: 5000, onGround: 6000, guestlist: 2000 },
  { month: "Sep", sales: 48000, online: 33000, offline: 6000, onGround: 7000, guestlist: 2000 },
  { month: "Oct", sales: 36000, online: 24000, offline: 5000, onGround: 5000, guestlist: 2000 },
  { month: "Nov", sales: 51000, online: 35000, offline: 7000, onGround: 7000, guestlist: 2000 },
  { month: "Dec", sales: 57000, online: 39000, offline: 8000, onGround: 8000, guestlist: 2000 },
];

/* =====================================================
   FILTER OPTIONS
   ===================================================== */
const CLUB_OPTIONS = [
  { value: "All Partners", desc: "Every club", initials: "AP", tone: "blue" },
  { value: "Thalaasa", desc: "12 events", initials: "TH", tone: "teal" },
  { value: "Goa Club", desc: "8 events", initials: "GC", tone: "amber" },
  { value: "Rizztixx", desc: "5 events", initials: "RZ", tone: "violet" },
];

const EVENT_TYPE_OPTIONS = [
  { value: "All Types", dot: "#9aa4b5" },
  { value: "Ongoing", dot: "#14a38b" },
  { value: "Upcoming", dot: "#4f7cff" },
  { value: "Past", dot: "#e8a23a" },
];

const EVENT_OPTIONS = [
  { value: "GOA SUNSPLASH", desc: "Ended · 17 Nov", dot: "#9aa4b5" },
  { value: "Starly", desc: "Upcoming", dot: "#4f7cff" },
  { value: "After Dark", desc: "Ongoing", dot: "#14a38b" },
];

const CHANNEL_OPTIONS = [
  { value: "All Channels", dot: "#9aa4b5" },
  { value: "Online", dot: "#4f7cff" },
  { value: "Offline", dot: "#14a38b" },
  { value: "On Ground", dot: "#e8a23a" },
  { value: "Guestlist", dot: "#8b6cf0" },
];

const EMPLOYEE_OPTIONS = [
  { value: "All Employees", desc: "Everyone", initials: "AE", tone: "blue" },
  { value: "System Admin", desc: "Admin", initials: "SA", tone: "violet" },
  { value: "Thalaasa Employee", desc: "THEM1594", initials: "TE", tone: "teal" },
  { value: "Box Office", desc: "Counter sales", initials: "BO", tone: "amber" },
];

const DEFAULTS = {
  eventType: "All Types",
  event: "GOA SUNSPLASH",
  channel: "All Channels",
  employee: "All Employees",
  fromDate: "2026-11-15",
  toDate: "2026-11-19",
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

const formatCompact = (n) => {
  if (n >= 10000000) return `₹${+(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${+(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${+(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

const fmtDate = (d) => d.split("-").reverse().join("-");

const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const getPreset = (key) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (key === "today") return [toISO(today), toISO(today)];

  if (key === "last7") {
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    return [toISO(start), toISO(today)];
  }

  if (key === "thisMonth") {
    return [
      toISO(new Date(today.getFullYear(), today.getMonth(), 1)),
      toISO(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
    ];
  }

  return [
    toISO(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
    toISO(new Date(today.getFullYear(), today.getMonth(), 0)),
  ];
};

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =====================================================
   THEME DETECTION
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
    if (!el) continue;

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
   ICONS
   ===================================================== */
const ICONS = {
  store: (
    <>
      <path d="M4 9l1.2-4.5h13.6L20 9" />
      <path d="M5 9v11h14V9" />
      <path d="M9.5 20v-5h5v5" />
      <path d="M4 9a2.67 2.67 0 005.33 0 2.67 2.67 0 005.34 0A2.67 2.67 0 0020 9" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </>
  ),
  calendarEvent: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
      <rect x="8" y="15" width="3" height="3" rx="0.5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h5a3.5 3.5 0 000-7h-2a3.5 3.5 0 010-7h5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0116 0" />
    </>
  ),
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  check: <path d="M5 12l5 5L20 7" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  home: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
};

function Icon({ name, size = 16 }) {
  return (
    <svg
      className="sr-ico"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/* =====================================================
   PREMIUM DROPDOWN
   ===================================================== */
function Dropdown({
  label,
  icon,
  value,
  onChange,
  options,
  searchable = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target))
        setOpen(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open && searchable && searchRef.current) searchRef.current.focus();
    if (!open) setQuery("");
  }, [open, searchable]);

  const visible = options.filter((o) =>
    o.value.toLowerCase().includes(query.trim().toLowerCase())
  );

  const choose = (v) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="sr-field" ref={rootRef}>
      <span className="sr-field-label">{label}</span>

      <div className="sr-dd">
        <button
          type="button"
          className={`sr-dd-btn${open ? " open" : ""}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`${label}: ${value}`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-dd-icon">
            <Icon name={icon} size={15} />
          </span>

          <span className="sr-dd-value">{value}</span>

          <span className="sr-dd-chevron">
            <Icon name="chevronDown" size={16} />
          </span>
        </button>

        {open && (
          <div className="sr-dd-menu" role="listbox">
            {searchable && (
              <div className="sr-dd-search">
                <Icon name="search" size={14} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            )}

            {visible.length === 0 && (
              <div className="sr-dd-empty">No results</div>
            )}

            {visible.map((o) => {
              const selected = o.value === value;

              return (
                <div
                  key={o.value}
                  role="option"
                  aria-selected={selected}
                  className={`sr-dd-option${selected ? " selected" : ""}`}
                  onClick={() => choose(o.value)}
                >
                  {o.initials ? (
                    <span className={`sr-dd-avatar sr-tone-${o.tone}`}>
                      {o.initials}
                    </span>
                  ) : (
                    <span
                      className="sr-dd-dot"
                      style={{ background: o.dot }}
                    />
                  )}

                  <span className="sr-dd-text">
                    <b>{o.value}</b>
                    {o.desc && <span>{o.desc}</span>}
                  </span>

                  <span className="sr-dd-check">
                    <Icon name="check" size={15} />
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <div className="sr-field">
      <span className="sr-field-label">{label}</span>

      <div className="sr-date-box">
        <Icon name="calendar" size={16} />

        <input
          type="date"
          value={value}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

/* =====================================================
   ANIMATION COMPONENTS
   ===================================================== */
function CountUp({
  to,
  prefix = "",
  decimals = 0,
  duration = 1900,
  delay = 400,
}) {
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

function Box({ className = "", delay = 0, children }) {
  return (
    <div className={className} style={{ "--d": `${delay}s` }}>
      {children}
    </div>
  );
}

/* =====================================================
   DONUT CHART
   ===================================================== */
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

function AddonsDonutChart({ data = [] }) {
  const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];
  const addons = Array.isArray(data) ? data : [];
  const total = addons.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const segments = addons.reduce((result, item, index) => {
    const amount = Number(item.amount) || 0;
    const percentage = total > 0 ? (amount / total) * 100 : 0;
    const previous = result[result.length - 1];

    return [
      ...result,
      {
        ...item,
        amount,
        percentage,
        color: colors[index % colors.length],
        dash: (percentage / 100) * circumference,
        offset: previous ? previous.offset + previous.dash : 0,
      },
    ];
  }, []);

  return (
    <div className="sr-addon-donut-layout">
      <div className="sr-donut-box">
        <svg
          className="sr-donut"
          viewBox="0 0 120 120"
          role="img"
          aria-label="Add-on revenue breakdown"
        >
          <circle className="sr-donut-bg" cx="60" cy="60" r={radius} />
          {segments.map(
            (item) =>
              item.dash > 0 && (
                <circle
                  key={item.name}
                  className="sr-donut-seg"
                  cx="60"
                  cy="60"
                  r={radius}
                  style={{
                    stroke: item.color,
                    strokeDasharray: `${item.dash} ${circumference - item.dash}`,
                    strokeDashoffset: -item.offset,
                    strokeLinecap: "butt",
                  }}
                />
              )
          )}
        </svg>

        <div className="sr-donut-center">
          <strong>
            <CountUp to={total} prefix="₹" />
          </strong>
          <span>Total Revenue</span>
        </div>
      </div>

      <div className="sr-addon-donut-legend">
        {segments.map((item) => (
          <div className="sr-addon-legend-item" key={item.name}>
            <span
              className="sr-addon-legend-dot"
              style={{ backgroundColor: item.color }}
            />
            <span className="sr-addon-legend-name">{item.name}</span>
            <span className="sr-addon-legend-value">
              <strong>{formatCurrency(item.amount)}</strong>
              <span>{item.percentage.toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   REVENUE BY CHANNEL BAR CHART
   ===================================================== */
function BarChart({ data }) {
  const [ready, setReady] = useState(prefersReduced());

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  const max = Math.max(...data.map((d) => Number(d.value) || 0), 1);

  const barColors = {
    Online: "#2563EB",
    "Offline (Paid)": "#10B981",
    "On Ground": "#F59E0B",
    Guestlist: "#8B5CF6",
  };

  return (
    <div className="sr-revenue-chart">
      <div className="sr-revenue-chart-legend">
        <span>
          <i />
          Total Revenue
        </span>
      </div>

      <div className="sr-revenue-bars">
        {data.map((d) => {
          const value = Number(d.value) || 0;
          const barHeight = value > 0 ? (value / max) * 100 : 0;
          const color = barColors[d.name] || "#3B82F6";

          return (
            <div
              className="sr-revenue-bar-item"
              key={d.name}
              title={`${d.name}: ${formatCurrency(value)}`}
            >
              <strong className="sr-revenue-value">
                {formatCurrency(value)}
              </strong>

              <div className="sr-revenue-track">
                <div
                  className="sr-revenue-fill"
                  style={{
                    height: ready ? `${barHeight}%` : "0%",
                    backgroundColor: color,
                  }}
                />
              </div>

              <span className="sr-revenue-label">{d.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =====================================================
   YEARLY SALES TRENDS LINE CHART
   ===================================================== */
function YearlySalesTrendChart() {
  const [activeIndex, setActiveIndex] = useState(6);

  const width = 1000;
  const height = 390;

  const left = 78;
  const right = 35;
  const top = 45;
  const bottom = 65;

  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const maxSales = 60000;

  const x = (index) =>
    left + (index / (yearlySalesData.length - 1)) * chartWidth;

  const y = (value) =>
    top + chartHeight - (value / maxSales) * chartHeight;

  const points = yearlySalesData.map((item, index) => ({
    x: x(index),
    y: y(item.sales),
    ...item,
  }));

  // Smooth curve using cubic Bezier control points.
  const createSmoothPath = (data) => {
    if (!data.length) return "";

    let path = `M ${data[0].x} ${data[0].y}`;

    for (let i = 0; i < data.length - 1; i++) {
      const current = data[i];
      const next = data[i + 1];

      const controlX = (current.x + next.x) / 2;

      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  const linePath = createSmoothPath(points);

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    top + chartHeight
  } L ${points[0].x} ${top + chartHeight} Z`;

  const activePoint = points[activeIndex];

  const formatTooltip = (value) =>
    `₹${Number(value).toLocaleString("en-IN")}`;

  const tooltipWidth = 220;
  const tooltipHeight = 154;

  const tooltipX = Math.min(
    Math.max(activePoint.x - tooltipWidth / 2, left),
    width - right - tooltipWidth
  );

  const tooltipY =
    activePoint.y - tooltipHeight - 35 > top
      ? activePoint.y - tooltipHeight - 35
      : activePoint.y + 35;

  return (
    <div
      style={{
        width: "100%",
        background: "#111827",
        border: "1px solid #263244",
        borderRadius: "18px",
        padding: "26px 24px 18px",
        color: "#E5E7EB",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* CHART HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "12px",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "19px",
              fontWeight: 700,
              color: "#F9FAFB",
              letterSpacing: "-0.4px",
            }}
          >
            Yearly Sales Trends (2023)
          </h3>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: "13px",
              color: "#94A3B8",
            }}
          >
            Total Sales vs Time
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#1E293B",
            border: "1px solid #334155",
            padding: "8px 13px",
            borderRadius: "9px",
            fontSize: "12px",
            color: "#CBD5E1",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#F97316",
              display: "inline-block",
            }}
          />
          Total Sales
        </div>
      </div>

      {/* SVG LINE CHART */}
      <div style={{ width: "100%", position: "relative" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Yearly sales trends line chart for 2023"
          style={{
            width: "100%",
            display: "block",
            overflow: "visible",
          }}
        >
          <defs>
            <linearGradient
              id="yearlySalesGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#F97316"
                stopOpacity="0.35"
              />
              <stop
                offset="65%"
                stopColor="#F97316"
                stopOpacity="0.10"
              />
              <stop
                offset="100%"
                stopColor="#F97316"
                stopOpacity="0.01"
              />
            </linearGradient>

            <filter
              id="yearlySalesGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Y AXIS LABEL */}
          <text
            x="18"
            y="25"
            fill="#94A3B8"
            fontSize="12"
            fontWeight="600"
          >
            Sales
          </text>

          {/* GRID AND Y LABELS */}
          {[0, 10000, 20000, 30000, 40000, 50000, 60000].map(
            (value) => {
              const position = y(value);

              return (
                <g key={value}>
                  <line
                    x1={left}
                    y1={position}
                    x2={width - right}
                    y2={position}
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="3 6"
                    opacity="0.65"
                  />

                  <text
                    x={left - 14}
                    y={position + 4}
                    fill="#94A3B8"
                    fontSize="12"
                    textAnchor="end"
                  >
                    {value === 0 ? "₹0" : `₹${value / 1000}k`}
                  </text>
                </g>
              );
            }
          )}

          {/* VERTICAL GRID */}
          {points.map((point, index) => (
            <line
              key={`grid-${point.month}`}
              x1={point.x}
              y1={top}
              x2={point.x}
              y2={top + chartHeight}
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="3 7"
              opacity="0.28"
            />
          ))}

          {/* AREA GRADIENT */}
          <path
            d={areaPath}
            fill="url(#yearlySalesGradient)"
          />

          {/* ORANGE SALES LINE */}
          <path
            d={linePath}
            fill="none"
            stroke="#F97316"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#yearlySalesGlow)"
          />

          {/* ACTIVE MONTH GUIDE */}
          <line
            x1={activePoint.x}
            y1={activePoint.y}
            x2={activePoint.x}
            y2={top + chartHeight}
            stroke="#F97316"
            strokeWidth="1.2"
            strokeDasharray="4 5"
            opacity="0.75"
          />

          {/* MONTH POINTS */}
          {points.map((point, index) => (
            <g
              key={point.month}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              tabIndex={0}
              role="button"
              aria-label={`${point.month}: ${formatTooltip(point.sales)}`}
              style={{ cursor: "pointer", outline: "none" }}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r={index === activeIndex ? 8 : 5}
                fill={index === activeIndex ? "#F97316" : "#111827"}
                stroke="#F97316"
                strokeWidth={index === activeIndex ? 3 : 2}
              />

              {index === activeIndex && (
                <>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="13"
                    fill="#F97316"
                    opacity="0.16"
                  />

                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="#FB923C"
                  />

                  <text
                    x={point.x}
                    y={point.y - 17}
                    fill="#FDBA74"
                    fontSize="13"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {formatTooltip(point.sales)}
                  </text>
                </>
              )}
            </g>
          ))}

          {/* MONTH LABELS */}
          {points.map((point, index) => (
            <text
              key={`month-${point.month}`}
              x={point.x}
              y={top + chartHeight + 32}
              fill={index === activeIndex ? "#FDBA74" : "#94A3B8"}
              fontSize="12"
              fontWeight={index === activeIndex ? "700" : "500"}
              textAnchor="middle"
            >
              {point.month}
            </text>
          ))}

          {/* FLOATING TOOLTIP */}
          <g
            transform={`translate(${tooltipX}, ${tooltipY})`}
            style={{ pointerEvents: "none" }}
          >
            <rect
              width={tooltipWidth}
              height={tooltipHeight}
              rx="11"
              fill="#1E293B"
              stroke="#475569"
              strokeWidth="1"
              opacity="0.98"
            />

            <text
              x="15"
              y="23"
              fill="#FB923C"
              fontSize="11"
              fontWeight="700"
              letterSpacing="1"
            >
              {activePoint.month.toUpperCase()} 2023
            </text>

            <text
              x="15"
              y="48"
              fill="#F8FAFC"
              fontSize="13"
              fontWeight="600"
            >
              Total Sales: {formatTooltip(activePoint.sales)}
            </text>

            <line
              x1="15"
              y1="61"
              x2={tooltipWidth - 15}
              y2="61"
              stroke="#475569"
            />

            {[
              {
                label: "Online",
                value: activePoint.online,
                color: "#3B82F6",
              },
              {
                label: "Offline",
                value: activePoint.offline,
                color: "#10B981",
              },
              {
                label: "On Ground",
                value: activePoint.onGround,
                color: "#F59E0B",
              },
              {
                label: "Guestlist",
                value: activePoint.guestlist,
                color: "#A78BFA",
              },
            ].map((item, index) => (
              <g key={item.label} transform={`translate(0, ${79 + index * 17})`}>
                <circle
                  cx="19"
                  cy="0"
                  r="3.5"
                  fill={item.color}
                />

                <text
                  x="29"
                  y="4"
                  fill="#CBD5E1"
                  fontSize="10.5"
                >
                  {item.label}
                </text>

                <text
                  x={tooltipWidth - 15}
                  y="4"
                  fill="#F8FAFC"
                  fontSize="10.5"
                  fontWeight="600"
                  textAnchor="end"
                >
                  {formatTooltip(item.value)}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* CHART FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          borderTop: "1px solid #263244",
          paddingTop: "15px",
          marginTop: "8px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#94A3B8" }}>
          Hover over any month to view sales details
        </span>

        <span
          style={{
            fontSize: "12px",
            color: "#FDBA74",
            fontWeight: 600,
          }}
        >
          Peak Month: {activePoint.month} · {formatTooltip(activePoint.sales)}
        </span>
      </div>
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

function StatCard({
  icon,
  title,
  value,
  subtitle,
  hero = false,
  className = "",
  delay = 0,
}) {
  return (
    <Box
      className={`sr-stat-card${hero ? " sr-hero" : ""}${
        className ? ` ${className}` : ""
      }`}
      delay={delay}
    >
      <span>
        {icon && <b className="sr-icon">{icon}</b>}
        {title}
      </span>

      <h2>{value}</h2>

      {subtitle && <p>{subtitle}</p>}
    </Box>
  );
}

/* =====================================================
   TICKET SOLD LIQUID CONTAINER
   ===================================================== */
function TicketSoldCard({ sold, capacity, delay = 0 }) {
  const safeSold = Math.max(0, Number(sold) || 0);
  const safeCapacity = Math.max(0, Number(capacity) || 0);

  const rawPercent =
    safeCapacity > 0 ? (safeSold / safeCapacity) * 100 : 0;

  const percentage =
    safeCapacity > 0 ? Math.min(100, rawPercent) : 0;

  return (
    <Box
      className="sr-stat-card sr-ticket-vessel sr-gradient-card sr-gradient-violet"
      delay={delay}
    >
      <span className="sr-ticket-header">
        <b className="sr-icon">🎟️</b>
        TICKETS SOLD
      </span>

      <div className="sr-ticket-main">
        <div className="sr-ticket-quantity">
          <strong>{safeSold.toLocaleString("en-IN")}</strong>
          <span>
            of <b>{safeCapacity.toLocaleString("en-IN")}</b>
          </span>
        </div>

        <div
          className="sr-ticket-progress"
          style={{ "--ticket-fill": `${percentage}%` }}
          role="img"
          aria-label={`${percentage.toFixed(1)}% of ticket capacity filled`}
        >
          <span>{Math.round(percentage)}%</span>
        </div>
      </div>
      <p className="sr-ticket-caption">{percentage.toFixed(1)}% filled</p>
    </Box>
  );
}

/* =====================================================
   MAIN PAGE
   ===================================================== */
export default function SalesReportForm({
  club = "Thalaasa",
  theme = "auto",
}) {
  const rootRef = useRef(null);
  const dark = useDarkMode(theme, rootRef);

  const [selectedClub, setSelectedClub] = useState(club);
  const [eventType, setEventType] = useState(DEFAULTS.eventType);
  const [event, setEvent] = useState(DEFAULTS.event);
  const [channel, setChannel] = useState(DEFAULTS.channel);
  const [employee, setEmployee] = useState(DEFAULTS.employee);

  const [fromDate, setFromDate] = useState(DEFAULTS.fromDate);
  const [toDate, setToDate] = useState(DEFAULTS.toDate);

  const [loaded, setLoaded] = useState(false);

  const ev = salesData.events[0];

  const totalTickets = salesData.channels.reduce(
    (sum, c) => sum + c.tickets,
    0
  );

  const guestlist = salesData.channels.find(
    (c) => c.name === "Guestlist"
  );

  const topCatagory = [...salesData.categories].sort(
    (a, b) => b.sold - a.sold
  )[0];

  const appliedCount = [
    selectedClub !== club,
    eventType !== DEFAULTS.eventType,
    event !== DEFAULTS.event,
    channel !== DEFAULTS.channel,
    employee !== DEFAULTS.employee,
    fromDate !== DEFAULTS.fromDate || toDate !== DEFAULTS.toDate,
  ].filter(Boolean).length;

  const applyPreset = (key) => {
    const [from, to] = getPreset(key);
    setFromDate(from);
    setToDate(to);
  };

  const resetFilters = () => {
    setSelectedClub(club);
    setEventType(DEFAULTS.eventType);
    setEvent(DEFAULTS.event);
    setChannel(DEFAULTS.channel);
    setEmployee(DEFAULTS.employee);
    setFromDate(DEFAULTS.fromDate);
    setToDate(DEFAULTS.toDate);
  };

  const tickerItems = [
    {
      icon: "🔥",
      text: `${ev.name} · ${salesData.ticketsSold} tickets sold`,
    },
    {
      icon: "💰",
      text: `${formatCurrency(salesData.totalRevenue)} online revenue`,
    },
    {
      icon: "🍾",
      text: `${salesData.bookings} table bookings · ${formatCurrency(
        salesData.tableRevenue
      )}`,
    },
    {
      icon: "🎉",
      text: `${guestlist ? guestlist.tickets : 0} guestlist entries`,
    },
    {
      icon: "⚡",
      text: `${topCatagory.name} is the top-selling Catagory`,
    },
  ];

  const channelRevenueData = salesData.channels
    .filter((item) => item.name !== "Guestlist")
    .map((item) => ({
      name: item.name,
      value: item.amount,
    }));

  return (
    <div
      ref={rootRef}
      className={`sales-report-page${dark ? " sr-dark" : ""}`}
    >
      {/* HEADING */}
      <header className="sr-header">
        <div className="sr-title-block">
          <span className="sr-title-icon">
            <Icon name="chart" size={24} />
          </span>

          <div>
            <h2>
              Sales <em>Report</em>
            </h2>

            <div className="sr-title-bar" />

            <div className="sr-subtitle">
              <span className="sr-event-pill">
                <Icon name="calendarEvent" size={14} />
                {event}
              </span>

              <span className="sr-sep" />

              <span>
                {fmtDate(fromDate)} to {fmtDate(toDate)}
              </span>

              <span className="sr-sep" />

              <b>{selectedClub}</b>
            </div>
          </div>
        </div>

        <div className="sr-header-right">
          <div className="sr-live">
            <i /> Live data
          </div>

          <div className="sr-breadcrumb">
            <Icon name="home" size={14} />
            <span>Sales Analysis</span>
            <Icon name="chevronRight" size={13} />
            <span className="sr-current">Sales Report</span>
          </div>
        </div>
      </header>

      {/* FILTERS */}
      <div className="sr-filter-card">
        <div className="sr-filter-top">
          <h3>Filters</h3>

          <span className="sr-applied">
            {appliedCount === 0
              ? "No filters applied"
              : `${appliedCount} applied`}
          </span>
        </div>

        <div className="sr-filter-grid">
          <Dropdown
            label="Club (admin)"
            icon="store"
            value={selectedClub}
            onChange={setSelectedClub}
            options={CLUB_OPTIONS}
          />

          <DateField
            label="From"
            value={fromDate}
            onChange={setFromDate}
          />

          <DateField
            label="To"
            value={toDate}
            onChange={setToDate}
          />

          <Dropdown
            label="Event type"
            icon="grid"
            value={eventType}
            onChange={setEventType}
            options={EVENT_TYPE_OPTIONS}
          />

          <Dropdown
            label="Event"
            icon="calendarEvent"
            value={event}
            onChange={setEvent}
            options={EVENT_OPTIONS}
            searchable
          />

          <Dropdown
            label="Sale channel"
            icon="route"
            value={channel}
            onChange={setChannel}
            options={CHANNEL_OPTIONS}
          />

          <Dropdown
            label="Sold by (employee)"
            icon="user"
            value={employee}
            onChange={setEmployee}
            options={EMPLOYEE_OPTIONS}
            searchable
          />
        </div>

        <div className="sr-presets">
          <button type="button" onClick={() => applyPreset("today")}>
            Today
          </button>

          <button type="button" onClick={() => applyPreset("last7")}>
            Last 7 days
          </button>

          <button type="button" onClick={() => applyPreset("thisMonth")}>
            This month
          </button>

          <button type="button" onClick={() => applyPreset("lastMonth")}>
            Last month
          </button>
        </div>

        <p className="sr-filter-note">
          Filters events by start date and matches the sales report.
          Employee filter applies to offline ticket sales and table
          bookings (referred via Emp Ref).
        </p>

        <div className="sr-filter-actions">
          <button
            type="button"
            className="sr-reset"
            onClick={resetFilters}
          >
            Reset filters
          </button>

          <button
            className="sr-load-button"
            onClick={() => setLoaded(true)}
            type="button"
          >
            Load report
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
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
            <TicketSoldCard
              sold={ev.sold}
              capacity={ev.capacity}
              delay={0.1}
            />

            <StatCard
              hero
              className="sr-gradient-card sr-gradient-blue"
              icon="💰"
              title="Total Revenue"
              value={
                <CountUp
                  to={salesData.totalRevenue}
                  prefix="₹"
                />
              }
              subtitle="All channels"
              delay={0.2}
            />

            <StatCard
              className="sr-gradient-card sr-gradient-orange"
              icon="🍾"
              title="Table Revenue"
              value={
                <CountUp
                  to={salesData.tableRevenue}
                  prefix="₹"
                />
              }
              subtitle={`${salesData.bookings} bookings · ${salesData.guests} guests`}
              delay={0.3}
            />

            <StatCard
              className="sr-gradient-card sr-gradient-teal"
              icon="📈"
              title="Rizztixx Commission (2%)"
              value={
                <CountUp
                  to={ev.commission}
                  prefix="₹"
                  decimals={2}
                />
              }
              subtitle={`CGST ${formatFixedCurrency(
                ev.cgst
              )} · SGST ${formatFixedCurrency(ev.sgst)}`}
              delay={0.4}
            />
          </div>

          {/* CHANNEL OVERVIEW */}
          <Section title="Channel Overview">
            <div className="sr-chart-grid">
              <Box className="sr-chart-card" delay={0.1}>
                <span className="sr-card-label">
                  Tickets By Channel
                </span>

                <DonutChart
                  channels={salesData.channels}
                  total={totalTickets}
                />
              </Box>

              <Box className="sr-chart-card" delay={0.2}>
                <span className="sr-card-label">
                  Revenue By Channel (₹)
                </span>

                <BarChart data={channelRevenueData} />
              </Box>
            </div>
          </Section>

          {/* NEW YEARLY SALES TREND GRAPH */}
          <Section
            title="Yearly Sales Trends"
            subtitle="Monthly revenue performance and sales channel breakdown."
          >
            <YearlySalesTrendChart />
          </Section>

          {/* TABLE BOOKINGS */}
          <Section title="Table Bookings">
            <div className="sr-section-top">
              <button className="sr-outline-button" type="button">
                ♧ Share Table Sheet
              </button>
            </div>

            <div className="sr-booking-grid">
              <StatCard
                className="sr-gradient-card sr-gradient-violet"
                icon="📅"
                title="Total Bookings"
                value={<CountUp to={salesData.bookings} />}
                subtitle={`${salesData.guests} guests`}
                delay={0.1}
              />

              <StatCard
                className="sr-gradient-card sr-gradient-blue"
                icon="👥"
                title="Guests"
                value={<CountUp to={salesData.guests} />}
                delay={0.2}
              />

              <StatCard
                className="sr-gradient-card sr-gradient-orange"
                icon="💵"
                title="Revenue Collected"
                value={
                  <CountUp
                    to={salesData.tableRevenue}
                    prefix="₹"
                  />
                }
                delay={0.3}
              />

              <StatCard
                className="sr-gradient-card sr-gradient-teal"
                icon="🍸"
                title="Min. Spend Total"
                value={
                  <CountUp
                    to={salesData.minSpend}
                    prefix="₹"
                  />
                }
                delay={0.4}
              />
            </div>
          </Section>

          {/* ADDONS */}
          <Section title="Add-Ons & Preorder (Booking Snapshots)">
            <div className="sr-addon-overview-grid">
              <Box className="sr-chart-card" delay={0.1}>
                <span className="sr-card-label">Add-Ons Revenue (₹)</span>
                <AddonsDonutChart data={salesData.addons} />
              </Box>

              <StatCard
                icon="🎟️"
                title="Guestlist"
                value={
                  <CountUp
                    to={guestlist ? guestlist.amount : 0}
                    prefix="₹"
                  />
                }
                subtitle={`${guestlist ? guestlist.tickets : 0} tickets · Complimentary`}
                delay={0.2}
              />
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
                        <span className="sr-capacity">
                          / {item.capacity}
                        </span>

                        <div className="sr-progress">
                          <div
                            style={{
                              width: `${
                                item.capacity > 0
                                  ? Math.min(
                                      100,
                                      (item.sold / item.capacity) * 100
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </td>

                      <td>{formatFixedCurrency(item.revenue)}</td>
                      <td>
                        {formatFixedCurrency(item.commission)} ⓘ
                      </td>
                      <td>{formatFixedCurrency(item.cgst)}</td>
                      <td>{formatFixedCurrency(item.sgst)}</td>

                      <td>
                        <span className="sr-status">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Catagory BREAKDOWN */}
          <Section
            title="Catagory Breakdown"
            subtitle={`Ticket Types For ${event}. Includes All Tiers On The Event, Even With Zero Sales.`}
          >
            <div className="sr-table-wrapper">
              <table className="sr-table">
                <thead>
                  <tr>
                    <th>Catagory</th>
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
                        <span className="sr-capacity">
                          / {item.capacity}
                        </span>

                        <div className="sr-progress">
                          <div
                            style={{
                              width: `${
                                item.capacity > 0
                                  ? Math.min(
                                      100,
                                      (item.sold / item.capacity) * 100
                                    )
                                  : 0
                              }%`,
                            }}
                          />
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
                    <td>
                      {formatFixedCurrency(salesData.tableRevenue)}
                    </td>
                    <td>
                      {formatFixedCurrency(salesData.minSpend)}
                    </td>
                    <td>₹7,741.39 ⓘ</td>
                    <td>₹590.44</td>
                    <td>₹590.45</td>

                    <td>
                      <button
                        className="sr-view-button"
                        type="button"
                      >
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