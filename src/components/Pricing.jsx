import { useState } from 'react';

const Pricing = ({ formData, onChange, onPackagesChange, onDocumentsChange, documents }) => {
  const [packages, setPackages] = useState([
    { packageName: '', packageType: '', amount: '', numberOfPeople: '' }
  ]);

  const addPackage = () => {
    setPackages([...packages, { packageName: '', packageType: '', amount: '', numberOfPeople: '' }]);
  };

  const removePackage = (index) => {
    const newPackages = packages.filter((_, i) => i !== index);
    setPackages(newPackages);
    if (onPackagesChange) {
      onPackagesChange(newPackages);
    }
  };

  const updatePackage = (index, field, value) => {
    const newPackages = [...packages];
    newPackages[index][field] = value;
    setPackages(newPackages);
    if (onPackagesChange) {
      onPackagesChange(newPackages);
    }
  };

  const handleDocumentSelect = (event, field) => {
    if (onDocumentsChange) {
      onDocumentsChange({
        ...documents,
        [field]: event.target.files?.[0] || null,
      });
    }
  };

  return (
    <div className="step-content">
      {/* Package Settings Section */}
      <div className="pricing-section">
        <h3 className="section-subtitle">Package Settings</h3>
        <p className="section-description">Set your booking packages</p>
        
        {packages.map((pkg, index) => (
          <div key={index} className="package-item">
            {index > 0 && (
              <button type="button" className="remove-package" onClick={() => removePackage(index)}>
                ×
              </button>
            )}
            <div className="row">
              <div className="form-group half">
                <label>Package Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Adult Ticket"
                  className="input-field"
                  value={pkg.packageName}
                  onChange={(e) => updatePackage(index, 'packageName', e.target.value)}
                />
              </div>
              <div className="form-group half">
                <label>Package Type *</label>
                <select
                  className="input-field"
                  value={pkg.packageType}
                  onChange={(e) => updatePackage(index, 'packageType', e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Adult">Adult</option>
                  <option value="Child">Child</option>
                  <option value="Family">Family</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="form-group half">
                <label>Amount (₦) *</label>
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  className="input-field"
                  value={pkg.amount}
                  onChange={(e) => updatePackage(index, 'amount', e.target.value)}
                />
              </div>
              <div className="form-group half">
                <label>Number of People *</label>
                <input
                  type="number"
                  placeholder="e.g., 1"
                  className="input-field"
                  value={pkg.numberOfPeople}
                  onChange={(e) => updatePackage(index, 'numberOfPeople', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="add-more-btn" onClick={addPackage}>
          + Click to add more
        </button>
      </div>

      {/* Booking Settings Section */}
      <div className="booking-settings-section">
        <h3 className="section-subtitle">Booking Settings</h3>
        
        <div className="form-group">
          <label>Daily Slot Capacity *</label>
          <input
            type="number"
            name="dailySlotCapacity"
            placeholder="e.g., 100"
            className="input-field"
            value={formData.dailySlotCapacity}
            onChange={onChange}
          />
          <small className="input-hint">Maximum number of visitors allowed per day</small>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="installmentPayment"
            checked={formData.installmentPayment}
            onChange={onChange}
          />
          <span>Accept Installment Payment</span>
        </label>
        <p className="checkbox-hint">Allow customers to pay in installment (1, 2, or 3 months)</p>
      </div>

      {/* Legal Information Section */}
      <div className="legal-section">
        <h3 className="section-subtitle">Legal Information</h3>
        
        <div className="form-group">
          <label>Terms & Conditions *</label>
          <div className="upload-box" onClick={() => document.getElementById('termsInput').click()}>
            <div className="upload-icon">📄</div>
            <div className="upload-text">Click to upload or drag and drop</div>
            <div className="upload-sub">PDF, DOC, DOCX, PNG, JPG up to 10MB</div>
            <input
              id="termsInput"
              type="file"
              accept=".pdf,.doc,.docx,image/png,image/jpeg,image/jpg"
              style={{ display: 'none' }}
              onChange={(e) => handleDocumentSelect(e, 'termsAndCondition')}
            />
          </div>
          {documents?.termsAndCondition && (
            <p className="upload-sub" style={{ marginTop: "5px", color: "#004481" }}>
              ✓ {documents.termsAndCondition.name}
            </p>
          )}
          <small className="input-hint">This will be shown to customers before they complete their booking</small>
        </div>

        <div className="form-group">
          <label>Privacy Policy *</label>
          <div className="upload-box" onClick={() => document.getElementById('privacyInput').click()}>
            <div className="upload-icon">📄</div>
            <div className="upload-text">Click to upload or drag and drop</div>
            <div className="upload-sub">PDF, DOC, DOCX, PNG, JPG up to 10MB</div>
            <input
              id="privacyInput"
              type="file"
              accept=".pdf,.doc,.docx,image/png,image/jpeg,image/jpg"
              style={{ display: 'none' }}
              onChange={(e) => handleDocumentSelect(e, 'privacyPolicy')}
            />
          </div>
          {documents?.privacyPolicy && (
            <p className="upload-sub" style={{ marginTop: "5px", color: "#004481" }}>
              ✓ {documents.privacyPolicy.name}
            </p>
          )}
          <small className="input-hint">Show how you handle customer data and privacy</small>
        </div>
      </div>
    </div>
  );
};

export default Pricing;