import React from "react";
import "../Styles/SignInScreen.css";
import {  FaCheckCircle } from "react-icons/fa";
import { TbUser } from "react-icons/tb";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";

const SignInScreen = () => {
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

        <div className="signup-card">
          <div className="icon-circle user-icon">
            <TbUser />

          </div>

          <h2>Sign Up as User</h2>

          <p className="card-description">
            Discover and book amazing tourism experiences across Nigeria
          </p>


         <a href="/signup-user" className="user-btn">
  Get Started →
</a>


        </div>

        <div className="signup-card-vendor">
          <div className="icon-circle vendor-icon">
                 <HiMiniBuildingOffice2 />
          </div>

          <h2>Sign Up as Vendor</h2>

          <p className="vendor-card-description">
            List your tourism center and reach thousands of travelers
          </p>


         <a href="/signup-user" className="vendor-btn">
  Get Started →
</a>

        </div>

      </div>
    </div>
  );
};

export default SignInScreen;