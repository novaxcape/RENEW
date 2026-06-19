import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { setUserDetails, updateToken, loginSuccess } from "../redox/authSlice";
import "../Styles/Login.css";
import Image from "../components/Image";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    loading: reduxLoading,
    error,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Get booking data from location state
  const from = location.state?.from || "/";
  const bookingData = location.state?.bookingData || null;

  console.log("🔐 Login - location.state:", location.state);
  console.log("🔐 Login - bookingData from state:", bookingData);
  console.log("🔐 Login - from:", from);

  // ✅ Redirect after successful login - runs when isAuthenticated becomes true
  useEffect(() => {
    if (isAuthenticated) {
      console.log("✅ Login - User authenticated, checking for redirect...");

      // Check for pending booking from state or localStorage
      const pendingBooking =
        bookingData || localStorage.getItem("pendingBooking");

      console.log("📦 Login - pendingBooking:", pendingBooking);

      if (pendingBooking) {
        let booking = pendingBooking;
        if (typeof booking === "string") {
          try {
            booking = JSON.parse(booking);
          } catch (e) {
            booking = pendingBooking;
          }
        }

        console.log("📦 Login - Parsed booking:", booking);

        // Clear the pending booking from localStorage
        localStorage.removeItem("pendingBooking");

        // Navigate to booking summary
        if (booking.touristId && booking.packageId) {
          console.log(
            "➡️ Login - Redirecting to booking summary:",
            `/booking-summary/${booking.touristId}/${booking.packageId}`,
          );
          navigate(
            `/booking-summary/${booking.touristId}/${booking.packageId}`,
            {
              state: {
                touristId: booking.touristId,
                packageDetails: booking.packageDetails,
                centreDetails: booking.centreDetails,
              },
              replace: true,
            },
          );
          return;
        }
      }

      // If no booking, navigate to the page they came from
      console.log("➡️ Login - No booking found, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, bookingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (localError) {
      setLocalError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all fields correctly.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    setErrors({});
    setLoading(true);
    setLocalError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/client/login`, {
        email: formData.email,
        password: formData.password,
      });
// 
      console.log("✅ Login response:", response);

      // ✅ Store token and user details
  if (response.data?.token) {
  dispatch(updateToken(response.data.token));

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("userToken", response.data.token);
}

      if (response.data) {
        dispatch(setUserDetails(response.data));
        const clientId = response.data.id || response.data._id;
        if (clientId) {
          localStorage.setItem("clientId", clientId);
        }
      }

      // ✅ Set login success to update isAuthenticated
      dispatch(loginSuccess());

      localStorage.setItem("Name", formData.email);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonColor: "#ff6b35",
        timer: 1500,
        showConfirmButton: false,
      });

      // ✅ The useEffect will handle the redirect
    } catch (error) {
      console.error("Login error:", error.response?.data);
      const errorMessage =
        error.response?.data || "Invalid email or password";
      setLocalError(errorMessage);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
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
          <h2>Login</h2>

          {(localError || error) && (
            <div
              className="error-message"
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: "15px",
                padding: "10px",
                backgroundColor: "#ffeeee",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              {localError || error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "errorInput" : ""}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "errorInput" : ""}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
              <div className="forgot-password-row">
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="signup-btn"
              disabled={loading || reduxLoading}
            >
              {loading || reduxLoading ? "Logging In..." : "Login"}
            </button>

            <div className="divider">
              <span>Or Continue with</span>
            </div>

            <button type="button" className="google-btn">
              <img
                className="google-icon"
                src="/novaxcape/google.png"
                alt="Google"
              />
              Continue with Google
            </button>

            <p className="signin-text">
              Don't have an account?
              <Link to="/signup"> Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
