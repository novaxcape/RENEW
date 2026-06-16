import React from "react";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg"

const Navbar = () => {
  return (
    <nav className="navbar">
   <div className="nav_holder">   <div className="nav-brand">
       <img
          src="/novaxcape/logo.png"
          alt="novaxcape"
          className="p-navbar-brand-logo"
        />
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/vendor/dashboard">Dashboard</Link>
        <Link to="/add-centre" className="active">
          Add Centre
        </Link>
        <Link to="/kyc">KYC Verification</Link>
      </div>
      <div className="nav-user">
   <CgProfile />
      </div></div>
    </nav>
  );
};

export default Navbar;
