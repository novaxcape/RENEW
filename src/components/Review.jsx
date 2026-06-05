import React from 'react';

const Review = () => {
  return (
    <div className="step-content">
      <div className="card-title">Review & Submit</div>
      <p className="card-subtitle">Please review all information before submitting</p>
      
      <div className="review-section">
        <div className="review-title">Basic Information</div>
        <div className="review-row"><span>Name:</span><span>Not set</span></div>
        <div className="review-row"><span>City:</span><span>Not set</span></div>
        <div className="review-row"><span>Address:</span><span>Not set</span></div>
        <div className="review-row"><span>Description:</span><span>Not set</span></div>
      </div>
      
      <div className="review-section">
        <div className="review-title">Facilities</div>
        <div className="review-row"><span>No facilities selected</span></div>
      </div>
      
      <div className="review-section">
        <div className="review-title">Pricing & Booking Settings</div>
        <div className="review-row"><span>Adult:</span><span>₦ Not set</span></div>
        <div className="review-row"><span>Child:</span><span>₦ Not set</span></div>
        <div className="review-row"><span>Family Pack:</span><span>₦ Not set</span></div>
        <div className="review-row"><span>Daily Capacity:</span><span>Not set</span></div>
      </div>
      
      <div className="review-section">
        <div className="review-title">Images & Media</div>
        <div className="review-row"><span>Not set</span></div>
      </div>
      
      <div className="review-section">
        <div className="review-title">Operating Hours</div>
        <div className="review-row"><span>Not set</span></div>
      </div>
    </div>
  );
};

export default Review;