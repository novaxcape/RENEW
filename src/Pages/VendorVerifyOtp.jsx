// Pages/Vendor/VendorVerifyOtp.jsx
import React, { useState, useEffect } from "react";
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
} from "../redox/authSlice"; // Fixed import path
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
  const [timer, setTimer] = useState(180);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

    // Dispatch vendor OTP verification started
    dispatch(vendorVerifyOTP());

    try {
      const response = await axios.post(`${API_BASE_URL}/vendor/verify-otp`, {
        email: email,
        otp: otpCode,
      });

      console.log("Verification response:", response.data);

      // Dispatch success
      dispatch(vendorVerifyOTPSuccess());

      if (response.data.token) {
        dispatch(updateVendorToken(response.data.token));
      }
      if (response.data.user) {
        dispatch(setVendorDetails(response.data.user));
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

      // Dispatch failure
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
        text: `Please wait ${formatTime(timer)} before requesting another OTP.`,
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    setLoading(true);
    setError("");

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

      setTimer(180);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } catch (error) {
      console.error("Resend error:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP.";
      setError(errorMessage);

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

  return (
    <main className="signupvendor_container">
      <section className="signupvendor_wrapper">
        <div className="signup-image-section">
          <div className="image-overlay">
            <h1>Verify Your Email</h1>
            <p>
              Enter the 6-digit verification code sent to your email to complete
              registration.
            </p>
          </div>
        </div>

        <div className="signup-form-section">
          <div className="form-wrapper">
            <h2>Email Verification</h2>

            <p
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#666",
              }}
            >
              We've sent a code to:
              <br />
              <strong style={{ color: "#ff6b35" }}>
                {email || "your email"}
              </strong>
            </p>

            {error && (
              <div
                className="error-message"
                style={{
                  color: "red",
                  textAlign: "center",
                  marginBottom: "15px",
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Verification Code</label>
              <div
                className="otp-input-group"
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

            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <span style={{ fontSize: "14px" }}>
                Code expires in:{" "}
                <strong style={{ color: timer < 60 ? "red" : "#ff6b35" }}>
                  {formatTime(timer)}
                </strong>
              </span>
            </div>

            <button
              className="signup-button"
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
                {canResend ? "Resend Code" : `Resend in ${formatTime(timer)}`}
              </span>
            </div>

            <p className="signin-link" style={{ marginTop: "30px" }}>
              Already have an account? <Link to="/vendor/login">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default VendorVerifyOtp;
