import React from 'react';
import './css/CtaBanner.css';
import { useNavigate } from "react-router-dom";


const CtaBanner = () => {
    const navigate = useNavigate();

  return (
    <section className="cta-container">
      <div className="cta-card">
        <div className="circle-top-left-outer"></div>
        <div className="circle-top-left-inner"></div>
        <div className="circle-bottom-right-outer"></div>
        <div className="circle-bottom-right-inner"></div>

        <div className="cta-content">
          <div className="cta-badge-wrapper">
            <span className="cta-badge">Start Your Adventure today</span>
          </div>
          
          <h2 className="cta-title">Ready to get started with us ?</h2>
          
          <p className="cta-description">
            Join NovaEscape today and start growing your tourism business
          </p>
          
          <button className="cta-button" type="button"
          onClick={() => navigate("/signupvendor")}>
            Register centre
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
