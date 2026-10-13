import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <main className="contact-page" id="contact-page">
      <p className="contact-eyebrow" id="contact-eyebrow">V | WE WOULD LOVE TO HEAR FROM YOU</p>
      <h1 className="contact-title" id="contact-title">CONTACT</h1>
      <p className="contact-description" id="contact-description">Get in touch with the Belmarose team.</p>

      <form className="contact-message-form" id="contact-message-form">
        <label className="contact-name-field" id="contact-name-field">
          <span className="contact-name-label" id="contact-name-label">Your name</span>
          <input className="contact-name-input" id="contact-name-input" type="text" name="name" placeholder="Your Name" required />
        </label>
        <label className="contact-email-field" id="contact-email-field">
          <span className="contact-email-label" id="contact-email-label">Your email</span>
          <input className="contact-email-input" id="contact-email-input" type="email" name="email" placeholder="Your Email" required />
        </label>
        <label className="contact-message-field" id="contact-message-field">
          <span className="contact-message-label" id="contact-message-label">Your message</span>
          <textarea className="contact-message-input" id="contact-message-input" name="message" placeholder="Your Message" required />
        </label>
        <button className="contact-submit-button" id="contact-submit-button" type="submit">Send Message</button>
      </form>
    </main>
  );
}

export default Contact;