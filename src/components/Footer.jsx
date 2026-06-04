import React from 'react';
import './css/Footer.css';
import { FaLinkedinIn, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        <div className="footer-brand-section">
          <div className="footer-logo-wrapper">
            <img src="/src/assets/logo.png" alt="Novaxcape" className="footer-logo-img" />
          </div>
          <p className="footer-description">
            Your trusted platform for discovering and booking amazing tourism experiences across Nigeria. Book instantly, enjoy stress-free!
          </p>
          <div className="footer-social-row">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social-link">
              <FaLinkedinIn />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="footer-social-link">
              <FaXTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-link">
              <FaInstagram />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="footer-social-link">
              <FaTiktok />
            </a>
          </div>
          <div className="footer-nav-block centres-block">
            <h4 className="footer-column-heading">For Tourism Centres</h4>
            <ul className="footer-links-list">
              <li><a href="/list-centre">List your Centre</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/resources">Resources</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-links-section">
          <div className="footer-nav-block">
            <h4 className="footer-column-heading">For Tourist</h4>
            <ul className="footer-links-list">
              <li><a href="/discover">Discover Attractions</a></li>
              <li><a href="/bookings">My Bookings</a></li>
              <li><a href="/payment">Payment Options</a></li>
              <li><a href="/support">Help & Support</a></li>
            </ul>
          </div>
          <div className="footer-nav-block help-block">
            <h4 className="footer-column-heading">Help</h4>
            <ul className="footer-links-list">
              <li><a href="/refund-policy">Refund & Return Policy</a></li>
              <li><a href="/terms">Terms & Condition</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-subscribe-section">
          <h4 className="footer-column-heading">Subscribe</h4>
          <p className="footer-subscribe-text">
            SignUp to be the first to know about exclusive deals,Special discount and newly added  <br />attractions
          </p>
          <form className="footer-subscribe-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Example@gmail.com" 
              className="footer-subscribe-input" 
              required 
            />
            <button type="submit" className="footer-subscribe-button">
              Submit
            </button>
          </form>
        </div>

      </div>

      <div className="footer-copyright-bar">
        <p className="footer-copyright-text">© 2026 NovaXcape.All right reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
