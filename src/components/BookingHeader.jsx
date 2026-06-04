import React from 'react';
import './css/BookingHeader.css';
import { FiHeart, FiUser } from 'react-icons/fi';

const BookingHeader = () => {
  return (
    <header className="booking-navbar-header">
      <div className="navbar-inner-container">
        
        <div className="navbar-logo-wrapper">
          <img src="/src/assets/logo.png" alt="novaxcape" className="navbar-brand-logo" />
        </div>

        <nav className="navbar-navigation-links">
          <a href="#home" className="nav-item-link">Home</a>
          <a href="#discover" className="nav-item-link">Discover</a>
          <a href="#bookings" className="nav-item-link active">My Bookings</a>
          <a href="#centres" className="nav-item-link">For Centres</a>
          <a href="#about" className="nav-item-link">About us</a>
          <a href="#support" className="nav-item-link">Support</a>
        </nav>

        <div className="navbar-actions-wrapper">
          <button className="navbar-action-btn" aria-label="Favorites">
            <FiHeart size={22} strokeWidth={1.8} />
          </button>
          <button className="navbar-action-btn" aria-label="Profile">
            <FiUser size={22} strokeWidth={1.8} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default BookingHeader;
