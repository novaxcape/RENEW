import React, { useState } from "react";
import "../components/css/Header.css";
import { FaHeart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = menuOpen ? "auto" : "hidden";
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="header">
        <div className="header-body">
          {/* LOGO */}
          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <img
                src="/novaxcape/logo.png"
                alt="Novaxcape"
                className="header-logo-img"
              />
            </Link>
          </div>

          {/* NAV LINKS - Desktop */}
          <div className="link desktop-links">
            <ul>
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/discover"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Discover
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/centres"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  ForCenter
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  About us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/support"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Support
                </NavLink>
              </li>
            </ul>
          </div>

          {/* RIGHT SIDE */}
          <div className="button">
            {/* MOBILE ICONS */}
            <div className="mobile-icons">
              <FaHeart />
              <FaUser />
              <FaBars className="hamburger" onClick={toggleMenu} />
            </div>

            {/* DESKTOP BUTTON */}
            <Link to="/signup">
              <button className="signin">Sign Up</button>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== MOBILE OVERLAY MENU ===== */}
      <div className={`mobile-overlay ${menuOpen ? "active" : ""}`}>
        <div className="overlay-header">
          <div className="overlay-logo">
            <img src="/novaxcape/logo.png" alt="Novaxcape" />
          </div>
          <button className="close-btn" onClick={toggleMenu}>
            <FaTimes />
          </button>
        </div>

        <div className="overlay-links">
          <ul>
            <li>
              <NavLink to="/" onClick={closeMenu} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/discover" onClick={closeMenu}>
                Discover
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-bookings" onClick={closeMenu}>
                My Bookings
              </NavLink>
            </li>
            <li>
              <NavLink to="/centres" onClick={closeMenu}>
                For Centres
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={closeMenu}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/support" onClick={closeMenu}>
                Support
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" onClick={closeMenu}>
                Sign Up
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;