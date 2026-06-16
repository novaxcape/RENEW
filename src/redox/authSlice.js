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
    // ✅ Add isAuthenticated
    isAuthenticated: false,
    // Vendor State
    vendorDetails: null,
    isVendor: false,
  },
  reducers: {
    // ========== CLIENT AUTH REDUCERS ==========
    setUserDetails: (state, action) => {
      state.loggedInUser = action.payload;
      state.isVendor = false;
      state.isAuthenticated = true; // ✅ Set authenticated when user details are set
    },
    updateToken: (state, action) => {
      state.userToken = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
        state.isAuthenticated = true; // ✅ Set authenticated when token is updated
      } else {
        localStorage.removeItem("token");
        state.isAuthenticated = false;
      }
    },
    // ✅ Add loginSuccess reducer
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
      state.isAuthenticated = false; // ✅ Set to false on logout
      localStorage.removeItem("token");
      localStorage.removeItem("userToken");
      localStorage.removeItem("vendorToken");
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
      state.isAuthenticated = true; // ✅ Set authenticated when vendor details are set
    },
    updateVendorToken: (state, action) => {
      state.userToken = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
        localStorage.setItem("vendorToken", action.payload);
        state.isAuthenticated = true; // ✅ Set authenticated when vendor token is updated
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
      state.isAuthenticated = false; // ✅ Set to false on vendor logout
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
  // ✅ Export loginSuccess
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