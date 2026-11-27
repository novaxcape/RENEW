import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api/api";
import Swal from "sweetalert2";
import "../Styles/SignUpVendor.css";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const SignUpVendor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    centerName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { centerName, email, phoneNumber, password, confirmPassword } = form;

    if (!centerName.trim() || !email.trim() || !phoneNumber.trim() || !password) {
      return setError("Please fill in all fields.");
    }
    if (!PASSWORD_RULE.test(password)) {
      return setError(
        "Password must be at least 8 characters and contain uppercase, lowercase, a number and a special character."
      );
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (!agreed) {
      return setError("Please accept the Terms & Conditions and Privacy Policy.");
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await api.post(`/vendor/register`, {
        centerName: centerName.trim(),
        email: cleanEmail,
        phoneNumber: phoneNumber.trim(),
        password,
      });
      console.log("Vendor register response:", res.data);

      await Swal.fire({
        icon: "success",
        title: "Account created",
        text: "We sent a verification code to your email.",
        confirmButtonColor: "#ff6b35",
      });
      navigate("/vendor/verify-otp", { state: { email: cleanEmail } });
    } catch (err) {
      console.error("Vendor register error:", err.response?.data || err.message);
      const message = errorMessage(err);
      setError(message);
      Swal.fire({
        icon: "error",
        title: "Sign up failed",
        text: message,
        confirmButtonColor: "#ff6b35",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup_wrapper">
      <div className="signupBody">
        <div className="signupLeft">
          <img src="/novaxcape/img.png" alt="Signup" />
        </div>

        <div className="signupRight">
          <form onSubmit={handleSubmit} noValidate>
            <h1 className="signupTitle">Vendor Sign Up</h1>

            {error && (
              <div className="error" style={{ textAlign: "center", marginBottom: "15px" }}>
                {error}
              </div>
            )}

            <div className="field">
              <label>Centre Name</label>
              <input type="text" name="centerName" placeholder="Enter your centre name"
                value={form.centerName} onChange={handleChange} disabled={loading} />
            </div>

            <div className="field">
              <label>Centre Email</label>
              <input type="email" name="email" placeholder="Enter your centre email"
                value={form.email} onChange={handleChange} disabled={loading} />
            </div>

            <div className="field">
              <label>Centre Phone Number</label>
              <input type="tel" name="phoneNumber" placeholder="Enter your centre phone number"
                value={form.phoneNumber} onChange={handleChange} disabled={loading} />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="passwordWrapper">
                <input type={showPassword ? "text" : "password"} name="password"
                  placeholder="Input password" value={form.password}
                  onChange={handleChange} disabled={loading} />
                <span className="eyeIcon" onClick={() => setShowPassword((s) => !s)}
                  role="button" aria-label="Toggle password visibility">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <p className="passwordHint">
                Must contain uppercase, lowercase, number and special character.
              </p>
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <div className="passwordWrapper">
                <input type={showConfirm ? "text" : "password"} name="confirmPassword"
                  placeholder="Confirm your password" value={form.confirmPassword}
                  onChange={handleChange} disabled={loading} />
                <span className="eyeIcon" onClick={() => setShowConfirm((s) => !s)}
                  role="button" aria-label="Toggle confirm password visibility">
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setError(""); }} />
              <label htmlFor="terms">
                I agree to the <a href="#!">Terms & Conditions</a> and <a href="#!">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="signupBtn" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <p className="signinText">
              Have an account?
              <Link to="/vendor/login"> Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpVendor;
