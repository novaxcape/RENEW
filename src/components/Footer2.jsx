
import React from 'react';

const Footer2 = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <span className="logo-mark">N</span> NovaXcape
          </div>
          <p>Your trusted platform for discovering and booking amazing tourism experiences across Nigeria.</p>
          <div className="social-icons">
            <span className="social-circle">f</span>
            <span className="social-circle">x</span>
            <span className="social-circle">in</span>
          </div>
        </div>
        
        <div className="footer-col">
          <h4>For Tourist</h4>
          <ul>
            <li>Discover Attractions</li>
            <li>My Bookings</li>
            <li>Payment Options</li>
            <li>Help & Support</li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>For Tourism Centres</h4>
          <ul>
            <li>List your Centre</li>
            <li>Dashboard</li>
            <li>Pricing</li>
            <li>Resources</li>
          </ul>
        </div>
        
        <div className="footer-col newsletter-col">
          <h4>Subscribe</h4>
          <p>Sign up to be the first to know about exclusive deals.</p>
          <div className="newsletter-input">
            <input type="text" placeholder="Example@gmail.com" />
            <button className="btn-subscribe">Submit</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 NovaXcape All right reserved.
      </div>
    </footer>
  );
};

export default Footer2;