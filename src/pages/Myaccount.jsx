import React from "react";
import "./Myaccount.css";

function MyAccount() {
  return (
    <main className="my-account-page" id="my-account-page">
      <p className="my-account-eyebrow" id="my-account-eyebrow">VI | YOUR BELMAROSE</p>
      <h1 className="my-account-title" id="my-account-title">MY ACCOUNT</h1>
      <p className="my-account-description" id="my-account-description">Welcome to your Belmarose account.</p>

      <form className="my-account-sign-in-form" id="my-account-sign-in-form">
        <label className="my-account-email-field" id="my-account-email-field">
          <span className="my-account-email-label" id="my-account-email-label">Email address</span>
          <input className="my-account-email-input" id="my-account-email-input" type="email" name="email" placeholder="Email Address" required />
        </label>
        <label className="my-account-password-field" id="my-account-password-field">
          <span className="my-account-password-label" id="my-account-password-label">Password</span>
          <input className="my-account-password-input" id="my-account-password-input" type="password" name="password" placeholder="Password" required />
        </label>
        <button className="my-account-sign-in-button" id="my-account-sign-in-button" type="submit">Sign In</button>
      </form>
    </main>
  );
}

export default MyAccount;