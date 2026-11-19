import ManageCatalog from "../../components/ManageCatalog";
import "./GenresPage.css";

const genres = [
  ["Afrobeats", 12],
  ["Electronic", 48],
  ["Hip Hop", 23],
  ["House", 37],
  ["Techno", 42],
];

export default function GenresPage() {
  return (
    <ManageCatalog
      columns={["Genres", "No. Of Events"]}
      count={genres.length}
      label="Genre"
      pageClass="admin-genres-page"
      placeholder="Search Genres..."
      rows={genres}
      title="Genres Management"
    />
  );
}