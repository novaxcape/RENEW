// src/components/kyc.js
import React from 'react';
import Navbar from '../components/Navbar';
import Footer2 from '../components/Footer2';
import { IconCheck } from '../components/Icon';

const kyc = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <button className="btn-back">Back</button>
        <h1>KYC Verification</h1>
        <p className="subtitle">Complete your verification to start receiving bookings</p>

        <div className="form-card">
          <div className="section-header">
            <IconCheck /> Business Information
          </div>
          <div className="row">
            <div className="form-group half">
              <label>Centre Name *</label>
              <input className="input-field" placeholder="e.g., Lekki Tourism Limited" />
            </div>
            <div className="form-group half">
              <label>Landmark *</label>
              <input className="input-field" placeholder="e.g., Near Lekki Toll Gate" />
            </div>
          </div>
          <div className="row">
            <div className="form-group half">
              <label>CAC Registration Number *</label>
              <input className="input-field" placeholder="e.g., RC 123456" />
            </div>
            <div className="form-group half">
              <label>Centre Email *</label>
              <input className="input-field" placeholder="info@business.com" />
            </div>
          </div>
        </div>

        <div className="form-card">
          <div className="section-header">
            <IconCheck /> Owner/Director Information
          </div>
          <div className="row">
            <div className="form-group half">
              <label>Full Name *</label>
              <input className="input-field" placeholder="John Doe" />
            </div>
            <div className="form-group half">
              <label>Email Address *</label>
              <input className="input-field" placeholder="owner@email.com" />
            </div>
          </div>
        </div>

        <div className="submit-area">
          <button className="btn-next">Submit for Verification</button>
        </div>
      </div>
      <Footer2 />
    </div>
  );
};

export default kyc;