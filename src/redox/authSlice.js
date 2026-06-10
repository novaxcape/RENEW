// redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Client State
    loggedInUser: null,
    userToken: null,
    loading: false,
    error: null,
    // Vendor State
    vendorDetails: null,
    isVendor: false,
  },
  reducers: {
    // ========== CLIENT AUTH REDUCERS ==========
    setUserDetails: (state, action) => {
      state.loggedInUser = action.payload;
      state.isVendor = false;
    },
    updateToken: (state, action) => {
      state.userToken = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    logout: (state) => {
      state.loggedInUser = null;
      state.userToken = null;
      state.vendorDetails = null;
      state.isVendor = false;
      localStorage.removeItem("token");
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
    },
    updateVendorToken: (state, action) => {
      state.userToken = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
        localStorage.setItem("vendorToken", action.payload);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("vendorToken");
      }
    },
    vendorLogout: (state) => {
      state.vendorDetails = null;
      state.loggedInUser = null;
      state.userToken = null;
      state.isVendor = false;
      localStorage.removeItem("token");
      localStorage.removeItem("vendorToken");
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