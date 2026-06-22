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
  loginSuccess,
  setVendorStatus,
} from "../redox/authSlice";
import { getVendorTouristCenters, getAllPackages } from "../redox/apiSlice";
import "../Styles/SignUpVendor.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const getEntityId = (value) =>
  value?.id || value?._id || value?.vendorId || value?.touristId || 
  value?.data?.id || value?.touristCenter?._id || value?.touristCenter?.id;

const VendorLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: reduxLoading } = useSelector((state) => state.auth);

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

  const handlePostLoginFlow = async (user, token) => {
    const vendorId = getEntityId(user);
    console.log("Vendor ID:", vendorId);

    if (!vendorId) {
      console.warn("No vendor ID found, redirecting to add centre");
      navigate("/vendor/add-centre", { replace: true });
      return;
    }

    try {
      // Fetch vendor's tourist centres - handle 404 gracefully
      let centres = [];
      let hasCentre = false;
      
      try {
        const centresResp = await dispatch(getVendorTouristCenters(vendorId)).unwrap();
        console.log("Centres response:", centresResp);
        
        // Extract centres array from response
        centres = centresResp?.data || centresResp?.touristCentres || centresResp || [];
        hasCentre = centres.length > 0;
        console.log("Number of centres found:", centres.length);
      } catch (err) {
        // Check if it's a 404 error (no centres found)
        if (err?.response?.status === 404 || err?.message?.includes("404") || err === "Route not found") {
          console.log("No centres found (404), this is normal for new vendors");
          hasCentre = false;
          centres = [];
        } else {
          // Re-throw other errors
          throw err;
        }
      }

      console.log("Has centre:", hasCentre);

      let hasPackages = false;
      let centreId = null;

      // Check if vendor has packages (only if they have a centre)
      if (hasCentre && centres.length > 0 && centres[0]?.id) {
        centreId = centres[0].id;
        try {
          const packagesResp = await dispatch(getAllPackages(centreId)).unwrap();
          const packages = packagesResp?.data || packagesResp || [];
          hasPackages = packages.length > 0;
          console.log("Number of packages found:", packages.length);
          console.log("Has packages:", hasPackages);
        } catch (pkgError) {
          console.error("Error fetching packages:", pkgError);
          hasPackages = false;
        }
      }

      // Update vendor status in Redux
      dispatch(
        setVendorStatus({
          hasCentre,
          hasPackages,
          vendorId: vendorId,
        })
      );

      // Show appropriate message and redirect based on status
      if (!hasCentre) {
        console.log("No centres found, redirecting to add centre");
        await Swal.fire({
          icon: "info",
          title: "Welcome! Let's Set Up Your Centre",
          text: "Please add your tourism centre to get started.",
          confirmButtonColor: "#ff6b35",
          confirmButtonText: "Add Centre",
        });
        navigate("/vendor/add-centre", { replace: true });
        return;
      }

      if (!hasPackages) {
        console.log("No packages found, redirecting to add package");
        await Swal.fire({
          icon: "info",
          title: "Great! Now Add Packages",
          text: "Please add packages for your centre to get started.",
          confirmButtonColor: "#ff6b35",
          confirmButtonText: "Add Packages",
        });
        navigate("/vendor/add-package", { replace: true });
        return;
      }

      // Has both centre and packages - go to dashboard
      console.log("Vendor has centre and packages, redirecting to dashboard");
      await Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "You have centre and packages set up. Redirecting to dashboard...",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      navigate("/vendor/dashboard", { replace: true });
      
    } catch (err) {
      console.error("Post-login flow check failed:", err);
      
      // If it's a 404 or route not found error, it means no centres exist
      if (err?.response?.status === 404 || err?.message?.includes("404") || err === "Route not found") {
        await Swal.fire({
          icon: "info",
          title: "Welcome! Let's Set Up Your Centre",
          text: "Please add your tourism centre to get started.",
          confirmButtonColor: "#ff6b35",
          confirmButtonText: "Add Centre",
        });
        navigate("/vendor/add-centre", { replace: true });
        return;
      }
      
      // For other errors, show error and redirect to add centre as fallback
      await Swal.fire({
        icon: "warning",
        title: "Could Not Verify Status",
        text: "Please add your tourism centre to get started.",
        confirmButtonColor: "#ff6b35",
      });
      navigate("/vendor/add-centre", { replace: true });
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
      const token = response.data?.token || loginData?.token || loginData?.accessToken;
      const user = loginData?.user || loginData?.vendor || loginData;

      if (token) {
        dispatch(updateVendorToken(token));
        localStorage.setItem("vendorToken", token);
        localStorage.setItem("userToken", token);
        localStorage.setItem("token", token);
      }
      
      if (user) {
        // Get vendor ID from user object
        const vendorId = getEntityId(user);
        
        // Dispatch login success with vendor flag
        dispatch(
          loginSuccess({
            user: user,
            userToken: token,
            isVendor: true,
            vendorId: vendorId,
          })
        );
        
        dispatch(setVendorDetails(user));
        localStorage.setItem("vendorName", user?.centreName || user?.name || "");
        localStorage.setItem("vendorId", vendorId || "");
        localStorage.setItem("isVendor", "true");
      }

      localStorage.setItem("vendorEmail", formData.email);

      // Show login success message
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Run post-login checks to determine where to navigate next
      await handlePostLoginFlow(user, token);
      
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