import { X } from "lucide-react";

export default function AdminModal({ title, description, onClose }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="presentation">
      <section
        aria-labelledby="admin-modal-title"
        aria-modal="true"
        className="admin-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button aria-label="Close dialog" className="admin-modal-close" onClick={onClose} type="button">
          <X size={19} />
        </button>
        <h2 id="admin-modal-title">{title}</h2>
        <p>{description}</p>
        <button className="admin-primary-button" onClick={onClose} type="button">Got it</button>
      </section>
    </div>
  );
}
