import React from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../Styles/SignUpVendor.css";

const SignUpVendor = () => {
  return (
    <div className="signup_wrapper">
      <div className="signupBody">
        <div className="signupLeft">
          <img src="/novaxcape/img.png" alt="Signup" />
        </div>

        <div className="signupRight">
          <form>
            <h1 className="signupTitle">Vendor Sign Up</h1>

            <div className="field">
              <label>Centre Name</label>
              <input type="text" name="centerName" placeholder="Enter your centre name" />
            </div>

            <div className="field">
              <label>Centre Email</label>
              <input type="email" name="email" placeholder="Enter your centre email" />
            </div>

            <div className="field">
              <label>Centre Phone Number</label>
              <input type="text" name="phoneNumber" placeholder="Enter your centre phone number" />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="passwordWrapper">
                <input type="password" name="password" placeholder="Input password" />
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
