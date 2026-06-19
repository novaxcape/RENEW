import React from "react";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./css/CentreHero.css";

const CentreHero = () => {
  const navigate = useNavigate();

  return (
    <div className="partner-hero-section">
      <div className="partner-hero-overlay"></div>

      <div className="partner-hero-content">
        <h1 className="partner-hero-title">
          Partner With NovaXcape
        </h1>

        <p className="partner-hero-subtitle">
          Join Nigeria's leading tourism booking platform and connect your
          centres with thousands of eager travelers
        </p>

        <div className="partner-hero-actions">
          {/* Partner Portal Button */}
          <button
            type="button"
            className="btn-partner-portal"
            onClick={() => navigate("/vendor/login")}
          >
            Partner Portal &rarr;
          </button>

          {/* Register Centre Button */}
          <button
            type="button"
            className="btn-register-centre"
            onClick={() => navigate("/signupvendor")}
          >
            Register Centre
            <FiUserPlus className="register-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CentreHero;