import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./css/PaymentHeader.css";
import { FiUser, FiHeart, FiMenu } from "react-icons/fi";

const PaymentHeader = () => {
  return (
    <header className="payment-navbar-header">
      <div className="p-navbar-inner-container">

        {/* LOGO AREA */}
        <div className="p-navbar-logo-wrapper">
          <Link to="/">
            <img
              src="/novaxcape/logo.png"
              alt="novaxcape"
              className="p-navbar-brand-logo"
            />
          </Link>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="p-navbar-navigation-links">
          <NavLink to="/" end className={({ isActive }) => `p-nav-item-link ${isActive ? "p-nav-active" : ""}`}>Home</NavLink>
          <NavLink to="/discover" className={({ isActive }) => `p-nav-item-link ${isActive ? "p-nav-active" : ""}`}>Discover</NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) => `p-nav-item-link ${isActive ? "p-nav-active" : ""}`}>My Bookings</NavLink>
          <NavLink to="/centres" className={({ isActive }) => `p-nav-item-link ${isActive ? "p-nav-active" : ""}`}>For Centres</NavLink>
          <NavLink to="/about" className={({ isActive }) => `p-nav-item-link ${isActive ? "p-nav-active" : ""}`}>About us</NavLink>
          <NavLink to="/support" className={({ isActive }) => `p-nav-item-link ${isActive ? "p-nav-active" : "p-nav-item-link-active"}`}>Support</NavLink>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="p-navbar-desktop-actions">
          <button className="p-navbar-action-btn" aria-label="Wishlist">
            <FiHeart size={24} strokeWidth={1.5} />
          </button>
          <button className="p-navbar-action-btn" aria-label="Profile">
            <FiUser size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="p-navbar-mobile-actions">
          <button className="p-navbar-action-btn" aria-label="Wishlist">
            <FiHeart size={22} strokeWidth={1.8} />
          </button>
          <button className="p-navbar-action-btn" aria-label="Profile">
            <FiUser size={22} strokeWidth={1.8} />
          </button>
          <button className="p-navbar-action-btn" aria-label="Menu">
            <FiMenu size={22} strokeWidth={1.8} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default PaymentHeader;