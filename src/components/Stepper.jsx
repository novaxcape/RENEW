// src/components/Stepper.js
import React from 'react';
import { IconMapPin, IconBell, IconDollar, IconImage, IconClock, IconCheck } from './Icon';

const Stepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Basic Information', icon: <IconMapPin /> },
    { id: 2, label: 'Facilities & Amenities', icon: <IconBell /> },
    { id: 3, label: 'Pricing & Tickets', icon: <IconDollar /> },
    { id: 4, label: 'Images & Media', icon: <IconImage /> },
    { id: 5, label: 'Operating Hours', icon: <IconClock /> },
    { id: 6, label: 'Review & Submit', icon: <IconCheck /> },
  ];

  return (
    <div className="stepper-container">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="step-wrapper">
            <div className={`step-circle ${currentStep === step.id ? 'active' : ''}`}>
              {step.icon}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="step-line"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;