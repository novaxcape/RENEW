import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import './css/Packageupdatedpop.css';

const PackageUpdatedPop = () => {
  return (
    <div className="container">
      <div className="card">
      

        {/* Title */}
        <h4 className="packageupdatedpop-title">
          Package updated successfully
        </h4>

        {/* Description */}
        <p className="description">
          Your package has been updated.
        </p>

        {/* Continue Button */}
        <button className="btn">
          <span>Continue</span>
          <ArrowRight className="btn-icon" />
        </button>

       
      </div>
    </div>
  );
};

export default PackageUpdatedPop;