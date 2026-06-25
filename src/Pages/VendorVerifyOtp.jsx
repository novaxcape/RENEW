// Pages/Vendor/VendorVerifyOtp.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import {
  vendorVerifyOTP,
  vendorVerifyOTPSuccess,
  vendorVerifyOTPFail,
  updateVendorToken,
  setVendorDetails,
} from "../redox/authSlice";
import "../Styles/SignUpVendor.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const VendorVerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading: reduxLoading } = useSelector((state) => state.auth);

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(true);

  React.useEffect(() => {
    if (!email) {
      navigate("/signupvendor");
    }
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    if (!email) {
      setError("Email address is missing");
      return;
    }

    setLoading(true);
    setError("");

    dispatch(vendorVerifyOTP());

    try {
      const response = await axios.post(`${API_BASE_URL}/vendor/verify-otp`, {
        email: email,
        otp: otpCode,
      });

      console.log("Verification response:", response.data);

      dispatch(vendorVerifyOTPSuccess());

      if (response.data.token) {
        dispatch(updateVendorToken(response.data.token));
        localStorage.setItem("vendorToken", response.data.token);
      }
      if (response.data.user) {
        dispatch(setVendorDetails(response.data.user));
        localStorage.setItem("vendorId", response.data.user.id || response.data.user._id);
        localStorage.setItem("vendorEmail", response.data.user.email);
      }

      Swal.fire({
        icon: "success",
        title: "Verification Successful!",
        text: "Your vendor account has been verified. You can now add your centre.",
        confirmButtonColor: "#ff6b35",
      });

      navigate("/add-centre");
    } catch (error) {
      console.error("Verification error:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "Invalid OTP. Please try again.";

      dispatch(vendorVerifyOTPFail(errorMessage));
      setError(errorMessage);

      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: errorMessage,
        confirmButtonColor: "#ff6b35",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) {
      Swal.fire({
        icon: "info",
        title: "Please Wait",
        text: "Please wait before requesting another OTP.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    setLoading(true);
    setError("");
    setCanResend(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/vendor/resend-otp`, {
        email,
      });
      console.log("Resend response:", response.data);

      Swal.fire({
        icon: "success",
        title: "OTP Resent!",
        text: "A new verification code has been sent to your email.",
        confirmButtonColor: "#ff6b35",
      });

      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();

      // Re-enable resend after 5 minutes (300000 ms)
      setTimeout(() => {
        setCanResend(true);
      }, 300000);
    } catch (error) {
      console.error("Resend error:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP.";
      setError(errorMessage);
      setCanResend(true);

      Swal.fire({
        icon: "error",
        title: "Resend Failed",
        text: errorMessage,
        confirmButtonColor: "#ff6b35",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <main className="signup_wrapper">
      <div className="signupBody">
        <div className="signupLeft">
          <img src="/novaxcape/img.png" alt="Verification" />
        </div>

        <div className="signupRight">
          <form onSubmit={(e) => e.preventDefault()}>
            <h1 className="signupTitle">Verify Email</h1>

            <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
              We've sent a code to:
              <br />
              <strong style={{ color: "#ff6b35" }}>{email || "your email"}</strong>
            </p>

            {error && (
              <div className="error" style={{ textAlign: "center", marginBottom: "15px" }}>
                {error}
              </div>
            )}

            <div className="field">
              <label>Verification Code</label>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={loading || reduxLoading}
                    style={{
                      width: "50px",
                      height: "50px",
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: "bold",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              className="signupBtn"
              onClick={handleVerify}
              disabled={loading || otp.join("").length !== 6}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <span>Didn't receive a code? </span>
              <span
                onClick={handleResendOTP}
                style={{
                  color: canResend ? "#ff6b35" : "#999",
                  cursor: canResend ? "pointer" : "not-allowed",
                  textDecoration: "underline",
                }}
              >
                {canResend ? "Resend Code" : "Resend Code"}
              </span>
            </div>

            <p className="signinText" style={{ marginTop: "30px" }}>
              Already have an account? <Link to="/vendor/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default VendorVerifyOtp;
