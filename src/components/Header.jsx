import React, { useState } from "react";
import "../components/css/Header.css";
import { FaHeart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = menuOpen ? "auto" : "hidden";
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="m-header">
        <div className="m-header-body">
          {/* LOGO */}
          <div className="m-logo">
            <Link to="/" onClick={closeMenu}>
              <img
                src="/novaxcape/logo.png"
                alt="Novaxcape"
                className="m-header-logo-img"
              />
            </Link>
          </div>

          {/* NAV LINKS - Desktop */}
          <div className="m-link m-desktop-links">
            <ul>
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => (isActive ? "m-active-link" : "")}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/discover"
                  className={({ isActive }) => (isActive ? "m-active-link" : "")}
                >
                  Discover
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/centres"
                  className={({ isActive }) => (isActive ? "m-active-link" : "")}
                >
                  ForCenter
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? "m-active-link" : "")}
                >
                  About us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/support"
                  className={({ isActive }) => (isActive ? "m-active-link" : "")}
                >
                  Support
                </NavLink>
              </li>
            </ul>
          </div>

          {/* RIGHT SIDE / ACTION BUTTONS */}
          <div className="m-button">
            {/* MOBILE ICONS */}
            <div className="m-mobile-icons">
              <FaHeart />
              <FaUser />
              <FaBars className="m-hamburger" onClick={toggleMenu} />
            </div>

            {/* DESKTOP BUTTONS */}
            <div className="m-desktop-buttons">
              <Link to="/loginscreen">
                <button className="m-signin-btn">Sign In</button>
              </Link>
              <Link to="/signupscreen">
                <button className="m-signup-btn">Sign Up</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE OVERLAY MENU ===== */}
      <div className={`m-mobile-overlay ${menuOpen ? "m-active" : ""}`}>
        <div className="m-overlay-header">
          <div className="m-overlay-logo">
            <img src="/novaxcape/logo.png" alt="Novaxcape" />
          </div>
          <button className="m-close-btn" onClick={toggleMenu}>
            <FaTimes />
          </button>
        </div>

        <div className="m-overlay-links">
          <ul>
            <li>
              <NavLink to="/" onClick={closeMenu} end className={({ isActive }) => (isActive ? "m-active-link" : "")}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/discover" onClick={closeMenu} className={({ isActive }) => (isActive ? "m-active-link" : "")}>
                Discover
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-bookings" onClick={closeMenu} className={({ isActive }) => (isActive ? "m-active-link" : "")}>
                My Bookings
              </NavLink>
            </li>
            <li>
              <NavLink to="/centres" onClick={closeMenu} className={({ isActive }) => (isActive ? "m-active-link" : "")}>
                For Centres
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => (isActive ? "m-active-link" : "")}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/support" onClick={closeMenu} className={({ isActive }) => (isActive ? "m-active-link" : "")}>
                Support
              </NavLink>
            </li>
            
            {/* MOBILE AUTH LINKS */}
            <li className="m-mobile-auth-links">
              <NavLink to="/signup" onClick={closeMenu} className="m-mobile-signup">
                Sign Up
              </NavLink>
              <NavLink to="/Login" onClick={closeMenu} className="m-mobile-signin">
                Sign In
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;