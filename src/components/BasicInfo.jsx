// src/components/BasicInfo.js
import React from 'react';

const BasicInfo = () => {
  return (
    <div className="step-content">
      <div className="card-title">Basic Information</div>
      
      <div className="form-group">
        <label>Centre Name *</label>
        <input type="text" placeholder="e.g., Lekki Conservation centre" className="input-field" />
      </div>
      
      <div className="form-group">
        <label>Description *</label>
        <textarea placeholder="Describe your tourism centre, what makes it special, and what visitors can expect..." className="textarea-field"></textarea>
      </div>
      
      <div className="row">
        <div className="form-group half">
          <label>City *</label>
          <input type="text" className="input-field" />
        </div>
        <div className="form-group half">
          <label>Street Address *</label>
          <input type="text" placeholder="e.g., Lekki-Epe Expressway" className="input-field" />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;