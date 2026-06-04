import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../Styles/Login.css";
import Image from "../components/Image";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        
       
        <div className="login-panel">
          <Image />
        </div>

     
        <div className="rightLogin-panel">
          <h2>Login</h2>

          <form>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
              />
            </div>

           <div className="form-group">
  <label>Password</label>

  <div className="password-input">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter your Password"
    />

    <span
      className="eye-icon"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>

  <div className="forgot-password-row">
    <a href="/forgot-password" className="forgot-link">
      Forgot Password?
    </a>
  </div>
</div>
            

            <button
              type="submit"
              className="signup-btn"
            >
              Login
            </button>

            <div className="divider">
              <span>Or Continue with</span>
            </div>

            <button
              type="button"
              className="google-btn"
            >
              <img
                className="google-icon"
                src="/novaxcape/google.png"
                alt="Google"
              />

              Google
            </button>

            <p className="signin-text">
              Don't have an account?
              <a href="/signup"> Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;