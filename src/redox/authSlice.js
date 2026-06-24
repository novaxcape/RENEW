// redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ========== PERSISTENCE HELPERS ==========
// Safely grab tokens and IDs from localStorage on application boot
const storedToken = localStorage.getItem("userToken") || localStorage.getItem("token");
const storedClientId = localStorage.getItem("clientId");
const hasVendorToken = !!localStorage.getItem("vendorToken");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Client State - Re-hydrated dynamically from localStorage on reload
    loggedInUser: storedClientId ? { id: storedClientId, _id: storedClientId } : null,
    userToken: storedToken || null,
    loading: false,
    error: null,
    isAuthenticated: !!storedToken,
    
    // Vendor State
    vendorDetails: null,
    isVendor: hasVendorToken,
  },
  reducers: {
    // ========== CLIENT AUTH REDUCERS ==========
    setUserDetails: (state, action) => {
      state.loggedInUser = action.payload;
      state.isVendor = false;
      state.isAuthenticated = true;
      // ✅ Store client ID in localStorage
      const clientId = action.payload?.id || action.payload?._id;
      if (clientId) {
        localStorage.setItem('clientId', clientId);
      }
    },
    updateToken: (state, action) => {
      state.userToken = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
        localStorage.setItem("userToken", action.payload);
        state.isAuthenticated = true;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");
        state.isAuthenticated = false;
      }
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.loggedInUser = null;
      state.userToken = null;
      state.vendorDetails = null;
      state.isVendor = false;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userToken");
      localStorage.removeItem("vendorToken");
      localStorage.removeItem("clientId");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // ========== CLIENT OTP REDUCERS ==========
    resendOTP: (state) => {
      state.loading = true;
    },
    resendOTPSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    resendOTPFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    verifyAdmin: (state) => {
      state.loading = true;
    },
    verifyAdminSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    verifyAdminFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ========== VENDOR AUTH REDUCERS ==========
    setVendorDetails: (state, action) => {
      state.vendorDetails = action.payload;
      state.loggedInUser = action.payload;
      state.isVendor = true;
      state.isAuthenticated = true;
    },
    updateVendorToken: (state, action) => {
      state.userToken = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
        localStorage.setItem("vendorToken", action.payload);
        state.isAuthenticated = true;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("vendorToken");
        state.isAuthenticated = false;
      }
    },
    vendorLogout: (state) => {
      state.vendorDetails = null;
      state.loggedInUser = null;
      state.userToken = null;
      state.isVendor = false;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("vendorToken");
      localStorage.removeItem("clientId");
    },

    // ========== VENDOR OTP REDUCERS ==========
    vendorResendOTP: (state) => {
      state.loading = true;
    },
    vendorResendOTPSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    vendorResendOTPFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    vendorVerifyOTP: (state) => {
      state.loading = true;
    },
    vendorVerifyOTPSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    vendorVerifyOTPFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  // Client Actions
  setUserDetails,
  updateToken,
  logout,
  setLoading,
  setError,
  clearError,
  resendOTP,
  resendOTPSuccess,
  resendOTPFail,
  verifyAdmin,
  verifyAdminSuccess,
  verifyAdminFail,
  loginSuccess,
  // Vendor Actions
  setVendorDetails,
  updateVendorToken,
  vendorLogout,
  vendorResendOTP,
  vendorResendOTPSuccess,
  vendorResendOTPFail,
  vendorVerifyOTP,
  vendorVerifyOTPSuccess,
  vendorVerifyOTPFail,
} = authSlice.actions;

export default authSlice.reducer;