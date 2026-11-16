import ManageCatalog from "../../components/ManageCatalog";
import { categories } from "../../data";
import "./CategoriesPage.css";

export default function CategoriesPage() {
  return (
    <ManageCatalog
      columns={["Categories", "No. Of Events"]}
      count={5}
      label="Category"
      pageClass="admin-categories-page"
      placeholder="Search Categories..."
      rows={categories.map((category) => [category.name, category.events])}
      title="Category Management"
    />
  );
}
