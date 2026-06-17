import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import "./css/Header.css";
import {
  FiUser,
  FiMenu,
  FiLogOut,
  FiSettings,
  FiX,
  FiHeart,
} from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const navLinks = [
    { name: "Home", to: "/", end: true },
    { name: "Discover", to: "/discover" },
    { name: "For Centres", to: "/centres" },
    { name: "About us", to: "/about" },
    { name: "Support", to: "/support" },
  ];

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }

      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setAuthDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  // Handle navigation and close menu
  const handleNavClick = (to) => {
    setMobileMenuOpen(false);
    navigate(to);
  };

  return (
    <>
      <header className="payment-navbar-header m-header">
        <div className="p-navbar-inner-container m-header-body">

          {/* Logo */}
          <div className="p-navbar-logo-wrapper m-logo">
            <Link to="/">
              <img
                src="/novaxcape/logo.png"
                alt="novaxcape"
                className="p-navbar-brand-logo m-header-logo-img"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="p-navbar-navigation-links m-link">
            <ul>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `p-nav-item-link ${
                        isActive ? "p-nav-active m-active-link" : ""
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Buttons */}
          <div className="m-button m-desktop-buttons">
            {!isLoggedIn ? (
              <>
                <Link to="/signupscreen">
                  <button className="m-signup-btn">
                    Sign Up
                  </button>
                </Link>

                <Link to="/signinscreen">
                  <button className="m-signin-btn">
                    Sign In
                  </button>
                </Link>
              </>
            ) : (
              <div className="p-user-actions-wrapper">
                {/* Wishlist Heart Icon */}
                <Link to="/WishList" className="p-wishlist-link">
                  <FiHeart size={22} className="p-wishlist-icon" />
                </Link>

                {/* User Profile Dropdown */}
                <div
                  className="p-users-menu-container"
                  ref={dropdownRef}
                >
                  <button
                    className="p-navbars-action-btn"
                    onClick={toggleDropdown}
                  >
                    <FiUser size={22} />
                  </button>

                  {dropdownOpen && (
                    <div className="p-profiles-dropdown-menu">
                      <Link
                        to="/profile-settings"
                        className="p-dropdown-item"
                      >
                        <FiSettings size={16} />
                        Profile Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="p-dropdown-item"
                      >
                        <FiLogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu - Visible for both logged in and logged out */}
          <div
            className="m-mobile-menu-wrapper"
            ref={mobileMenuRef}
          >
            {/* Mobile Icons (Love + User) - Only when logged in */}
            {isLoggedIn && (
              <div className="m-mobile-user-actions">
                <Link to="/WishList" className="m-mobile-wishlist-link">
                  <FiHeart size={22} />
                </Link>
                <Link to="/profile-settings" className="m-mobile-profile-link">
                  <FiUser size={22} />
                </Link>
              </div>
            )}

            {/* Hamburger Button */}
            <button
              className="m-hamburger"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX size={26} />
              ) : (
                <FiMenu size={26} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu - Rendered outside header to avoid z-index issues */}
      {mobileMenuOpen && (
        <div className="m-mobile-dropdown-overlay">
          <div className="m-mobile-dropdown">
            {/* Navigation Links */}
            <div className="m-mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="m-mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Auth Actions - Only when NOT logged in */}
            {!isLoggedIn && (
              <div className="m-mobile-auth-actions">
                <Link
                  to="/signupscreen"
                  className="m-mobile-auth-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  to="/signinscreen"
                  className="m-mobile-auth-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Logout - Only when logged in */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="m-mobile-logout-btn"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Old Auth Dropdown - Keep for backward compatibility */}
      {!isLoggedIn && authDropdownOpen && (
        <div className="m-auth-dropdown">
          <Link
            to="/signupscreen"
            className="m-auth-dropdown-item"
            onClick={() => setAuthDropdownOpen(false)}
          >
            Sign Up
          </Link>
          <Link
            to="/signinscreen"
            className="m-auth-dropdown-item"
            onClick={() => setAuthDropdownOpen(false)}
          >
            Sign In
          </Link>
        </div>
      )}
    </>
  );
};

export default Header;