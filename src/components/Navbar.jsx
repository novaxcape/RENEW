import React from "react";
import { Link } from "react-router-dom";
import { IconCheck } from "./Icon";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo-mark">N</span>
        <span className="logo-text">Novaxcape</span>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add-centre" className="active">
          Add Centre
        </Link>
        <Link to="/kyc">KYC Verification</Link>
      </div>
      <div className="nav-user">
        <IconCheck />
      </div>
    </nav>
  );
};

export default Navbar;
