import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../Styles/Signup.css";
import { api, getErrorMessage } from "../api/client";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = form;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!PASSWORD_RULE.test(password)) {
      setError("Password needs 8+ characters with uppercase, lowercase, a number and a special character");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agreed) {
      setError("Please accept the Terms & Conditions to continue");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("/client", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      localStorage.setItem("Name", email.trim()); // VerifyOtp falls back to this on refresh
      await Swal.fire({
        icon: "success",
        title: "Account created",
        text: "We sent a verification code to your email.",
        confirmButtonColor: "#ff6b35",
      });
      navigate("/verify-email", { state: { email: email.trim(), from: location.state?.from, bookingData: location.state?.bookingData } });
    } catch (err) {
      const message = getErrorMessage(err, "Sign up failed. Please try again.");
      setError(message);
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
          <form onSubmit={handleSubmit}>
            <h1 className="signupTitle">Sign Up</h1>

            {error && (
              <div style={{ color: "red", textAlign: "center", marginBottom: 15, padding: 10, backgroundColor: "#ffeeee", borderRadius: 5, fontSize: 14 }}>
                {error}
              </div>
            )}

            <div className="field">
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="Enter your last name" value={form.lastName} onChange={handleChange} disabled={loading} />
            </div>

            <div className="field">
              <label>First Name</label>
              <input type="text" name="firstName" placeholder="Enter your first name" value={form.firstName} onChange={handleChange} disabled={loading} />
            </div>

            <div className="field">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} disabled={loading} />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="passwordWrapper">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} disabled={loading} />
                <span className="eyeIcon" onClick={() => setShowPassword((v) => !v)} style={{ cursor: "pointer" }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <p className="passwordHint">Must contain uppercase, lowercase, number and special character.</p>
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <div className="passwordWrapper">
                <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} disabled={loading} />
                <span className="eyeIcon" onClick={() => setShowConfirm((v) => !v)} style={{ cursor: "pointer" }}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <label htmlFor="terms">
                I agree to the <a href="#!">Terms & Conditions</a> and <a href="#!">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="signupBtn" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <div className="divider">
              <span>Or Continue with</span>
            </div>

            <button type="button" className="googleBtn">
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
