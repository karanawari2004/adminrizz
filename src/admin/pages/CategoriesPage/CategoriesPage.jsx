import {
  CalendarDays,
  FlaskConical,
  Globe,
  Laugh,
  Layers,
  Music,
  Sparkles,
  Tag,
  Tags,
  Trophy,
} from "lucide-react";
import ManageCatalog from "../../components/ManageCatalog";
import { categories } from "../../data";
import "./CategoriesPage.css";

function getCategoryIcon(name) {
  const key = String(name).trim().toLowerCase();

  if (key.includes("comedy") || key.includes("standup")) return Laugh;
  if (key.includes("music") || key.includes("concert") || key.includes("dj"))
    return Music;
  if (key.includes("sport") || key.includes("cricket") || key.includes("match"))
    return Trophy;
  if (key.includes("test") || key.includes("lab")) return FlaskConical;
  if (key.includes("french") || key.includes("global") || key.includes("world"))
    return Globe;

  return Tag;
}

export default function CategoriesPage() {
  return (
    <ManageCatalog
      columns={["Categories", "No. Of Events"]}
      count={categories.length}
      headerIcon={Tags}
      label="Category"
      pageClass="admin-categories-page"
      placeholder="Search Categories..."
      renderPrimaryCell={(value) => {
        const CategoryIcon = getCategoryIcon(value);

        return (
          <div className="admin-category-cell">
            <span aria-hidden="true" className="admin-category-icon">
              <CategoryIcon size={17} />
            </span>
            <strong>{value}</strong>
          </div>
        );
      }}
      renderSecondaryCell={(value) => (
        <span className="admin-events-pill">
          <CalendarDays aria-hidden="true" size={14} />
          <span>{Number(value) || 0} Events</span>
        </span>
      )}
      rows={categories.map((category) => [category.name, category.events])}
      secondaryInputLabel="No. Of Events"
      secondaryInputPlaceholder="0"
      summaryCards={(items) => {
        const totalEvents = items.reduce(
          (sum, row) => sum + (Number(row[1]) || 0),
          0,
        );
        const topCategory = [...items].sort(
          (a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0),
        )[0];

        return [
          {
            label: "Total Categories",
            value: items.length,
            icon: Layers,
          },
          {
            label: "Total Events",
            value: totalEvents,
            icon: CalendarDays,
          },
          {
            label: "Top Category",
            value: topCategory ? String(topCategory[0]) : "—",
            icon: Sparkles,
          },
        ];
      }}
      title="Category Management"
    />
  );
}
