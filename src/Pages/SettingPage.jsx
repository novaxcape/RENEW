import React from "react";
// import "./SettingsPage.css";
import "../Styles/Setting.css";
import { FaEyeSlash, FaSave } from "react-icons/fa";


const SettingsPage = () => {
  return (
    <div className="settings-page">

      {/* Business Information */}
      <div className="settings-card">
        <h2>Business Information</h2>
        <p className="sub-text">
          Update your business details and contact information
        </p>

        <div className="form-group">
          <label>Business Name</label>
          <input
            type="text"
            placeholder="Lekki Conservation Centre"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            placeholder="Lekki Peninsula, Lagos Nigeria"
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="+234 706 394 1359"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="lekkiconservationcenter688@gmail.com"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-card">
        <h2>Notification Preferences</h2>
        <p className="sub-text">
          Choose which notifications you would like to receive
        </p>

        <div className="notification-row">
          <div>
            <h4>Booking Alerts</h4>
            <p>Get notified when a new booking is placed</p>
          </div>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="notification-row">
          <div>
            <h4>New Reviews Alert</h4>
            <p>Get notified when a new user drops a review</p>
          </div>

          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>

        <div className="notification-row">
          <div>
            <h4>Cancellation Alerts</h4>
            <p>Get notified when a user cancels during booking</p>
          </div>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Password */}
      <div className="settings-card">
        <h2>Change Password</h2>

        <div className="form-group">
          <label>Current Password</label>

          <div className="password-field">
            <input type="password" placeholder="Input password" />
            <FaEyeSlash />
          </div>
        </div>

        <div className="form-group">
          <label>New Password</label>

          <div className="password-field">
            <input type="password" placeholder="Input password" />
            <FaEyeSlash />
          </div>
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>

          <div className="password-field">
            <input type="password" placeholder="Input password" />
            <FaEyeSlash />
          </div>
        </div>

        <button className="orange-btn">
          Change Password
        </button>
      </div>

      {/* Save Changes */}
      <div className="save-container">
        <button className="orange-btn save-btn">
          Save Changes <FaSave />
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;