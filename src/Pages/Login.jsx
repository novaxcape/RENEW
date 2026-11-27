import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import api, { errorMessage, saveSession, googleAuthUrl } from "../api/api";
import "../Styles/Login.css";
import Image from "../components/Image";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();

    if (!email || !form.password) return setError("Please enter your email and password.");

    setLoading(true);
    try {
      const res = await api.post("/client/login", { email, password: form.password });
      const { token } = saveSession("client", res.data, email);
      if (!token) throw new Error("No token returned from the server.");

      // Continue a booking the user started before signing in
      let pending = null;
      try {
        pending = JSON.parse(localStorage.getItem("pendingBooking") || "null");
      } catch {
        pending = null;
      }
      if (pending?.touristId && pending?.packageId) {
        localStorage.removeItem("pendingBooking");
        navigate(`/booking-summary/${pending.touristId}/${pending.packageId}`, {
          replace: true,
          state: {
            touristId: pending.touristId,
            packageDetails: pending.packageDetails,
            centreDetails: pending.centreDetails,
          },
        });
        return;
      }
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      const message = errorMessage(err, err.message);
      setError(message);

      // Account exists but email isn't verified yet -> send them to verify
      if (/verify/i.test(message)) {
        localStorage.setItem("Name", email);
        const result = await Swal.fire({
          icon: "info",
          title: "Verify your email",
          text: message,
          confirmButtonText: "Enter code",
          showCancelButton: true,
          confirmButtonColor: "#ff6b35",
        });
        if (result.isConfirmed) {
          try { await api.post("/client/resend-otp", { email }); } catch { /* ignore */ }
          navigate("/verify-email", { state: { email } });
        }
      } else {
        Swal.fire({ icon: "error", title: "Login failed", text: message, confirmButtonColor: "#ff6b35" });
      }
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

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="error-message" style={{ color: "red", textAlign: "center", marginBottom: "15px", padding: "10px", backgroundColor: "#ffeeee", borderRadius: "5px", fontSize: "14px" }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter your Email"
                value={form.email} onChange={handleChange} disabled={loading} autoComplete="email" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="login-password-input">
                <input type={showPassword ? "text" : "password"} name="password"
                  placeholder="Enter your Password" value={form.password}
                  onChange={handleChange} disabled={loading} autoComplete="current-password" />
                <span className="eye-icon" onClick={() => setShowPassword((s) => !s)}
                  role="button" aria-label="Toggle password visibility">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="forgot-password-row">
                <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
              </div>
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="divider">
              <span>Or Continue with</span>
            </div>

            <button type="button" className="google-btn"
              onClick={() => (window.location.href = googleAuthUrl)}>
              <img className="google-icon" src="/novaxcape/google.png" alt="Google" />
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
