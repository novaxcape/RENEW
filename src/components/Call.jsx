import React from 'react';
import "../components/css/Call.css";

const Call = () => {
  return (
    <div className="support-banner-container">
      {/* Decorative background shapes */}
      <div className="shape top-left-1"></div>
      <div className="shape top-left-2"></div>
      <div className="shape bottom-right-1"></div>
      <div className="shape bottom-right-2"></div>
      <div className="shape bottom-right-3"></div>

      {/* Main Content */}
      <div className="support-banner-content">
        <div className="badge-wrapper">
          <span className="support-badge">Still Need Help?</span>
        </div>
        
        <h2 className="support-heading">Call us anytime and anyday</h2>
        
        <p className="support-description">
          Our support team is available monday to friday, 9AM to 6PM WAT. 
          We typically respond within 1 hour.
        </p>
        
        <button className="support-button" onClick={() => console.log('Contact clicked')}>
          Contact support team
        </button>
      </div>
    </div>
  );
};

export default Call;