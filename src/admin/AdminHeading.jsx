import { Home } from "lucide-react";

export default function AdminHeading({ title, section = "Events", parent }) {
  return (
    <div className="admin-heading-row">
      <h1>{title}</h1>
      <div className="admin-breadcrumb">
        <Home size={13} />
        <span>{section}</span>
        {parent && <><b>/</b><span>{parent}</span></>}
        <b>/</b>
        <span>{title}</span>
      </div>
    </div>
  );
}
