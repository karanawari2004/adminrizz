import { useState } from "react";
import AdminHeading from "../../AdminHeading";
import ClubSelector from "../../components/ClubSelector";
import SalesReportForm from "../../components/SalesReportForm";
import "./SalesReport.css";

export default function SalesReport() {
  const [club, setClub] = useState("All Partners");

  return (
    <div className="admin-sales-report-page">
      <AdminHeading title="Sales Report" section="Sales Analysis" />
      <div className="admin-report-content">
        <ClubSelector value={club} onChange={setClub} />
        <SalesReportForm club={club} />
      </div>
    </div>
  );
}
