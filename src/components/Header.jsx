import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./css/Header.css";
import {
  FiUser,
  FiMenu,
  FiLogOut,
  FiSettings,
  FiX,
  FiHeart,
} from "react-icons/fi";
import { logout } from "../redox/authSlice";
import { logoutClient, logoutVendor } from "../redox/apiSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Redux Persist authentication state
  const isLoggedIn = useSelector(
    (state) => state.auth.isAuthenticated
  );
  
  const isVendor = useSelector(
    (state) => state.auth.isVendor
  );

  // Navigation Links
  const navLinks = [
    { name: "Home", to: "/", end: true },
    { name: "Discover", to: "/discover" },

    ...(isLoggedIn
      ? [{ name: "My Bookings", to: "/my-bookings" }]
      : []),

    ...(!isLoggedIn
      ? [{ name: "For Centres", to: "/centres" }]
      : []),

    { name: "About us", to: "/about" },
    { name: "Support", to: "/support" },
  ];

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
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
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest("a") &&
        !event.target.closest("button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    // Prevent multiple logout clicks
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);

    try {
      // 1. Call the appropriate logout endpoint based on user type
      if (isVendor) {
        // Call vendor logout API
        const result = await dispatch(logoutVendor()).unwrap();
        console.log("✅ Vendor server logout successful:", result);
      } else {
        // Call client logout API
        const result = await dispatch(logoutClient()).unwrap();
        console.log("✅ Client server logout successful:", result);
      }
    } catch (error) {
      // Even if the API call fails (e.g., token expired), proceed with local logout
      console.warn("⚠️ Server logout failed, proceeding with local logout:", error);
    }

    // 2. Dispatch the local logout action (clears Redux state and localStorage)
    dispatch(logout());

    // 3. Close any open menus
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setIsLoggingOut(false);

    // 4. Redirect to home
    navigate("/");
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
                
                {/* Wishlist */}
                <Link
                  to="/WishList"
                  className="p-wishlist-link"
                >
                  <FiHeart
                    size={22}
                    className="p-wishlist-icon"
                  />
                </Link>

                {/* User Dropdown */}
                <div
                  className="p-users-menu-container"
                  ref={dropdownRef}
                >
                  <button
                    className="p-navbars-action-btn"
                    onClick={toggleDropdown}
                    aria-label="User menu"
                  >
                    <FiUser size={22} />
                  </button>

                  {dropdownOpen && (
                    <div className="p-profiles-dropdown-menu">
                      
                      <Link
                        to="/profile-settings"
                        className="p-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiSettings size={16} />
                        Profile Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="p-dropdown-item"
                        disabled={isLoggingOut}
                      >
                        <FiLogOut size={16} />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>

                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div
            className="m-mobile-menu-wrapper"
            ref={mobileMenuRef}
          >
            {isLoggedIn && (
              <div className="m-mobile-user-actions">
                
                <Link
                  to="/WishList"
                  className="m-mobile-wishlist-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiHeart size={22} />
                </Link>

                <Link
                  to="/profile-settings"
                  className="m-mobile-profile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser size={22} />
                </Link>

              </div>
            )}

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

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="m-mobile-dropdown-overlay">
          <div className="m-mobile-dropdown">

            <div className="m-mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="m-mobile-nav-link"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {!isLoggedIn && (
              <div className="m-mobile-auth-actions">
                <Link
                  to="/signupscreen"
                  className="m-mobile-auth-link"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                >
                  Sign Up
                </Link>

                <Link
                  to="/signinscreen"
                  className="m-mobile-auth-link"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                >
                  Sign In
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="m-mobile-logout-btn"
                disabled={isLoggingOut}
              >
                <FiLogOut size={18} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;