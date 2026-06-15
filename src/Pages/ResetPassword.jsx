import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import "../Styles/Login.css";
import Image from "../components/Image";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state (passed from ForgotPassword)
  const email = location.state?.email || "";
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { password, confirmPassword } = formData;
    
    // Validation
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (!email) {
      setError("Email is missing. Please go back and try again.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // API CALL to reset password - matches the API spec
      const response = await axios.post(`${API_BASE_URL}/client/reset-password`, {
        email: email,
        password: password,  // The API expects 'password', not 'newPassword'
      });
      
      console.log("Reset password response:", response.data);
      
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Password reset successful! Please login with your new password.",
        confirmButtonColor: "#ff6b35",
      }).then(() => {
        navigate("/signin");
      });
      
    } catch (error) {
      console.error("Reset password error:", error.response?.data);
      
      // Handle specific error codes
      if (error.response?.status === 404) {
        setError("Invalid credential. The link may have expired or email is incorrect.");
        Swal.fire({
          icon: "error",
          title: "Invalid Request",
          text: "Invalid credential. Please request a new password reset.",
          confirmButtonColor: "#ff6b35",
        }).then(() => {
          navigate("/forgot-password");
        });
      } else {
        const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
        setError(errorMessage);
        Swal.fire({
          icon: "error",
          title: "Reset Failed",
          text: errorMessage,
          confirmButtonColor: "#ff6b35",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // If no email, show error and redirect option
  if (!email) {
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-panel">
            <Image />
          </div>
          <div className="rightLogin-panel">
            <h2>Reset Password</h2>
            <div className="error-message" style={{
              color: "red",
              textAlign: "center",
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "#ffeeee",
              borderRadius: "5px"
            }}>
              Invalid request. Email is missing. Please go back and try again.
            </div>
            <button 
              onClick={() => navigate("/forgot-password")} 
              className="signup-btn"
            >
              Go to Forgot Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-panel">
          <Image />
        </div>

        <div className="rightLogin-panel">
          <h2>Create new password</h2>

          <p className="reset-description">
            Enter your new password twice below to reset your password.
            <br />
            Your password must be at least 6 characters.
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
              <label>New Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Input new password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              className="signup-btn" 
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;