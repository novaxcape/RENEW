// Pages/Vendor/VendorChangePassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { vendorLogout, setLoading, setError, clearError } from '../redox/authSlice';
import "../Styles/SignUpVendor.css"

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const VendorChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userToken, loading: reduxLoading } = useSelector((state) => state.auth);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState("");
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setErrorState("");
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setErrorState("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorState("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorState("Password must be at least 6 characters");
      return;
    }

    setLoadingState(true);
    setErrorState("");
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const response = await axios.post(
        `${API_BASE_URL}/vendor/change-password`,
        {
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      );

      console.log("Change password response:", response.data);

      Swal.fire({
        icon: "success",
        title: "Password Changed!",
        text: "Please login with your new password.",
        confirmButtonColor: "#ff6b35",
      });

      dispatch(vendorLogout());
      navigate("/vendor/login");

    } catch (error) {
      console.error("Change password error:", error.response?.data);

      const status = error.response?.status;
      const errorMessage =
        error.response?.data?.message ||
        (status === 400 ? "Old password is invalid" : "Failed to change password");

      setErrorState(errorMessage);
      dispatch(setError(errorMessage));

      Swal.fire({
        icon: "error",
        title: "Change Failed",
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
          <img src="/novaxcape/img.png" alt="Change Password" />
        </div>
        <div className="rightLogin-panel">
          <h2>Change Password</h2>

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
              <label>Current Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  placeholder="Current password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={loading || reduxLoading}
                  required
                  style={{ width: "100%", paddingRight: "40px" }}
                />
                <span
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading || reduxLoading}
                  required
                  style={{ width: "100%", paddingRight: "40px" }}
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {loading || reduxLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorChangePassword;
