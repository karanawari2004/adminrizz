import { useState } from "react";

export default function SalesReportForm({ club }) {
  const [eventType, setEventType] = useState("Ongoing");
  const [event, setEvent] = useState("");
  const [channel, setChannel] = useState("All Channels");
  const [employee, setEmployee] = useState("All Employees");
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="admin-sales-form">
      <h2>Sales Report</h2>
      <div className="admin-sales-form-fields">
        <label>
          Event Type
          <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
            <option>Ongoing</option><option>Upcoming</option><option>Past</option>
          </select>
        </label>
        <label>
          Event
          <select value={event} onChange={(e) => setEvent(e.target.value)}>
            <option value="">Select an event</option><option>Starly</option><option>After Dark</option>
          </select>
          <small>{club === "All Partners" ? "Select a club to list events." : "Choose an event to filter the report."}</small>
        </label>
        <label>
          Sale Channel
          <select value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option>All Channels</option><option>Online</option><option>Box Office</option>
          </select>
        </label>
        <label>
          Sold By (Employee)
          <select value={employee} onChange={(e) => setEmployee(e.target.value)}>
            <option>All Employees</option><option>System Admin</option><option>Box Office</option>
          </select>
          <small>{club === "All Partners" ? "Select a club first to list employees." : "Select an employee or leave all employees."}</small>
        </label>
      </div>
      <button className="admin-primary-button admin-load-button" onClick={() => setLoaded(true)} type="button">
        Load Report
      </button>
      {loaded && <p className="admin-report-feedback" role="status">No sales data is available for the selected filters.</p>}
    </section>
  );
}
