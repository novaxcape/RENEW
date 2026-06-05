
import React from 'react';
import { IconCheck } from './Icon';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo-mark">N</span>
        <span className="logo-text">Novaxcape</span>
      </div>
      <div className="nav-links">
  <a href="/">Home</a>
  <a href="/dashboard">Dashboard</a>
  <a href="/add-centre" className="active">Add Centre</a>
  <a href="/kyc-verification">KYC Verification</a>
</div>
      <div className="nav-user">
        <IconCheck />
      </div>
    </nav>
  );
};

export default Navbar;