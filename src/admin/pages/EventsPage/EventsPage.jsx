import { useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  UsersRound,
} from "lucide-react";

import AdminHeading from "../../AdminHeading";
import AdminModal from "../../AdminModal";
import { events } from "../../data";
import "./EventsPage.css";

export default function EventsPage() {
  const [tab, setTab] = useState("Current Events");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filteredEvents = useMemo(
    () =>
      events.filter((item) =>
        `${item.name} ${item.artist} ${item.venue}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="admin-events-page">
      <AdminHeading title="Events" />

      <div className="admin-events-content">

        {/* EVENT TABS */}
        <div className="admin-tabs" role="tablist">
          {["Current Events", "Past Events"].map((item) => (
            <button
              aria-selected={tab === item}
              className={tab === item ? "is-active" : ""}
              key={item}
              onClick={() => setTab(item)}
              role="tab"
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        {/* EVENTS TOOLBAR */}
        <div className="admin-events-toolbar">
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

          <select aria-label="Filter events" defaultValue="All Events">
            <option>All Events</option>
            <option>Music</option>
          </select>
        </div>

        {/* SEARCH */}
        <div className="admin-search-bar admin-events-search">
          <input
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setQuery(search);
            }}
            placeholder="Search events details, event number, location, artist, language, category, date, price"
            value={search}
          />

          <button
            aria-label="Search events"
            onClick={() => setQuery(search)}
            type="button"
          >
            <Search size={17} />
          </button>
        </div>

        {/* EVENTS TABLE */}
        <div className="admin-table-card admin-events-table-wrap">
          <table className="admin-table admin-events-table">
            <thead>
              <tr>
                <th>
                  Event Details
                  <span className="admin-count">2</span>
                </th>
                <th>Artist</th>
                <th>Event Timings</th>
                <th>Ticket Details</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {/* TABLE FILTERS */}
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
                    type="text"
                  />
                </td>

                <td />

                <td>
                  <select aria-label="Filter by status">
                    <option>Select</option>
                    <option>Ongoing</option>
                    <option>Upcoming</option>
                  </select>
                </td>
              </tr>

              {/* EVENT ROWS */}
              {filteredEvents.map((item, index) => (
                <tr
                  key={item.number}
                  style={{ "--event-index": index }}
                >
                  <td>
                    <div className="admin-event-detail">
                      <span className="admin-event-poster">
                        <CalendarDays size={22} />
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
                      <span className="admin-type-pill">
                        {item.type}
                      </span>

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
                        className={`admin-status-pill ${item.status.toLowerCase()}`}
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
                    No events match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD EVENT MODAL */}
      {showAdd && (
        <AdminModal
          description="Event creation is a visual demo and is not connected to a backend."
          onClose={() => setShowAdd(false)}
          title="Add Event"
        />
      )}
    </div>
  );
}