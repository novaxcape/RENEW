import React from 'react';

const Review = ({
  centreData,
  pricingData,
  selectedFacilities,
  uploadedImages,
  documents,
  openingHours,
  packagesList = [], // ✅ Added packagesList prop with default empty array
}) => {
  const imageCount = Object.keys(uploadedImages || {}).length;
  const openDays = Object.entries(openingHours || {})
    .filter(([, value]) => value.isOpen)
    .map(([day, value]) => `${day}: ${value.openTime} - ${value.closeTime}`);
  
  // ✅ Filter valid packages
  const validPackages = packagesList.filter(pkg => 
    pkg.packageName?.trim() && 
    pkg.packageType?.trim() && 
    pkg.amount && 
    Number(pkg.amount) > 0 &&
    pkg.numberOfPeople && 
    Number(pkg.numberOfPeople) > 0
  );

  // ✅ Debug logging
  console.log("📦 Review component - packagesList received:", packagesList);
  console.log("📦 Valid packages:", validPackages);
  console.log("📦 Centre Data:", centreData);
  console.log("📦 Documents:", documents);

  // ✅ Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Not set';
    return `₦${Number(amount).toLocaleString()}`;
  };

  return (
    <div className="step-content">
      <p className="card-subtitle">Please review all information before submitting</p>
      
      {/* ✅ Basic Information Section */}
      <div className="review-section">
        <div className="review-title">Basic Information</div>
        <div className="review-row">
          <span>Name:</span>
          <span>{centreData.centreName || "Not set"}</span>
        </div>
        <div className="review-row">
          <span>City:</span>
          <span>{centreData.city || "Not set"}</span>
        </div>
        <div className="review-row">
          <span>State:</span>
          <span>{centreData.state || "Not set"}</span>
        </div>
        <div className="review-row">
          <span>Address:</span>
          <span>{centreData.streetAddress || "Not set"}</span>
        </div>
        <div className="review-row">
          <span>Location/GPS:</span>
          <span>{centreData.location || "Not set"}</span>
        </div>
        <div className="review-row">
          <span>Description:</span>
          <span>{centreData.description || "Not set"}</span>
        </div>
      </div>

      {/* ✅ Facilities Section */}
      <div className="review-section">
        <div className="review-title">Facilities & Amenities</div>
        <div className="review-row">
          <span>
            {selectedFacilities && selectedFacilities.length > 0
              ? selectedFacilities.join(", ")
              : "No facilities selected"}
          </span>
        </div>
      </div>

      {/* ✅ NEW: Packages Section - DISPLAYS PACKAGES */}
      <div className="review-section" style={{ 
        borderLeft: validPackages.length > 0 ? '4px solid #28a745' : '4px solid #dc3545',
        backgroundColor: '#f8f9fa',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <div className="review-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Ticket Packages</span>
          <span style={{ 
            fontSize: '14px', 
            color: validPackages.length > 0 ? '#28a745' : '#dc3545',
            fontWeight: 'bold'
          }}>
            {validPackages.length > 0 ? `✅ ${validPackages.length} package(s) added` : '⚠️ No valid packages'}
          </span>
        </div>
        
        {validPackages.length > 0 ? (
          <div style={{ marginTop: '12px' }}>
            {validPackages.map((pkg, index) => (
              <div key={index} className="review-row" style={{ 
                flexDirection: 'column', 
                alignItems: 'flex-start', 
                gap: '4px',
                padding: '12px',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                marginBottom: '8px',
                border: '1px solid #e9ecef'
              }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
                  {pkg.packageName}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', color: '#666' }}>
                  <span>📋 Type: <strong>{pkg.packageType}</strong></span>
                  <span>💰 Amount: <strong style={{ color: '#ff6b35' }}>{formatCurrency(pkg.amount)}</strong></span>
                  <span>👥 People: <strong>{pkg.numberOfPeople}</strong></span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="review-row" style={{ padding: '12px', backgroundColor: '#fff3f3', borderRadius: '6px' }}>
            <span style={{ color: '#dc3545' }}>
              ⚠️ No valid packages added. Please go back to Pricing step and add at least one package with name, type, amount, and number of people.
            </span>
          </div>
        )}
      </div>

      {/* ✅ Pricing & Booking Settings Section */}
      <div className="review-section">
        <div className="review-title">Pricing & Booking Settings</div>
        <div className="review-row">
          <span>Daily Slot Capacity:</span>
          <span>{pricingData.dailySlotCapacity || "Not set"}</span>
        </div>
        <div className="review-row">
          <span>Installment Payment:</span>
          <span style={{ color: pricingData.installmentPayment ? '#28a745' : '#6c757d' }}>
            {pricingData.installmentPayment ? "✅ Yes" : "No"}
          </span>
        </div>
      </div>

      {/* ✅ Images & Documents Section */}
      <div className="review-section">
        <div className="review-title">Images & Media</div>
        <div className="review-row">
          <span>Images Uploaded:</span>
          <span style={{ color: imageCount > 0 ? '#28a745' : '#dc3545' }}>
            {imageCount > 0 ? `✅ ${imageCount} image(s)` : "No images uploaded"}
          </span>
        </div>
        <div className="review-row">
          <span>Terms & Conditions:</span>
          <span style={{ color: documents?.termsAndCondition ? '#28a745' : '#dc3545' }}>
            {documents?.termsAndCondition?.name ? `✅ ${documents.termsAndCondition.name}` : "Not uploaded"}
          </span>
        </div>
        <div className="review-row">
          <span>Privacy Policy:</span>
          <span style={{ color: documents?.privacyPolicy ? '#28a745' : '#dc3545' }}>
            {documents?.privacyPolicy?.name ? `✅ ${documents.privacyPolicy.name}` : "Not uploaded"}
          </span>
        </div>
      </div>

      {/* ✅ Operating Hours Section */}
      <div className="review-section">
        <div className="review-title">Operating Hours</div>
        {openDays && openDays.length > 0 ? (
          openDays.map((item) => (
            <div className="review-row" key={item}>
              <span>{item}</span>
            </div>
          ))
        ) : (
          <div className="review-row">
            <span style={{ color: '#6c757d' }}>No operating hours set</span>
          </div>
        )}
      </div>

      {/* ✅ Summary Section - Show status of all required fields */}
      <div className="review-section" style={{ 
        backgroundColor: '#e9ecef', 
        padding: '16px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <div className="review-title" style={{ fontSize: '16px', marginBottom: '12px' }}>
          📋 Submission Readiness
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
          <span style={{ color: centreData.centreName ? '#28a745' : '#dc3545' }}>
            {centreData.centreName ? '✅' : '❌'} Centre Name
          </span>
          <span style={{ color: centreData.city && centreData.state ? '#28a745' : '#dc3545' }}>
            {centreData.city && centreData.state ? '✅' : '❌'} Location
          </span>
          <span style={{ color: selectedFacilities?.length > 0 ? '#28a745' : '#dc3545' }}>
            {selectedFacilities?.length > 0 ? '✅' : '❌'} Facilities
          </span>
          <span style={{ color: validPackages.length > 0 ? '#28a745' : '#dc3545' }}>
            {validPackages.length > 0 ? '✅' : '❌'} Packages ({validPackages.length})
          </span>
          <span style={{ color: imageCount > 0 ? '#28a745' : '#dc3545' }}>
            {imageCount > 0 ? '✅' : '❌'} Images ({imageCount})
          </span>
          <span style={{ color: documents?.termsAndCondition && documents?.privacyPolicy ? '#28a745' : '#dc3545' }}>
            {documents?.termsAndCondition && documents?.privacyPolicy ? '✅' : '❌'} Documents
          </span>
        </div>
      </div>
    </div>
  );
};

export default Review;