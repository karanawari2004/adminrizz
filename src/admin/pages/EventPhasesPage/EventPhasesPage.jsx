import { useState } from "react";
import AdminHeading from "../../AdminHeading";
import "./EventPhasesPage.css";

export default function EventPhasesPage() {
  const [club, setClub] = useState("");
  const [event, setEvent] = useState("");
  const [saved, setSaved] = useState(false);

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
          <label>
            CLUBS
            <select
              onChange={(event) => {
                setClub(event.target.value);
                setSaved(false);
              }}
              value={club}
            >
              <option value="">Select</option>
              <option>Maushi</option>
              <option>Nesco</option>
              <option>Sunburn</option>
            </select>
          </label>

          <label>
            EVENT
            <select
              onChange={(event) => {
                setEvent(event.target.value);
                setSaved(false);
              }}
              value={event}
            >
              <option value="">Select</option>
              <option>Starly</option>
              <option>After Dark</option>
            </select>
          </label>
        </div>

        {/* EVENT CONFIGURATION */}
        {event ? (
          <div className="admin-phase-config">
            <h3>Ticket Sale Phases</h3>

            <div className="admin-phase-inputs">
              <label>
                Phase Name
                <input placeholder="Early Bird" />
              </label>

              <label>
                Ticket Price
                <input min="0" placeholder="500" type="number" />
              </label>

              <label>
                Ticket Quantity
                <input min="1" placeholder="100" type="number" />
              </label>

              <label>
                Starts At
                <input type="datetime-local" />
              </label>

              <label>
                Ends At
                <input type="datetime-local" />
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