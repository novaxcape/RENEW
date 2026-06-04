import React, { useState } from "react";
import "../Styles/Login.css";
import Image from "../components/Image";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        
    
        <div className="login-panel">
          <Image />
        </div>

  
        <div className="rightLogin-panel">
          <h2>Confirm OTP for Verification</h2>
          
          <p className="verify-description">
            Please enter the OTP sent to <strong>eberesunday688@gmail.com</strong> for confirmation
          </p>

          <div className="verify-email-text">Verify Your Email</div>

          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                className="otp-input"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
              />
            ))}
          </div>

          <div className="resend-timer">
            We'll resend OTP in <span className="timer">59s</span>
          </div>

          <button type="button" className="signup-btn verify-btn">
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;