import SalesReportForm from "../../components/SalesReportForm";
import "./SalesReport.css";

export default function SalesReport() {
  return (
    <div className="admin-sales-report-page">
      <div className="admin-report-content">
        <SalesReportForm club="All Partners" />
      </div>
    </div>
  );
}
