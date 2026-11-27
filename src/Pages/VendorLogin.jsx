import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import api, { errorMessage, saveSession } from "../api/api";
import "../Styles/VendorLogin.css";

const VendorLogin = () => {
  const navigate = useNavigate();
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
      const res = await api.post("/vendor/login", { email, password: form.password });
      const { token } = saveSession("vendor", res.data, email);
      if (!token) throw new Error("No token returned from the server.");

      // New vendors with no centre yet go to "Add centre", others to the dashboard
      let destination = "/vendor/dashboard";
      try {
        const centres = await api.get("/tourist/get-all");
        const list = centres.data?.data || [];
        if (Array.isArray(list)) {
          if (list.length === 0) destination = "/add-centre";
          else localStorage.setItem("latestTouristId", list[0].id);
        }
      } catch {
        /* 404 means no centre yet or request failed: fall back to dashboard */
      }
      navigate(destination, { replace: true });
    } catch (err) {
      const message = errorMessage(err, err.message);
      setError(message);
      Swal.fire({ icon: "error", title: "Login failed", text: message, confirmButtonColor: "#ff6b35" });
    } finally {
      setLoading(false);
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

          <form className="vendor-login-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="error" style={{ textAlign: "center", marginBottom: "15px", color: "red" }}>
                {error}
              </div>
            )}

            <div className="vendor-login-field">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter your email"
                value={form.email} onChange={handleChange} disabled={loading} autoComplete="email" />
            </div>

            <div className="vendor-login-field">
              <label>Password</label>
              <div className="vendor-login-password">
                <input type={showPassword ? "text" : "password"} name="password"
                  placeholder="Enter your password" value={form.password}
                  onChange={handleChange} disabled={loading} autoComplete="current-password" />
                <span className="vendor-login-eye" onClick={() => setShowPassword((s) => !s)}
                  role="button" aria-label="Toggle password visibility">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="forgot-password-row">
              <Link to="/vendor/forgot-password" className="forgot-link">Forgot Password?</Link>
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
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
