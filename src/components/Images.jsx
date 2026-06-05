// src/components/Images.js
import React from 'react';
import { IconUpload } from './Icon';

const Images = () => {
  return (
    <div className="step-content">
      <div className="card-title">Images & Media</div>
      <p className="card-subtitle">Upload high-quality images of your tourism centre (minimum 3 images recommended)</p>
      
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="upload-box">
          <div className="upload-icon">
            <IconUpload />
          </div>
          <div className="upload-text">Click to upload or drag and drop</div>
          <div className="upload-sub">PNG, JPG up to 10MB (Recommended: 1920x1080)</div>
        </div>
      ))}
    </div>
  );
};

export default Images;