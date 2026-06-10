import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { verifyAdmin, verifyAdminSuccess, verifyAdminFail, clearError } from "../redox/authSlice";
import "../Styles/Login.css";
import Image from "../components/Image";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);

  const name = localStorage.getItem("Name");
  const email = name; // The email stored in localStorage

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

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

  const handleVerify = async () => {
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: "Please enter the 6-digit verification code.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }
    
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Email not found. Please sign up again.",
        confirmButtonColor: "#ff6b35",
      });
      navigate("/signup");
      return;
    }
    
    dispatch(verifyAdmin());
    dispatch(clearError());
    
    try {
      // API CALL TO VERIFY EMAIL
      const response = await axios.post(`${API_BASE_URL}/client/verify-email`, {
        email: email,
        otp: otpCode
      });
      
      console.log("Verification response:", response.data);
      
      dispatch(verifyAdminSuccess());
      
      Swal.fire({
        icon: "success",
        title: "Verification Successful!",
        text: "Your email has been verified. Please login to continue.",
        confirmButtonColor: "#ff6b35",
      });
      
      // Navigate to login page after verification
      navigate("/signin");
      
    } catch (error) {
      console.error("Verification error:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again.";
      dispatch(verifyAdminFail(errorMessage));
      
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: errorMessage,
        confirmButtonColor: "#ff6b35",
      });
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) {
      Swal.fire({
        icon: "info",
        title: "Please Wait",
        text: `Please wait ${timer} seconds before requesting another OTP.`,
        confirmButtonColor: "#ff6b35",
      });
      return;
    }
    
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Email not found. Please sign up again.",
        confirmButtonColor: "#ff6b35",
      });
      navigate("/signup");
      return;
    }
    
    dispatch(verifyAdmin());
    dispatch(clearError());
    
    try {
      // API CALL TO RESEND OTP
      const response = await axios.post(`${API_BASE_URL}/client/resend-otp`, {
        email: email
      });
      
      console.log("Resend response:", response.data);
      
      Swal.fire({
        icon: "success",
        title: "OTP Resent!",
        text: "A new verification code has been sent to your email.",
        confirmButtonColor: "#ff6b35",
      });
      
      // Reset timer and OTP inputs
      setTimer(59);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      
      // Focus on first input
      document.getElementById("otp-0")?.focus();
      
    } catch (error) {
      console.error("Resend error:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      
      Swal.fire({
        icon: "error",
        title: "Resend Failed",
        text: errorMessage,
        confirmButtonColor: "#ff6b35",
      });
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
            Please enter the OTP sent to <strong>{name || "your email"}</strong> for confirmation
          </p>

          <div className="verify-email-text">Verify Your Email</div>

          {error && (
            <div className="error-message" style={{
              color: "red",
              textAlign: "center",
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "#ffeeee",
              borderRadius: "5px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

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
                disabled={loading}
              />
            ))}
          </div>

          <div className="resend-timer">
            We'll resend OTP in <span className="timer" style={{ color: timer < 10 ? "red" : "#333" }}>{timer}s</span>
          </div>

          <button 
            type="button" 
            className="signup-btn verify-btn" 
            onClick={handleVerify}
            disabled={loading || otp.join("").length !== 6}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          {canResend && (
            <button 
              type="button" 
              className="resend-btn" 
              onClick={handleResendOTP}
              style={{
                background: "none",
                border: "none",
                color: "#ff6b35",
                cursor: "pointer",
                marginTop: "15px",
                textDecoration: "underline"
              }}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;