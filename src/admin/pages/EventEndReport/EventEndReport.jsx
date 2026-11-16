import { useState } from "react";
import AdminHeading from "../../AdminHeading";
import ClubSelector from "../../components/ClubSelector";
import "./EventEndReport.css";

export default function EventEndReport() {
  const [club, setClub] = useState("All Partners");

  return (
    <div className="admin-event-end-report-page">
      <AdminHeading title="Event End Report" section="Sales Analysis" />
      <div className="admin-report-content">
        <ClubSelector value={club} onChange={setClub} />
      </div>
    </div>
  );
}
