import React from 'react'
import './css/profile.css'

const Profile = () => {
  return (
    <div className="profile-settings-container">
      <header className="settings-header">
        <h1 className="settings-title">Profile Settings</h1>
        <p className="settings-subtitle">Manage your account information and preferences</p>
      </header>

      <section className="profile-photo-section">
        <div className="avatar-wrapper">
          <img 
            src="/avatar-placeholder.png" 
            alt="User avatar" 
            className="avatar-image" 
          />
        </div>
        <div className="photo-controls">
          <h2 className="profile-label">Profile</h2>
          <div className="photo-actions">
            <button type="button" className="btn-upload">
              <span className="icon-upload"></span>
              Upload Image
            </button>
            <button type="button" className="btn-remove">Remove</button>
          </div>
          <p className="photo-hint">We support PNGs, JPEGs and GIFs under 20MB.</p>
        </div>
      </section>

      {/* Segmented Navigation Tab Container Bar */}
      <div className="settings-tabs-wrapper">
        <nav className="settings-tabs-nav">
          <button type="button" className="tab-item active">Account Setting</button>
          <button type="button" className="tab-item regular">Setting</button>
        </nav>
      </div>

      <form className="settings-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <div className="input-wrapper">
              <input type="text" id="firstName" placeholder="Enter your Name" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <div className="input-wrapper">
              <input type="text" id="lastName" placeholder="Enter your Name" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <div className="input-wrapper">
              <input type="text" id="nickname" placeholder="Ebere_Lovely" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <div className="input-wrapper">
              <input type="tel" id="phoneNumber" placeholder="Input phone number" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <div className="input-wrapper select-wrapper">
              <select id="gender" defaultValue="">
                <option value="" disabled hidden>Select Option</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input type="email" id="email" placeholder="Enter your Email" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <div className="input-wrapper">
              <input type="text" id="city" placeholder="Enter your Email" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <div className="input-wrapper">
              <input type="text" id="state" placeholder="Enter your Email" />
            </div>
          </div>
        </div>

        <div className="form-actions-footer">
          <button type="submit" className="btn-save">
            Save Changes
            <span className="icon-save"></span>
          </button>
          <button type="button" className="btn-delete">
            Delete Account
            <span className="icon-delete"></span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile
