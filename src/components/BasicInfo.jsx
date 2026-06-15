// src/components/BasicInfo.js

const BasicInfo = ({ formData, onChange }) => {
  return (
    <div className="step-content">
      {/* <div className="card-title">Basic Information</div> */}
      
      <div className="form-group">
        <label>Centre Name *</label>
        <input
          type="text"
          name="centreName"
          placeholder="e.g., Lekki Conservation centre"
          className="input-field"
          value={formData.centreName}
          onChange={onChange}
        />
      </div>
      
      <div className="form-group">
        <label>Description *</label>
        <textarea
          name="description"
          placeholder="Describe your tourism centre, what makes it special, and what visitors can expect..."
          className="textarea-field"
          value={formData.description}
          onChange={onChange}
        />
      </div>
      
      <div className="row">
        <div className="form-group half">
          <label>City *</label>
          <input
            type="text"
            name="city"
            className="input-field"
            value={formData.city}
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

      <div className="row">
        <div className="form-group half">
          <label>Street Address *</label>
          <input
            type="text"
            name="streetAddress"
            placeholder="e.g., Lekki-Epe Expressway"
            className="input-field"
            value={formData.streetAddress}
            onChange={onChange}
          />
        </div>
        <div className="form-group half">
          <label>Location *</label>
          <input
            type="text"
            name="location"
            placeholder="e.g., Lekki, Lagos"
            className="input-field"
            value={formData.location}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
