import React from "react";
import "../Styles/SignInScreen.css";
import { TbUser } from "react-icons/tb";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const SignUpScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-page">
      <div className="signup-logo">
        <img src="/novaxcape/logo.png" alt="NovaXcape" />
      </div>

      <div className="signup-header">
        <h1>Welcome to NovaXcape</h1>
        <p>Sign in to our community</p>
      </div>

      <div className="signup-cards">
        {/* User Sign Up Card */}
        <div 
          className="signup-card" 
          onClick={() => navigate("/signin")}
          style={{ cursor: "pointer" }}
        >
          <div className="icon-circle user-icon">
            <TbUser />
          </div>
          <h2>Sign In as User</h2>
          <p className="card-description">
            Discover and book amazing tourism experiences across Nigeria
          </p>
          <span className="user-btn" style={{ cursor: "pointer" }}>
            Get Started →
          </span>
        </div>

        {/* Vendor Sign Up Card */}
        <div 
          className="signup-card-vendor" 
          onClick={() => navigate("/signupvendor")}
          style={{ cursor: "pointer" }}
        >
          <div className="icon-circle vendor-icon">
            <HiMiniBuildingOffice2 />
          </div>
          <h2>Sign In as Vendor</h2>
          <p className="vendor-card-description">
            List your tourism center and reach thousands of travelers
          </p>
          <span className="vendor-btn" style={{ cursor: "pointer" }}>
            Get Started →
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;