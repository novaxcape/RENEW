import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../Styles/Login.css";
import Image from "../components/Image";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-panel">
          <Image />
        </div>

        <div className="rightLogin-panel">
          <h2>Create new password</h2>

          <p className="reset-description">
            Enter your new password twice below to reset a new password.
            <br />
            Your password must be different than previous used passwords.
          </p>

          <form>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Input password"
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Input password"
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="signup-btn">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
