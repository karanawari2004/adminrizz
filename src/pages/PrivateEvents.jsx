import { Link } from "react-router-dom";
import "./PrivateEvents.css";

function PrivateEvents() {
  return (
    <main className="private-events-page" id="private-events-page">
      <p className="private-events-eyebrow" id="private-events-eyebrow">IV | CELEBRATE AT BELMAROSE</p>
      <h1 className="private-events-title" id="private-events-title">Private Events</h1>
      <p className="private-events-description" id="private-events-description">
        Get in touch with our team to enquire about hosting your next occasion
        at Belmarose.
      </p>
      <Link className="private-events-contact-link" id="private-events-contact-link" to="/contact">
        CONTACT OUR TEAM <span className="private-events-contact-arrow" id="private-events-contact-arrow" aria-hidden="true">&#8599;</span>
      </Link>
    </main>
  );
}

export default PrivateEvents;
