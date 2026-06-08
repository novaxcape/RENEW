import React from 'react';
import { LuUser } from 'react-icons/lu';
import { HiOutlineMenu } from 'react-icons/hi';
import './css/KycHeader.css';

const KycHeader = () => {
  return (
    <header className="kyc-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/novaxcape/logo.png" alt="Novaxcape Logo" className="logo-img" />
        </div>
        
        <nav className="navbar-links">
          <a href="#home" className="nav-item">Home</a>
          <a href="#dashboard" className="nav-item">Dashboard</a>
          <a href="#add-centre" className="nav-item">Add Centre</a>
          <a href="#kyc" className="nav-item active">KYC Verification</a>
        </nav>
        
        <div className="navbar-actions">
          <div className="navbar-profile">
            <LuUser className="profile-icon" />
          </div>
          <button type="button" className="mobile-menu-btn">
            <HiOutlineMenu className="menu-icon" />
          </button>
        </div>
      </div>
      <div className="navbar-bottom-line"></div>
    </header>
  );
};

export default KycHeader;
