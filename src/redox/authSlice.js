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
    isAuthenticated: false,
    // Vendor State
    vendorDetails: null,
    isVendor: false,
    vendorId: null,
    vendorHasCentre: false,
    vendorHasPackages: false,
    successMessage: null,
  },
  reducers: {
    // ========== CLIENT AUTH REDUCERS ==========
    setUserDetails: (state, action) => {
      state.loggedInUser = action.payload;
      state.isVendor = false;
      state.isAuthenticated = true;
      // Store client ID in localStorage
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
    clearSuccess: (state) => {
      state.successMessage = null;
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
      state.vendorId = action.payload?.id || action.payload?._id;
      if (state.vendorId) {
        localStorage.setItem("vendorId", state.vendorId);
      }
      localStorage.setItem("isVendor", "true");
      localStorage.setItem("vendorName", action.payload?.centreName || action.payload?.name || "");
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
      state.vendorId = null;
      state.vendorHasCentre = false;
      state.vendorHasPackages = false;
      localStorage.removeItem("token");
      localStorage.removeItem("vendorToken");
      localStorage.removeItem("clientId");
      localStorage.removeItem("vendorId");
      localStorage.removeItem("isVendor");
      localStorage.removeItem("vendorName");
      localStorage.removeItem("centreId");
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

    // ========== VENDOR STATUS REDUCERS ==========
    setVendorStatus: (state, action) => {
      state.vendorHasCentre = action.payload.hasCentre || false;
      state.vendorHasPackages = action.payload.hasPackages || false;
      state.vendorId = action.payload.vendorId || state.vendorId;
      state.isVendor = true;
      
      if (state.vendorId) {
        localStorage.setItem("vendorId", state.vendorId);
      }
      localStorage.setItem("isVendor", "true");
    },
    clearVendorStatus: (state) => {
      state.vendorHasCentre = false;
      state.vendorHasPackages = false;
    },

    // ========== REGISTER REDUCERS ==========
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.loggedInUser = action.payload.user || action.payload;
      state.userToken = action.payload.token || action.payload.userToken;
      state.isVendor = action.payload.isVendor || false;
      state.vendorId = action.payload.vendorId || null;
      state.successMessage = "Registration successful!";
      state.error = null;
      
      if (state.userToken) {
        localStorage.setItem("userToken", state.userToken);
        localStorage.setItem("token", state.userToken);
      }
      if (state.vendorId) {
        localStorage.setItem("vendorId", state.vendorId);
      }
      if (state.isVendor) {
        localStorage.setItem("isVendor", "true");
      }
    },
    registerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.successMessage = null;
    },

    // ========== LOGIN REDUCERS ==========
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.successMessage = null;
    },

    // ========== RESET STATE ==========
    resetAuthState: () => ({
      loggedInUser: null,
      userToken: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      vendorDetails: null,
      isVendor: false,
      vendorId: null,
      vendorHasCentre: false,
      vendorHasPackages: false,
      successMessage: null,
    }),
  },
});

// ========== EXPORT ACTIONS ==========
export const {
  // Client Actions
  setUserDetails,
  updateToken,
  logout,
  setLoading,
  setError,
  clearError,
  clearSuccess,
  resendOTP,
  resendOTPSuccess,
  resendOTPFail,
  verifyAdmin,
  verifyAdminSuccess,
  verifyAdminFail,
  loginSuccess,
  loginStart,
  loginFail,
  registerStart,
  registerSuccess,
  registerFail,
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
  // Vendor Status
  setVendorStatus,
  clearVendorStatus,
  // Reset
  resetAuthState,
} = authSlice.actions;

// ========== SELECTORS ==========
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.loggedInUser;
export const selectUserToken = (state) => state.auth.userToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsVendor = (state) => state.auth.isVendor;
export const selectVendorId = (state) => state.auth.vendorId;
export const selectVendorDetails = (state) => state.auth.vendorDetails;
export const selectVendorHasCentre = (state) => state.auth.vendorHasCentre;
export const selectVendorHasPackages = (state) => state.auth.vendorHasPackages;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthSuccess = (state) => state.auth.successMessage;

export const selectIsVendorComplete = (state) => {
  return state.auth.isVendor && 
         state.auth.vendorHasCentre && 
         state.auth.vendorHasPackages;
};

export const selectVendorOnboardingStep = (state) => {
  if (!state.auth.isVendor) return null;
  if (!state.auth.vendorHasCentre) return "add-centre";
  if (!state.auth.vendorHasPackages) return "add-package";
  return "complete";
};

export const selectAuthHeaders = (state) => {
  const token = state.auth.userToken || localStorage.getItem("userToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default authSlice.reducer;