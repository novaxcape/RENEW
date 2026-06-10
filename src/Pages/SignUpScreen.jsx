import React from "react";
import "../Styles/SignUpScreen.css";
import {  FaCheckCircle } from "react-icons/fa";
import { TbUser } from "react-icons/tb";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";

const SignUpScreen = () => {
  return (
    <div className="signup-page">
      <div className="signup-logo">
        <img src="/novaxcape/logo.png" alt="NovaXcape" />
      </div>

      <div className="signup-header">
        <h1>Welcome to NovaXcape</h1>
        <p>Choose how you'd like to join our community</p>
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

          <ul>
            <li>
              <FaCheckCircle /> Browse tourism centers and attractions
            </li>
            <li>
              <FaCheckCircle /> Instant booking and confirmation
            </li>
            <li>
              <FaCheckCircle /> Exclusive deals and offers
            </li>
          </ul>

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

          <ul>
            <li>
              <FaCheckCircle /> Manage bookings and reservations
            </li>
            <li>
              <FaCheckCircle /> Automated payment processing
            </li>
            <li>
              <FaCheckCircle /> Marketing and promotion support
            </li>
          </ul>

         <a href="/signup-user" className="vendor-btn">
  Get Started →
</a>

        </div>

      </div>
    </div>
  );
};

export default SignUpScreen;