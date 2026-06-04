import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../Styles/Signup.css";
import Image from "../components/Image";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signup-wrapper">
      <div className="signup-container">

        {/* LEFT SIDE */}
        <div className="left-panel">
          <Image />
        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">
          <h2>Sign Up</h2>
<p>Sign up to enjoy Unlimited booking with us</p>
          <form>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Enter your Name"
              />
            </div>

            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                placeholder="Enter your Name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="form-group">
              <label>Password</label>

              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Input password"
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

              {/* <div className="forgot-password-row">
                <a
                  href="/forgot-password"
                  className="forgot-link"
                >
                  Forgot Password?
                </a>
              </div> */}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Input phone number"
              />
            </div>

            <div className="terms">
              <input type="checkbox" />

              <span>
                I agree to the terms and conditions &
                privacy policy
              </span>
            </div>

            <button
              type="submit"
              className="signup-btn"
            >
              Sign Up
            </button>
          </form>

          <div className="divider">
            <span>Or Continue with</span>
          </div>

          <button className="google-btn">
            <img
              className="google-icon"
              src="/novaxcape/google.png"
              alt="Google"
            />
            Google
          </button>

          <p className="signin-text">
            Have an account?
            <a href="/signin"> Sign In</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignUp;