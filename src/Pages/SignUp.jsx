import React from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../Styles/Signup.css";

const SignUp = () => {
  return (
    <div className="signup_wrapper">
      <div className="signupBody">
        <div className="signupLeft">
          <img src="/novaxcape/img.png" alt="Signup" />
        </div>

        <div className="signupRight">
          <form>
            <h1 className="signupTitle">Sign Up</h1>

            <div className="field">
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="Enter your last name" />
            </div>

            <div className="field">
              <label>First Name</label>
              <input type="text" name="firstName" placeholder="Enter your first name" />
            </div>

            <div className="field">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter your email" />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="passwordWrapper">
                <input type="password" name="password" placeholder="Enter your password" />
                <span className="eyeIcon">
                  <FaEye />
                </span>
              </div>
              <p className="passwordHint">
                Must contain uppercase, lowercase, number and special character.
              </p>
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <div className="passwordWrapper">
                <input type="password" name="confirmPassword" placeholder="Confirm your password" />
                <span className="eyeIcon">
                  <FaEye />
                </span>
              </div>
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I agree to the <a href="#!">Terms & Conditions</a> and <a href="#!">Privacy Policy</a>
              </label>
            </div>

            <button type="button" className="signupBtn">Sign Up</button>

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
