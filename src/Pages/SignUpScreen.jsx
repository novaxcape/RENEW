import React from "react";
import "../Styles/SignUgitpScreen.css";
import { TbUser } from "react-icons/tb";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SignUpScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-page">
      {/* Logo */}
      <div className="signup-logo">
        <img src="/novaxcape/logo.png" alt="NovaXcape" />
      </div>

      {/* Header */}
      <div className="signup-header">
        <h1>Welcome to NovaXcape</h1>
        <p>Choose how you'd like to join our community</p>
      </div>

      {/* Cards */}
      <div className="signup-cards">
        {/* User Card */}
        <div
          className="signup-card"
          onClick={() => navigate("/signup")}
        >
          <div className="icon-circle user-icon">
            <TbUser />
          </div>

          <h2>Sign Up as User</h2>

          <p className="card-description">
            Discover and book amazing tourism experiences across Nigeria
          </p>

          <ul>
            <li>
              <FaCheckCircle />
              Browse tourism centers and attractions
            </li>

            <li>
              <FaCheckCircle />
              Instant booking and confirmation
            </li>

            <li>
              <FaCheckCircle />
              Exclusive deals and offers
            </li>
          </ul>

          <span className="user-btn">
            Get Started →
          </span>
        </div>

        {/* Vendor Card */}
        <div
          className="signup-card-vendor"
          onClick={() => navigate("/signupvendor")}
        >
          <div className="icon-circle vendor-icon">
            <HiMiniBuildingOffice2 />
          </div>

          <h2>Sign Up as Vendor</h2>

          <p className="vendor-card-description">
            List your tourism center and reach thousands of travelers
          </p>

          <ul>
            <li>
              <FaCheckCircle />
              Manage bookings and reservations
            </li>

            <li>
              <FaCheckCircle />
              Automated payment processing
            </li>

            <li>
              <FaCheckCircle />
              Marketing and promotion support
            </li>
          </ul>

          <span className="vendor-btn">
            Get Started →
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;