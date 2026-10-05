import React from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import "../Styles/VendorLogin.css";

const VendorLogin = () => {
  return (
    <div className="vendor-login-wrapper">
      <div className="login-container">
        <div className="login-panel">
          <img src="/novaxcape/img.png" alt="Vendor Login" />
        </div>
        <div className="rightLogin-panel">
          <h2>Vendor Login</h2>

          <form className="vendor-login-form">
            <div className="vendor-login-field">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter your email" />
            </div>

            <div className="vendor-login-field">
              <label>Password</label>
              <div className="vendor-login-password">
                <input type="password" name="password" placeholder="Enter your password" />
                <span className="vendor-login-eye">
                  <FaEye />
                </span>
              </div>
            </div>

            <div className="forgot-password-row">
              <Link to="/vendor/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="button" className="signup-btn">Login</button>
          </form>

          <p className="signin-text">
            Don't have a vendor account? <Link to="/signupvendor">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
