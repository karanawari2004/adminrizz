import AdminHeading from "../../AdminHeading";
import SalesReportForm from "../../components/SalesReportForm";
import "./SalesReport.css";

export default function SalesReport() {
  return (
    <div className="admin-sales-report-page">
      <AdminHeading title="Sales Report" section="Sales Analysis" />
      <div className="admin-report-content">
        <SalesReportForm club="All Partners" />
      </div>
    </div>
  );
}
