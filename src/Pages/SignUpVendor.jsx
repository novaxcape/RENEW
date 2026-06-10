// Pages/Vendor/SignUpVendor.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { z } from 'zod';
import axios from 'axios';
import Swal from 'sweetalert2';
import { setVendorDetails, updateVendorToken, setLoading, setError, clearError } from '../redox/authSlice';
import "../Styles/SignUpVendor.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

// ========== ZOD VALIDATION SCHEMA ==========
const vendorSignUpSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  centerName: z.string()
    .min(2, "Centre name must be at least 2 characters")
    .max(100, "Centre name is too long"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{10,15}$/, "Please enter a valid phone number (10-15 digits)"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/^(?=.*\d)/, "Password must contain at least one number")
    .regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character"),
  agreed: z.boolean()
    .refine(val => val === true, "You must agree to the terms and conditions")
});

const SignUpVendor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: reduxLoading } = useSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoadingState] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    centerName: '',
    phoneNumber: '',
    password: '',
    agreed: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Zod validation
    const result = vendorSignUpSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please check all fields and try again.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }
    
    setErrors({});
    setLoadingState(true);
    dispatch(setLoading(true));
    dispatch(clearError());
    
    // Prepare data for API
    const vendorData = {
      email: formData.email,
      centerName: formData.centerName,
      phoneNumber: formData.phone,
      password: formData.password
    };
    
    try {
      const response = await axios.post(`${API_BASE_URL}/vendor/register`, vendorData);
      
      console.log("Vendor registration response:", response.data);
      
      if (response.data.token) {
        dispatch(updateVendorToken(response.data.token));
      }
      
      if (response.data.user) {
        dispatch(setVendorDetails(response.data.user));
      }
      
      
      localStorage.setItem("vendorEmail", formData.email);
      localStorage.setItem("vendorName", formData.centerName);
      
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Please verify your email with the OTP sent.",
        confirmButtonColor: "#ff6b35",
      });
      
      navigate("/vendor/verify-otp", { state: { email: formData.email } });
      
    } catch (error) {
      console.error("Vendor registration error:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      dispatch(setError(errorMessage));
      
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        confirmButtonColor: "#ff6b35",
      });
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <main className='signupvendor_container'>
      <section className='signupvendor_wrapper'>
        <div className="signup-image-section">
          <div className="image-overlay">
            <h1>Create Your Vendor Account</h1>
            <p>Join NovaXcape as a vendor. List your tourism centre and reach thousands of travelers.</p>
          </div>
        </div>

        <div className="signup-form-section">
          <div className="form-wrapper">
            <h2>Vendor Sign Up</h2>
            
            {/* API Error Message */}
            {reduxLoading && (
              <div className="error-message" style={{ color: "orange", textAlign: "center", marginBottom: "15px" }}>
                Processing...
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Centre Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading || reduxLoading}
                  className={errors.email ? "error-input" : ""}
                  style={errors.email ? { borderColor: "red" } : {}}
                />
                {errors.email && <span className="error-text" style={{ color: "red", fontSize: "12px", marginTop: "5px", display: "block" }}>{errors.email}</span>}
              </div>

              {/* Centre Name Field */}
              <div className="form-group">
                <label htmlFor="centerName">Centre Name</label>
                <input
                  type="text"
                  id="centerName"
                  name="centerName"
                  placeholder="Enter your centre name"
                  value={formData.centerName}
                  onChange={handleChange}
                  disabled={loading || reduxLoading}
                  className={errors.centerName ? "error-input" : ""}
                  style={errors.centerName ? { borderColor: "red" } : {}}
                />
                {errors.centerName && <span className="error-text" style={{ color: "red", fontSize: "12px", marginTop: "5px", display: "block" }}>{errors.centerName}</span>}
              </div>

              {/* Phone Field */}
              <div className="form-group">
                <label htmlFor="phone">Centre Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Input phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading || reduxLoading}
                  className={errors.phone ? "error-input" : ""}
                  style={errors.phone ? { borderColor: "red" } : {}}
                />
                {errors.phone && <span className="error-text" style={{ color: "red", fontSize: "12px", marginTop: "5px", display: "block" }}>{errors.phone}</span>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Centre Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Input password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading || reduxLoading}
                    className={errors.password ? "error-input" : ""}
                    style={errors.password ? { borderColor: "red" } : {}}
                  />
                  <span 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && <span className="error-text" style={{ color: "red", fontSize: "12px", marginTop: "5px", display: "block" }}>{errors.password}</span>}
                <small style={{ fontSize: "12px", color: "#666", display: "block", marginTop: "5px" }}>
                  Password must be at least 6 characters with uppercase, lowercase, number and special character
                </small>
              </div>

              {/* Checkbox Field */}
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="agreed"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  disabled={loading || reduxLoading}
                />
                <label htmlFor="agreed">
                  I agree to the <a href="#terms">terms and condition</a> & <a href="#privacy">privacy policy</a>
                </label>
              </div>
              {errors.agreed && <span className="error-text" style={{ color: "red", fontSize: "12px", display: "block", marginTop: "-10px", marginBottom: "10px" }}>{errors.agreed}</span>}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="signup-button"
                disabled={loading || reduxLoading}
              >
                {loading || reduxLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
            
            <p className="signin-link">
              Have an account? <Link to="/vendor/login">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUpVendor;