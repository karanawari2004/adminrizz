import ManageCatalog from "../../components/ManageCatalog";
import { clubs } from "../../data";
import "./ClubsPage.css";

export default function ClubsPage() {
  return (
    <ManageCatalog
      columns={["Club Name", "URL Slug", "Status"]}
      count={22}
      label="Club"
      pageClass="admin-clubs-page"
      placeholder="Search Clubs..."
      rows={clubs.map((club) => [club.name, club.slug, "Active"])}
      title="Club Management"
    />
  );
}
