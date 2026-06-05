import React from 'react';
import { IconWifi, IconCar, IconImage } from './Icon';

// Add IconUtensils if not in Icons.js
const IconUtensils = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
    <path d="M7 2v20"></path>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
  </svg>
);

const Facilities = () => {
  return (
    <div className="step-content">
      <div className="card-title">Facilities & Amenities</div>
      <p className="card-subtitle">Select all the facilities and amenities available at your centre</p>
      
      <div className="facilities-grid">
        <div className="facility-card">
          <IconWifi />
          <span>Free WiFi</span>
        </div>
        <div className="facility-card">
          <IconCar />
          <span>Parking</span>
        </div>
        <div className="facility-card">
          <IconUtensils />
          <span>Restaurant</span>
        </div>
        <div className="facility-card">
          <IconImage />
          <span>Photography Allowed</span>
        </div>
      </div>
    </div>
  );
};

export default Facilities;