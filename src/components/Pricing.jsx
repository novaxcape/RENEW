const Pricing = ({ formData, onChange }) => {
  return (
    <div className="step-content">
      <div className="pricing-section">
        <div className="row">
          <div className="form-group half">
            <label>Adult Price *</label>
            <input
              type="number"
              name="adultPrice"
              placeholder="5000"
              className="input-field"
              value={formData.adultPrice}
              onChange={onChange}
            />
          </div>
          <div className="form-group half">
            <label>Child Price *</label>
            <input
              type="number"
              name="childPrice"
              placeholder="2500"
              className="input-field"
              value={formData.childPrice}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group half">
            <label>Family Package *</label>
            <input
              type="number"
              name="familyPackage"
              placeholder="15000"
              className="input-field"
              value={formData.familyPackage}
              onChange={onChange}
            />
          </div>
          <div className="form-group half">
            <label>Daily Capacity *</label>
            <input
              type="number"
              name="dailySlotCapacity"
              placeholder="e.g., 500"
              className="input-field"
              value={formData.dailySlotCapacity}
              onChange={onChange}
            />
          </div>
        </div>
        <label className="day-controls" style={{ justifyContent: 'flex-start', marginTop: '12px' }}>
          <input
            type="checkbox"
            name="installmentPayment"
            checked={formData.installmentPayment}
            onChange={onChange}
          />
          <span className="open-label">Allow installment payment</span>
        </label>
      </div>
    </div>
  );
};

export default Pricing;
