// Pages/Vendor/VendorLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import {
  setVendorDetails,
  updateVendorToken,
  setLoading,
  setError,
  clearError,
} from "../redox/authSlice";
import { getVendorTouristCenters, getKycStatus } from "../redox/apiSlice";
// import "../../Styles/SignUpVendor.css";
import "../Styles/SignUpVendor.css";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const getEntityId = (value) =>
  value?.id || value?._id || value?.vendorId || value?.touristId || value?.data?.id || value?.touristCenter?._id || value?.touristCenter?.id;

const VendorLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: reduxLoading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const center = localStorage.getItem("centerName")
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setErrorState("");
    if (reduxLoading) dispatch(clearError());
  };

  const handlePostLoginFlow = async (user) => {
    const vendorId = getEntityId(user);

    if (!vendorId) {
      navigate("/vendor/dashboard", { replace: true });
      return;
    }

    try {
      const centresResp = await dispatch(getVendorTouristCenters(vendorId)).unwrap();
      const centres = centresResp?.data || centresResp?.touristCentres || centresResp || [];

      if (!centres || centres.length === 0) {
        navigate("/add-centre", { replace: true });
        return;
      }

      const centreId = getEntityId(centres[0]);
      if (!centreId) {
        navigate("/add-centre", { replace: true });
        return;
      }

      const kycResp = await dispatch(getKycStatus(centreId)).unwrap();
      const kycData = kycResp?.data || kycResp?.kyc || kycResp || null;

      const isVerified = Boolean(
        kycData && (kycData?.status === "verified" || kycData?.isVerified || kycData?.verified)
      );

      if (!isVerified) {
        navigate("/kyc", { state: { touristId: centreId }, replace: true });
        return;
      }

      navigate("/vendor/dashboard", { replace: true });
    } catch (err) {
      console.warn("Post-login flow check failed:", err);
      navigate("/vendor/dashboard", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorState("Please fill in all fields");
      return;
    }

    setLoadingState(true);
    setErrorState("");
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const response = await axios.post(`${API_BASE_URL}/vendor/login`, {
        email: formData.email,
        password: formData.password,
      });

      console.log("Vendor login response:", response.data);

      const loginData = response.data?.data || response.data;
      const token =
        response.data?.token || loginData?.token || loginData?.accessToken;
      const user = loginData?.user || loginData?.vendor || loginData;

      if (token) {
        dispatch(updateVendorToken(token));
      }
      if (user) {
        dispatch(setVendorDetails(user));
        localStorage.setItem(
          "vendorName",
          user?.centreName || user?.name || "",
        );
        localStorage.setItem(
          "vendorId",
          user?.id || user?._id || user?.vendorId || "",
        );
      }

      localStorage.setItem("vendorEmail", formData.email);

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonColor: "#ff6b35",
      });

      // Run post-login checks to determine where to navigate next
      await handlePostLoginFlow(user);
    } catch (error) {
      console.error("Vendor login error:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setErrorState(errorMessage);
      dispatch(setError(errorMessage));

      Swal.fire({
        icon: "error",
        title: "Login Failed",
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
          <img src="/novaxcape/img.png" alt="Vendor Login" />
        </div>
        <div className="rightLogin-panel">
          <h2>Vendor Login</h2>

          {error && (
            <div
              className="error-message"
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: "15px",
                padding: "10px",
                backgroundColor: "#fee2e2",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || reduxLoading}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
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
                    color: "#666",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="forgot-password-row">
              <Link to="/vendor/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="signup-btn"
              disabled={loading || reduxLoading}
              style={{ opacity: loading || reduxLoading ? 0.7 : 1 }}
            >
              {loading || reduxLoading ? "Logging in..." : "Login"}
            </button>
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
