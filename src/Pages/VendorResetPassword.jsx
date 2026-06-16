// Pages/Vendor/VendorResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { setLoading, setError, clearError } from '../redox/authSlice';
import "../Styles/SignUpVendor.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const VendorResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading: reduxLoading } = useSelector((state) => state.auth);
  
  // Get email from location state (passed from forgot password)
  const email = location.state?.email || "";
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Check if email exists, if not redirect
  useEffect(() => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email first",
        confirmButtonColor: "#ff6b35",
      });
      navigate("/vendor/forgot-password");
    }
  }, [email, navigate]);

  // Check password strength
  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const validateForm = () => {
    if (password.length < 8) {
      setErrorState("Password must be at least 8 characters long");
      return false;
    }
    
    if (password !== confirmPassword) {
      setErrorState("Passwords do not match");
      return false;
    }
    
    const allValid = Object.values(passwordStrength).every(val => val === true);
    if (!allValid) {
      setErrorState("Password does not meet all security requirements");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoadingState(true);
    setErrorState("");
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      // API expects only email and password (no OTP)
      const payload = {
        email: email,
        password: password
      };
      
      console.log("🔄 Sending reset password request:", { 
        email: payload.email,
        password: "****" // Hide password in logs
      });
      
      const response = await axios.post(`${API_BASE_URL}/vendor/reset-password`, payload);
      
      console.log("✅ Reset password response:", response.data);
      
      setSuccess(true);
      
      Swal.fire({
        icon: "success",
        title: "Password Reset Successful!",
        text: "Your password has been reset. Please login with your new password.",
        confirmButtonColor: "#ff6b35",
        timer: 3000,
        timerProgressBar: true,
      });
      
      // Navigate to login after 3 seconds
      setTimeout(() => {
        navigate("/vendor/login", { 
          state: { message: "Password reset successful! Please login with your new password." }
        });
      }, 3000);
      
    } catch (error) {
      console.error("❌ Reset password error:", error.response?.data);
      
      // Handle different error scenarios
      let errorMessage = "Failed to reset password. Please try again.";
      
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 404) {
          errorMessage = "Invalid credentials. Please check your email or request a new reset link.";
        } else if (error.response.status === 400) {
          errorMessage = "Invalid password format. Please check the requirements.";
        } else if (error.response.status === 429) {
          errorMessage = "Too many attempts. Please wait before trying again.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
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

  const getPasswordStrengthLevel = () => {
    const validCount = Object.values(passwordStrength).filter(v => v).length;
    if (validCount <= 2) return { text: "Weak", color: "#ef4444", width: "20%" };
    if (validCount <= 3) return { text: "Fair", color: "#f59e0b", width: "40%" };
    if (validCount <= 4) return { text: "Good", color: "#22c55e", width: "70%" };
    return { text: "Strong", color: "#22c55e", width: "100%" };
  };

  // If success, show success message
  if (success) {
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-panel">
            <img src="/novaxcape/img.png" alt="Success" />
          </div>
          <div className="rightLogin-panel" style={{ textAlign: "center" }}>
            <FaCheckCircle size={80} color="#22c55e" />
            <h2 style={{ marginTop: "20px" }}>Password Reset Successfully!</h2>
            <p style={{ color: "#666", marginTop: "10px" }}>
              Your password has been reset. Redirecting to login...
            </p>
            <Link to="/vendor/login" style={{ color: "#ff6b35", textDecoration: "none", display: "inline-block", marginTop: "20px" }}>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-panel">
          <img src="/novaxcape/img.png" alt="Reset Password" />
        </div>
        <div className="rightLogin-panel">
          <h2>Reset Password</h2>
          <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
            Create a new password for <strong>{email}</strong>
          </p>
          
          {error && (
            <div className="error-message" style={{ 
              color: "red", 
              textAlign: "center", 
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "#fee2e2",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}>
              <FaTimesCircle />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="form-group">
              <label>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || reduxLoading}
                  required
                  style={{ 
                    width: "100%", 
                    paddingRight: "40px",
                    borderColor: password && passwordStrength.length ? "#22c55e" : undefined
                  }}
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ 
                    height: "4px", 
                    background: "#e0e0e0", 
                    borderRadius: "2px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      height: "100%",
                      width: getPasswordStrengthLevel().width,
                      background: getPasswordStrengthLevel().color,
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    marginTop: "4px",
                    color: "#666"
                  }}>
                    <span>Password Strength:</span>
                    <span style={{ color: getPasswordStrengthLevel().color, fontWeight: "600" }}>
                      {getPasswordStrengthLevel().text}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading || reduxLoading}
                  required
                  style={{ 
                    width: "100%", 
                    paddingRight: "40px",
                    borderColor: confirmPassword && password && confirmPassword === password ? "#22c55e" : 
                               confirmPassword && password && confirmPassword !== password ? "#ef4444" : undefined
                  }}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ 
                    position: "absolute", 
                    right: "12px", 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {confirmPassword && password && confirmPassword !== password && (
                <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>
                  <FaTimesCircle style={{ display: "inline", marginRight: "4px" }} />
                  Passwords do not match
                </p>
              )}
              {confirmPassword && password && confirmPassword === password && (
                <p style={{ color: "#22c55e", fontSize: "0.8rem", marginTop: "4px" }}>
                  <FaCheckCircle style={{ display: "inline", marginRight: "4px" }} />
                  Passwords match
                </p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="signup-btn" 
              disabled={loading || reduxLoading}
              style={{ opacity: (loading || reduxLoading) ? 0.7 : 1 }}
            >
              {loading || reduxLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
          
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/vendor/login" style={{ color: "#ff6b35", textDecoration: "none" }}>
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorResetPassword;