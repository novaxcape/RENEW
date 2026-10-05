import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import "../Styles/Login.css";
import Image from "../components/Image";

const Login = () => {
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
              <input type="email" name="email" placeholder="Enter your Email" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="login-password-input">
                <input type="password" name="password" placeholder="Enter your Password" />
                <span className="eye-icon">
                  <FaEye />
                </span>
              </div>
              <div className="forgot-password-row">
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button type="button" className="signup-btn">Login</button>

            <div className="divider">
              <span>Or Continue with</span>
            </div>

            <button type="button" className="google-btn">
              <img className="google-icon" src="/novaxcape/google.png" alt="Google" />
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
