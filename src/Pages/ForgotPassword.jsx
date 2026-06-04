import React from "react";
import "../Styles/Login.css";
import Image from "../components/Image";

const ForgotPassword = () => {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        
        
        <div className="login-panel">
          <Image />
        </div>

     
        <div className="rightLogin-panel">
          <h2>Forgot Password?</h2>
          
          <p className="forgot-description">
            No worries! It happens.<br />
            Enter the Email address associated with your account to receive OTP code.
          </p>

          <form>
            <div className="form-group">
              <label>Enter your Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
              />
            </div>

            <button type="submit" className="signup-btn">
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;