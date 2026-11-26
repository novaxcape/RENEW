import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import "../Styles/Login.css";
import Image from "../components/Image";
import { api, getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // The server sets the httpOnly `token` cookie; we only keep the profile.
      const res = await api.post("/client/login", {
        email: form.email.trim(),
        password: form.password,
      });
      setUser(res.data?.data);

      const from = location.state?.from || "/";
      navigate(from, { replace: true, state: location.state?.bookingData ? location.state.bookingData : undefined });
    } catch (err) {
      const message = getErrorMessage(err, "Login failed. Please try again.");
      setError(message);

      // 400 covers both "wrong credentials" and "not verified yet"
      if (err.response?.status === 400 && /verif/i.test(message)) {
        const result = await Swal.fire({
          icon: "info",
          title: "Verify your email",
          text: message,
          showCancelButton: true,
          confirmButtonText: "Verify now",
          confirmButtonColor: "#ff6b35",
        });
        if (result.isConfirmed) {
          localStorage.setItem("Name", form.email.trim());
          navigate("/verify-email", { state: { email: form.email.trim() } });
        }
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

          {error && (
            <div
              className="error-message"
              style={{ color: "red", textAlign: "center", marginBottom: 15, padding: 10, backgroundColor: "#ffeeee", borderRadius: 5, fontSize: 14 }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter your Email" value={form.email} onChange={handleChange} disabled={loading} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="login-password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your Password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <span className="eye-icon" onClick={() => setShowPassword((v) => !v)} style={{ cursor: "pointer" }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="forgot-password-row">
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button type="submit" className="signup-btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="divider">
              <span>Or Continue with</span>
            </div>

            <button type="button" className="google-btn">
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
