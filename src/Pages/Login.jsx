
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
// import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../Styles/Login.css";
import Image from "../components/Image";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

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

    try {
      // API CALL HERE

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonColor: "#ff6b35",
      });

      console.log(formData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password",
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

              {errors.email && (
                <span className="error">
                  {errors.email}
                </span>
              )}
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
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>
              </div>

              {errors.password && (
                <span className="error">
                  {errors.password}
                </span>
              )}

              <div className="forgot-password-row">
                <Link
                  to="/forgot-password"
                  className="forgot-link"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="signup-btn"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
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
