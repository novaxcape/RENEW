import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
// ⚠️ DOUBLE CHECK THIS PATH: Make sure it points exactly to your CSS file!
import "./css/PaymentHeader.css"; 
import { FiUser, FiHeart, FiMenu, FiLogOut, FiSettings } from "react-icons/fi";

const PaymentHeader = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const closeDropdownOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", closeDropdownOutside);
    return () => document.removeEventListener("click", closeDropdownOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setDropdownOpen(false);
    navigate("/");
    window.location.reload();
  };

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
          <NavLink to="/support" className={({ isActive }) => `p-nav-item-link ${isActive ? "p-nav-active" : ""}`}>Support</NavLink>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="p-navbar-desktop-actions">
          <button className="p-navbar-action-btn" aria-label="Wishlist" onClick={() => navigate('/wishlist')}>
            <FiHeart size={24} strokeWidth={1.5} />
          </button>
          
          <div className="p-user-menu-container" ref={dropdownRef}>
            <button className="p-navbar-action-btn" aria-label="Profile" onClick={toggleDropdown}>
              <FiUser size={24} strokeWidth={1.5} />
            </button>

            {dropdownOpen && (
              <div className="p-profile-dropdown-menu">
                <button onClick={() => { navigate('/profile-settings'); setDropdownOpen(false); }}>
                  <FiSettings size={16} /> Profile Settings
                </button>
                <hr className="p-dropdown-divider" />
                <button onClick={handleLogout} className="p-dropdown-logout-btn">
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="p-navbar-mobile-actions">
          <button className="p-navbar-action-btn" aria-label="Wishlist" onClick={() => navigate("/wishlist")}> 
            <FiHeart size={22} strokeWidth={1.8} />
          </button>
          
          <div className="p-user-menu-container">
            <button className="p-navbar-action-btn" aria-label="Profile" onClick={toggleDropdown}>
              <FiUser size={22} strokeWidth={1.8} />
            </button>

            {dropdownOpen && (
              <div className="p-profile-dropdown-menu mobile-dropdown-adjust">
                <button onClick={() => { navigate('/profile-settings'); setDropdownOpen(false); }}>
                  <FiSettings size={16} /> Profile
                </button>
                <hr className="p-dropdown-divider" />
                <button onClick={handleLogout} className="p-dropdown-logout-btn">
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          <button className="p-navbar-action-btn" aria-label="Menu">
            <FiMenu size={22} strokeWidth={1.8} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default PaymentHeader;