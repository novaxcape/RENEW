const Review = ({ centreData, pricingData, selectedFacilities, uploadedImages, documents, openingHours }) => {
  const imageCount = Object.keys(uploadedImages || {}).length;
  const openDays = Object.entries(openingHours || {})
    .filter(([, value]) => value.isOpen)
    .map(([day, value]) => `${day}: ${value.openTime} - ${value.closeTime}`);

  return (
    <div className="step-content">
      {/* <div className="card-title">Review & Submit</div> */}
      <p className="card-subtitle">Please review all information before submitting</p>
      
      <div className="review-section">
        <div className="review-title">Basic Information</div>
        <div className="review-row"><span>Name:</span><span>{centreData.centreName || 'Not set'}</span></div>
        <div className="review-row"><span>City:</span><span>{centreData.city || 'Not set'}</span></div>
        <div className="review-row"><span>State:</span><span>{centreData.state || 'Not set'}</span></div>
        <div className="review-row"><span>Address:</span><span>{centreData.streetAddress || 'Not set'}</span></div>
        <div className="review-row"><span>Description:</span><span>{centreData.description || 'Not set'}</span></div>
      </div>
      
      <div className="review-section">
        <div className="review-title">Facilities</div>
        <div className="review-row">
          <span>{selectedFacilities.length ? selectedFacilities.join(', ') : 'No facilities selected'}</span>
        </div>
      </div>
      
      <div className="review-section">
        <div className="review-title">Pricing & Booking Settings</div>
        <div className="review-row"><span>Adult:</span><span>NGN {pricingData.adultPrice || 'Not set'}</span></div>
        <div className="review-row"><span>Child:</span><span>NGN {pricingData.childPrice || 'Not set'}</span></div>
        <div className="review-row"><span>Family Pack:</span><span>NGN {pricingData.familyPackage || 'Not set'}</span></div>
        <div className="review-row"><span>Daily Capacity:</span><span>{pricingData.dailySlotCapacity || 'Not set'}</span></div>
      </div>
      
      <div className="review-section">
        <div className="review-title">Images & Media</div>
        <div className="review-row"><span>Images:</span><span>{imageCount || 'Not set'}</span></div>
        <div className="review-row"><span>Terms:</span><span>{documents.termsAndCondition?.name || 'Not set'}</span></div>
        <div className="review-row"><span>Privacy:</span><span>{documents.privacyPolicy?.name || 'Not set'}</span></div>
      </div>
      
      <div className="review-section">
        <div className="review-title">Operating Hours</div>
        {openDays.length ? (
          openDays.map((item) => (
            <div className="review-row" key={item}><span>{item}</span></div>
          ))
        ) : (
          <div className="review-row"><span>Not set</span></div>
        )}
      </div>
    </div>
  );
};

export default Review;
