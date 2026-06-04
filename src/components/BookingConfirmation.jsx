import React from 'react';
import './css/BookingConfirmation.css';
import { HiOutlineMail } from 'react-icons/hi';
import { FiMapPin, FiCalendar, FiShield, FiDownload } from 'react-icons/fi';
import { RiIdCardLine } from 'react-icons/ri';

const BookingConfirmation = () => {
  return (
    <div className="confirmation-page-wrapper">
      <div className="confirmation-card">
        
        <div className="success-badge-container">
          <img 
            src="/src/assets/check.png" 
            alt="Booking Confirmed" 
            className="success-checkmark-img" 
          />
        </div>

        <h1 className="confirmation-title">Booking Confirmed!</h1>
        <p className="confirmation-subtitle">Your booking has been successfully confirmed.</p>

        <div className="email-toast-message">
          <div className="email-left-content">
            <HiOutlineMail className="email-toast-icon" />
            <span className="email-toast-text">Your digital ticket has been sent to your email.</span>
          </div>
        </div>

        <div className="booking-details-box">
          <h3 className="details-section-title">Booking Details</h3>
          
          <div className="detail-item-row">
            <FiMapPin className="detail-meta-icon" />
            <div className="detail-text-cell">
              <span className="detail-field-label">Location</span>
              <span className="detail-field-value">Lekki Conservation Centre</span>
            </div>
          </div>

          <div className="detail-item-row">
            <FiCalendar className="detail-meta-icon" />
            <div className="detail-text-cell">
              <span className="detail-field-label">Visit Date</span>
              <span className="detail-field-value">May 15, 2026 at 10:AM</span>
            </div>
          </div>

          <div className="detail-item-row">
            <RiIdCardLine className="detail-meta-icon" />
            <div className="detail-text-cell">
              <span className="detail-field-label">Booking ID</span>
              <span className="detail-field-value">Nov-2026-05-001234</span>
            </div>
          </div>
        </div>

        <div className="passcode-container-card">
          <div className="passcode-header-row">
            <FiShield className="passcode-shield-icon" />
            <h4 className="passcode-main-heading">Gate verification Passcode</h4>
          </div>
          <p className="passcode-sub-caption">Show this code at the gate for entry verification</p>

          <div className="passcode-display-block">
            <span className="passcode-digit">7</span>
            <span className="passcode-digit">3</span>
            <span className="passcode-digit">0</span>
            <span className="passcode-digit">5</span>
            <span className="passcode-digit">9</span>
            <span className="passcode-digit">7</span>
          </div>

          <button className="download-passcode-action-btn">
            <FiDownload className="download-action-icon" />
            Download Passcode
          </button>
        </div>

        <div className="navigation-footer-action">
          <button className="homepage-redirect-btn">Back to Homepage</button>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;
