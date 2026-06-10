// Pages/Vendor/VendorForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { setLoading, setError, clearError } from '../redox/authSlice';
import "../Styles/SignUpVendor.css"

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const VendorForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: reduxLoading } = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState("");
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setErrorState("Please enter your email");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorState("Please enter a valid email address");
      return;
    }
    
    setLoadingState(true);
    setErrorState("");
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await axios.post(`${API_BASE_URL}/vendor/forget-password`, { email });
      
      console.log("Forgot password response:", response.data);
      
      Swal.fire({
        icon: "success",
        title: "OTP Sent!",
        text: "A password reset OTP has been sent to your email.",
        confirmButtonColor: "#ff6b35",
      });
      
      navigate("/vendor/reset-password", { state: { email } });
      
    } catch (error) {
      console.error("Forgot password error:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to send reset email";
      setErrorState(errorMessage);
      dispatch(setError(errorMessage));
      
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: errorMessage,
        confirmButtonColor: "#ff6b35",
      });
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-panel">
          <img src="/novaxcape/img.png" alt="Forgot Password" />
        </div>
        <div className="rightLogin-panel">
          <h2>Forgot Password?</h2>
          <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
            Enter your email to receive a password reset OTP.
          </p>
          
          {error && (
            <div className="error-message" style={{ 
              color: "red", 
              textAlign: "center", 
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "#fee2e2",
              borderRadius: "8px"
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={loading || reduxLoading}
                required 
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "25px",
                  fontSize: "1rem"
                }}
              />
            </div>
            
            <button 
              type="submit" 
              className="signup-btn" 
              disabled={loading || reduxLoading}
              style={{ opacity: (loading || reduxLoading) ? 0.7 : 1 }}
            >
              {loading || reduxLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
          
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/vendor/login" style={{ color: "#ff6b35", textDecoration: "none" }}>Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorForgotPassword;