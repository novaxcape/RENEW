// SignUp.jsx
import React, { useState } from "react";
import { z } from "zod";
import Swal from "sweetalert2"; // UNCOMMENT THIS LINE
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserDetails, updateToken, setLoading, setError, clearError } from "../redox/authSlice";
import "../Styles/Signup.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ;

// MOVE INTERCEPTORS OUTSIDE THE COMPONENT - PLACE THEM HERE
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request.url, request.data);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  error => {
    console.log('Full Error Object:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    return Promise.reject(error);
  }
);

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/, 
      "Password must contain uppercase, lowercase, number and special character"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: reduxLoading, error } = useSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoadingState] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = signUpSchema.safeParse(formData);
    
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
    setLoadingState(true);
    dispatch(setLoading(true));
    dispatch(clearError());
    
    // Save to localStorage
    localStorage.setItem("Name", formData.email);
    
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };
    
    try {
      // API CALL DIRECTLY IN COMPONENT
      const response = await axios.post(`${API_BASE_URL}/client/register`, userData);
      
      console.log("API Response:", response.data);
      
      if (response.data.token) {
        dispatch(updateToken(response.data.token));
      }
      
      if (response.data.user) {
        dispatch(setUserDetails(response.data.user));
      }
      
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Account created successfully. Please verify your email.",
        confirmButtonColor: "#ff6b35",
      });
      
      navigate("/verify-email", { state: { email: formData.email } });
      
    } catch (error) {
      console.error("Full error object:", error);
      
      // Better error handling
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error.response) {
        // Server responded with error
        console.error("Error response data:", error.response.data);
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        console.error("No response received:", error.request);
        errorMessage = "Cannot connect to server. Please check your connection.";
      } else {
        // Other errors
        errorMessage = error.message;
      }
      
      dispatch(setError(errorMessage));
      
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: errorMessage,
        confirmButtonColor: "#ff6b35",
      });
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="signup_wrapper">
      <div className="signupBody">
        <div className="signupLeft">
          <img src="/novaxcape/img.png" alt="Signup" />
        </div>

        <div className="signupRight">
          <form onSubmit={handleSubmit}>
            <h1 className="signupTitle">Sign Up</h1>

            {error && (
              <div className="error-message" style={{
                color: "red",
                textAlign: "center",
                marginBottom: "15px",
                padding: "10px",
                backgroundColor: "#ffeeee",
                borderRadius: "5px",
                fontSize: "14px"
              }}>
                {error}
              </div>
            )}

            <div className="field">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <span className="error">{errors.lastName}</span>}
            </div>

            <div className="field">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <span className="error">{errors.firstName}</span>}
            </div>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="field">
              <label>Password</label>
              <div className="passwordWrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span className="eyeIcon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
              <p className="passwordHint">
                Must contain uppercase, lowercase, number and special character.
              </p>
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <div className="passwordWrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <span className="eyeIcon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I agree to the <a href="#!"> Terms & Conditions </a> and <a href="#!"> Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="signupBtn" disabled={loading || reduxLoading}>
              {loading || reduxLoading ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="divider">
              <span>Or Continue with</span>
            </div>

            <button type="button" className="googleBtn">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" />
              Continue with Google
            </button>

            <p className="signinText">
              Have an account?
              <span onClick={() => navigate("/signin")} style={{ cursor: "pointer" }}> Sign In</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;