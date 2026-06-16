import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import "./css/PaymentHeader.css"; 
import "./css/Header.css"
import { FiUser, FiHeart, FiMenu, FiLogOut, FiSettings } from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const navLinks = [
    { name: "Home", to: "/", end: true, requiresAuth: false },
    { name: "Discover", to: "/discover", requiresAuth: false },
    { name: "For Centres", to: "/centres", requiresAuth: false },
    { name: "About us", to: "/about", requiresAuth: false },
    { name: "Support", to: "/support", requiresAuth: false },
  ];

  const visibleLinks = navLinks.filter(link => !link.requiresAuth || isLoggedIn);

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
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
   <header className="payment-navbar-header">
  <div className="p-navbar-inner-container">

    {/* Logo */}
    <div className="p-navbar-logo-wrapper">
      <Link to="/">
        <img
          src="/novaxcape/logo.png"
          alt="novaxcape"
          className="p-navbar-brand-logo"
        />
      </Link>
    </div>

    {/* Center Navigation */}
    <nav className="p-navbar-navigation-links">
      {visibleLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `p-nav-item-link ${isActive ? "p-nav-active" : ""}`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </nav>

    {/* Right Buttons */}
    {!isLoggedIn && (
      <div className="p-desktop-auth-buttons">
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
      </div>
    )}

  </div>
</header>
  );
};

export default Header;