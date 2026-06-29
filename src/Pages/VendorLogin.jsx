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
import { getVendorAllCentres } from "../redox/apiSlice";
import "../Styles/VendorLogin.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const VendorLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: reduxLoading } = useSelector((state) => state.auth);
  const { touristCentresLoading } = useSelector((state) => state.api);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setErrorState("");
    if (reduxLoading) dispatch(clearError());
  };

  const handlePostLoginFlow = async () => {
    console.log("🔍 Checking vendor centres after login...");
    
    try {
      const result = await dispatch(getVendorAllCentres()).unwrap();
      
      const centres = result?.data || [];
      console.log(`📄 Found ${centres.length} centre(s)`);

      if (centres.length > 0) {
        localStorage.setItem("vendorCenterCount", centres.length);
        localStorage.setItem("hasCentre", "true");
        
        const firstCentre = centres[0];
        const centreId = firstCentre?.id || firstCentre?._id;
        if (centreId) {
          localStorage.setItem("centreId", centreId);
          localStorage.setItem("selectedCentreId", centreId);
          localStorage.setItem("selectedCentreName", firstCentre.centreName || firstCentre.name || "");
        }
        
        console.log(`✅ Found ${centres.length} centres, navigating to centres page`);
        
        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back! You have ${centres.length} centre(s).`,
          confirmButtonColor: "#ff6b35",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/vendor/centers", { replace: true });
        return;
      }

      console.log("No centres found, redirecting to add centre");
      localStorage.removeItem("hasCentre");
      localStorage.removeItem("centreId");
      
      await Swal.fire({
        icon: "info",
        title: "No Centre Found",
        text: "Please add your tourism centre to get started.",
        confirmButtonColor: "#ff6b35",
      });
      navigate("/add-centre", { replace: true });

    } catch (error) {
      console.error("❌ Post-login flow error:", error);
      
      if (error === "No centres found. Create your first centre.") {
        localStorage.removeItem("hasCentre");
        localStorage.removeItem("centreId");
        navigate("/add-centre", { replace: true });
        return;
      }

      const result = await Swal.fire({
        icon: "warning",
        title: "Could Not Load Centres",
        text: error || "We couldn't load your centres. What would you like to do?",
        showCancelButton: true,
        confirmButtonColor: "#ff6b35",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Go to Dashboard",
        cancelButtonText: "Add Centre"
      });

      if (result.isConfirmed) {
        navigate("/vendor/dashboard", { replace: true });
      } else {
        navigate("/add-centre", { replace: true });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorState("Please fill in all fields");
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all fields.",
        confirmButtonColor: "#ff6b35",
      });
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

      console.log("✅ Vendor login response:", response.data);

      const loginData = response.data?.data || response.data;
      const token = response.data?.token || loginData?.token || loginData?.accessToken;
      const user = loginData?.user || loginData?.vendor || loginData;

      if (!token || !user) {
        throw new Error("Invalid login response: Missing token or user data");
      }

      dispatch(updateVendorToken(token));
      localStorage.setItem("vendorToken", token);
      localStorage.setItem("token", token);
      localStorage.setItem("vendorEmail", formData.email);

      dispatch(setVendorDetails(user));
      
      const vendorName = user?.centreName || user?.name || user?.centerName || "";
      const vendorId = user?.id || user?._id || user?.vendorId || "";
      
      localStorage.setItem("vendorName", vendorName);
      localStorage.setItem("vendorId", vendorId);
      
      console.log("✅ Vendor logged in:", { vendorName, vendorId });

      await handlePostLoginFlow();
      
    } catch (error) {
      console.error("❌ Vendor login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.response.status === 404) {
          errorMessage = "Vendor account not found. Please sign up first.";
        } else {
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Cannot connect to server. Please check your internet connection.";
      } else {
        errorMessage = error.message || "An unexpected error occurred.";
      }
      
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
    <div className="vendor-login-wrapper">
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

          <form className="vendor-login-form" onSubmit={handleSubmit}>
            <div className="vendor-login-field">
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

            <div className="vendor-login-field">
              <label>Password</label>
              <div className="vendor-login-password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading || reduxLoading}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="vendor-login-eye"
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
              disabled={loading || reduxLoading || touristCentresLoading}
              style={{ opacity: loading || reduxLoading || touristCentresLoading ? 0.7 : 1 }}
            >
              {loading || reduxLoading || touristCentresLoading ? (
                <>
                  <span className="spinner"></span> 
                  {touristCentresLoading ? "Checking centres..." : "Logging in..."}
                </>
              ) : (
                "Login"
              )}
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