import React from "react";
import "./css/BookingHeader.css";
import { FiHeart, FiUser, FiMenu } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";

const BookingHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="booking-navbar-header">
      <div className="navbar-inner-container">
        <div className="navbar-logo-wrapper">
          <Link to="/">
            <img
              src="/novaxcape/logo.png"
              alt="novaxcape"
              className="navbar-brand-logo"
            />
          </Link>
        </div>

        <nav className="navbar-navigation-links">
          <Link to="/" className="nav-item-link">Home</Link>
          <Link to="/discover" className="nav-item-link">Discover</Link>
          <Link to="/bookings" className="nav-item-link active">My Bookings</Link>
          <Link to="/for-centres" className="nav-item-link">For Centres</Link>
          <Link to="/about" className="nav-item-link">About us</Link>
          <Link to="/support" className="nav-item-link">Support</Link>
        </nav>

        <div className="navbar-actions-wrapper">
          <button className="navbar-action-btn" aria-label="Favorites">
            <FiHeart size={22} strokeWidth={1.8} />
          </button>
          <button 
            className="navbar-action-btn" 
            aria-label="Profile" 
            onClick={() => navigate('/profile-settings')}
          >
            <FiUser size={22} strokeWidth={1.8} />
          </button>
          
          <button className="navbar-hamburger-btn" aria-label="Menu">
            <FiMenu size={22} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default BookingHeader;