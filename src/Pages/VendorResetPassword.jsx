// Pages/Vendor/VendorResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { setLoading, setError, clearError } from '../redox/authSlice';
import "../Styles/SignUpVendor.css"

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const VendorResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading: reduxLoading } = useSelector((state) => state.auth);
  const email = location.state?.email || "";
  
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || !password || !confirmPassword) {
      setErrorState("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorState("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setErrorState("Password must be at least 6 characters");
      return;
    }
    
    setLoadingState(true);
    setErrorState("");
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await axios.post(`${API_BASE_URL}/vendor/reset-password`, {
        email,
        otp,
        newPassword: password
      });
      
      console.log("Reset password response:", response.data);
      
      Swal.fire({
        icon: "success",
        title: "Password Reset Successful!",
        text: "Please login with your new password.",
        confirmButtonColor: "#ff6b35",
      });
      
      navigate("/vendor/login");
      
    } catch (error) {
      console.error("Reset password error:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to reset password";
      setErrorState(errorMessage);
      dispatch(setError(errorMessage));
      
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
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
          <img src="/novaxcape/img.png" alt="Reset Password" />
        </div>
        <div className="rightLogin-panel">
          <h2>Reset Password</h2>
          <p>Enter the OTP and your new password.</p>
          
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
              <label>OTP Code</label>
              <input 
                type="text" 
                placeholder="Enter OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                disabled={loading || reduxLoading}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || reduxLoading}
                  required
                  style={{ width: "100%", paddingRight: "40px" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: "absolute", 
                    right: "12px", 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            
            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                disabled={loading || reduxLoading}
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="signup-btn" 
              disabled={loading || reduxLoading}
              style={{ opacity: (loading || reduxLoading) ? 0.7 : 1 }}
            >
              {loading || reduxLoading ? "Resetting..." : "Reset Password"}
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

export default VendorResetPassword;