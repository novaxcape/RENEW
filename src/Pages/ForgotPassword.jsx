import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "../Styles/Login.css";
import Image from "../components/Image";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // API CALL to send OTP
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email: email,
      });
      
      console.log("Forgot password response:", response.data);
      
      Swal.fire({
        icon: "success",
        title: "OTP Sent!",
        text: "A verification code has been sent to your email.",
        confirmButtonColor: "#ff6b35",
      });
      
      // Navigate to verification code page with email
      navigate("/verify-email", { state: { email: email, type: "reset" } });
      
    } catch (error) {
      console.error("Forgot password error:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: errorMessage,
        confirmButtonColor: "#ff6b35",
      });
    } finally {
      setLoading(false);
    }
  };

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

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Enter your Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={handleChange}
                disabled={loading}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "16px"
                }}
              />
            </div>

            <button 
              type="submit" 
              className="signup-btn" 
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Sending..." : "Next"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;