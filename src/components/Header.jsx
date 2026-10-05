import React from "react";
import { Link } from "react-router-dom";
import "./css/Header.css";
import { FiMenu } from "react-icons/fi";

const Header = () => {
  return (
    <header className="payment-navbar-header m-header">
      <div className="p-navbar-inner-container m-header-body">
        <div className="p-navbar-logo-wrapper m-logo">
          <Link to="/">
            <img
              src="/novaxcape/logo.png"
              alt="novaxcape"
              className="p-navbar-brand-logo m-header-logo-img"
            />
          </Link>
        </div>

        <nav className="p-navbar-navigation-links m-link">
          <ul>
            <li>
              <Link to="/" className="p-nav-item-link p-nav-active m-active-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/discover" className="p-nav-item-link">
                Discover
              </Link>
            </li>
            <li>
              <Link to="/centres" className="p-nav-item-link">
                For Centres
              </Link>
            </li>
            <li>
              <Link to="/about" className="p-nav-item-link">
                About us
              </Link>
            </li>
            <li>
              <Link to="/support" className="p-nav-item-link">
                Support
              </Link>
            </li>
          </ul>
        </nav>

        <div className="m-button m-desktop-buttons">
          <Link to="/signupscreen">
            <button className="m-signup-btn">Sign Up</button>
          </Link>

          <Link to="/signinscreen">
            <button className="m-signin-btn">Sign In</button>
          </Link>
        </div>

        <div className="m-mobile-menu-wrapper">
          <button className="m-hamburger" aria-label="Toggle menu">
            <FiMenu size={26} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
