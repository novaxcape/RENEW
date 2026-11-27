import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage, googleAuthUrl } from "../api/api";
import Swal from "sweetalert2";
import "../Styles/Signup.css";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
    const { firstName, lastName, email, password, confirmPassword } = form;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
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
      const res = await api.post(`/client/register`, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      console.log("Register response:", res.data);

      const cleanEmail = email.trim().toLowerCase();
      localStorage.setItem("Name", cleanEmail); // VerifyOtp reads this as a fallback

      await Swal.fire({
        icon: "success",
        title: "Account created",
        text: "We sent a verification code to your email.",
        confirmButtonColor: "#ff6b35",
      });
      navigate("/verify-email", { state: { email: cleanEmail } });
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
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
            <h1 className="signupTitle">Sign Up</h1>

            {error && (
              <div className="error" style={{ textAlign: "center", marginBottom: "15px" }}>
                {error}
              </div>
            )}

            <div className="field">
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="Enter your last name"
                value={form.lastName} onChange={handleChange} disabled={loading} />
            </div>

            <div className="field">
              <label>First Name</label>
              <input type="text" name="firstName" placeholder="Enter your first name"
                value={form.firstName} onChange={handleChange} disabled={loading} />
            </div>

            <div className="field">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter your email"
                value={form.email} onChange={handleChange} disabled={loading} />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="passwordWrapper">
                <input type={showPassword ? "text" : "password"} name="password"
                  placeholder="Enter your password" value={form.password}
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

            <div className="divider">
              <span>Or Continue with</span>
            </div>

            <button type="button" className="googleBtn"
              onClick={() => (window.location.href = googleAuthUrl)}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" />
              Continue with Google
            </button>

            <p className="signinText">
              Have an account?
              <Link to="/signin"> Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
