import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedInUser: null,
    userToken: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.loggedInUser = action.payload;
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
  },
});

export const {
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
} = authSlice.actions;

export default authSlice.reducer;