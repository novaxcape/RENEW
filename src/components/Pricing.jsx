import React from 'react';

const Pricing = () => {
  return (
    <div className="step-content">
      <div className="pricing-section">
        <div className="row">
          <div className="form-group half">
            <label>Adult Price *</label>
            <input type="text" placeholder="₦ 5,000" className="input-field" />
          </div>
          <div className="form-group half">
            <label>Child Price *</label>
            <input type="text" placeholder="₦ 2,500" className="input-field" />
          </div>
        </div>
        <div className="row">
          <div className="form-group half">
            <label>Family Package *</label>
            <input type="text" placeholder="₦ 15,000" className="input-field" />
          </div>
          <div className="form-group half">
            <label>Daily Capacity *</label>
            <input type="text" placeholder="e.g., 500 visitors/day" className="input-field" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;