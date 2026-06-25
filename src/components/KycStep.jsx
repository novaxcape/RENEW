const KycStep = ({ formData, onChange }) => {
  return (
    <div className="step-content">
      <div className="kyc-step-intro">
        <h3>Complete KYC Verification First</h3>
        <p>
          Vendors must provide verification details before listing a tourism centre.
        </p>
      </div>

      <div className="section-subtitle">Business Information</div>
      <div className="row">
        <div className="form-group half">
          <label>Landmark *</label>
          <input
            type="text"
            name="lankmark"
            placeholder="e.g., Near Lekki Toll Gate"
            className="input-field"
            value={formData.lankmark}
            onChange={onChange}
          />
        </div>
        <div className="form-group half">
          <label>CAC Registration Number *</label>
          <input
            type="text"
            name="CAC"
            placeholder="e.g., RC 123456"
            className="input-field"
            value={formData.CAC}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="form-group half">
          <label>Year Established *</label>
          <input
            type="number"
            name="yearEstablished"
            placeholder="e.g., 2020"
            className="input-field"
            value={formData.yearEstablished}
            onChange={onChange}
          />
        </div>
        <div className="form-group half">
          <label>Centre Type *</label>
          <input
            type="text"
            name="centreType"
            placeholder="e.g., recreation, museum"
            className="input-field"
            value={formData.centreType}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="form-group half">
          <label>Centre Phone *</label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="08012345678"
            className="input-field"
            value={formData.phoneNumber}
            onChange={onChange}
          />
        </div>
        <div className="form-group half">
          <label>Centre Email</label>
          <input
            type="email"
            name="centreEmail"
            placeholder="info@business.com"
            className="input-field"
            value={formData.centreEmail}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="form-group half">
          <label>Postal Code *</label>
          <input
            type="text"
            name="postal"
            placeholder="e.g., 101245"
            className="input-field"
            value={formData.postal}
            onChange={onChange}
          />
        </div>
        <div className="form-group half">
          <label>State *</label>
          <input
            type="text"
            name="state"
            placeholder="e.g., Lagos"
            className="input-field"
            value={formData.state}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="section-subtitle kyc-section-gap">Owner/Director Information</div>
      <div className="row">
        <div className="form-group half">
          <label>Director Full Name *</label>
          <input
            type="text"
            name="directorFullName"
            placeholder="John Doe"
            className="input-field"
            value={formData.directorFullName}
            onChange={onChange}
          />
        </div>
        <div className="form-group half">
          <label>Director Email *</label>
          <input
            type="email"
            name="directorEmail"
            placeholder="director@example.com"
            className="input-field"
            value={formData.directorEmail}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Director Phone Number *</label>
        <input
          type="tel"
          name="directorPhoneNumber"
          placeholder="08012345678"
          className="input-field"
          value={formData.directorPhoneNumber}
          onChange={onChange}
        />
      </div>

      <div className="section-subtitle kyc-section-gap">Bank Account Details</div>
      <div className="row">
        <div className="form-group half">
          <label>Bank Name *</label>
          <input
            type="text"
            name="bankName"
            placeholder="e.g., Access Bank"
            className="input-field"
            value={formData.bankName}
            onChange={onChange}
          />
        </div>
        <div className="form-group half">
          <label>Account Number *</label>
          <input
            type="text"
            name="accountNumber"
            placeholder="1234567890"
            className="input-field"
            value={formData.accountNumber}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="form-group half">
          <label>Account Name *</label>
          <input
            type="text"
            name="accountName"
            placeholder="As it appears in bank records"
            className="input-field"
            value={formData.accountName}
            onChange={onChange}
          />
        </div>
        <div className="form-group half">
          <label>Bank Code</label>
          <input
            type="text"
            name="bankCode"
            placeholder="e.g., 044"
            className="input-field"
            value={formData.bankCode}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default KycStep;
