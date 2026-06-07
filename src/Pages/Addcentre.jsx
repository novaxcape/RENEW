
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer2 from '../components/Footer2';
import Stepper from '../components/Stepper';
import "../Styles/Addcenter.css";

import BasicInfo from '../components/BasicInfo';
import Facilities from '../components/Facilities';
import Pricing from '../components/Pricing';
import Images from '../components/Images';
import Hours from '../components/Hours';
import Review from '../components/Review';

const AddCentre = () => {
  // State to track which step we are on (1 to 6)
  const [currentStep, setCurrentStep] = useState(1);

  // Function to go to next step
  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // If on last step, go to KYC
      window.location.href = '/kyc';
    }
  };

  // Function to go to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // If on first step, go back to dashboard
      window.location.href = '/dashboard';
    }
  };

  // Function to render the correct component based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return <BasicInfo />;
      case 2:
        return <Facilities />;
      case 3:
        return <Pricing />;
      case 4:
        return <Images />;
      case 5:
        return <Hours />;
      case 6:
        return <Review />;
      default:
        return <BasicInfo />;
    }
  };

  // Get the title for the current step
  const getStepTitle = () => {
    const titles = [
      'Basic Information',
      'Facilities & Amenities',
      'Pricing & Tickets',
      'Images & Media',
      'Operating Hours',
      'Review & Submit'
    ];
    return titles[currentStep - 1];
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="main-content">
        <button className="btn-back" onClick={handleBack}>
          Back
        </button>
        
        <h1>Add New Tourism Centre</h1>
        <p className="subtitle">
          Fill in the details to list your tourism centre on NovaEscape
        </p>

        <Stepper currentStep={currentStep} />

        <div className="form-card">
          {/* Step Header */}
          <div className="step-header">
            <h2 className="card-title">{getStepTitle()}</h2>
            {currentStep === 2 && (
              <p className="card-subtitle">
                Select all the facilities and amenities available at your centre
              </p>
            )}
            {currentStep === 4 && (
              <p className="card-subtitle">
                Upload high-quality images of your tourism centre (minimum 3 images recommended)
              </p>
            )}
          </div>

          {/* Render the current step component */}
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="form-actions">
            <button className="btn-next" onClick={handleNext}>
              {currentStep === 6 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      <Footer2 />
    </div>
  );
};

export default AddCentre;