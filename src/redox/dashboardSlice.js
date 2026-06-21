// redux/dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,      // Will hold the dashboard data from the API
    loading: false,   // Tracks if data is being fetched
    error: null,      // Stores any error messages
  },
  reducers: {
    // ========== DASHBOARD REDUCERS ==========
    // Sets loading to true when fetch starts
    fetchDashboard: (state) => {
      state.loading = true;
      state.error = null; // Clear previous errors
    },
    // Called on successful fetch, stores the data
    fetchDashboardSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload; // `action.payload` is the dashboard data
      state.error = null;
    },
    // Called on failed fetch, stores the error message
    fetchDashboardFail: (state, action) => {
      state.loading = false;
      state.error = action.payload; // `action.payload` is the error string
    },
    // Manually clear an error
    clearDashboardError: (state) => {
      state.error = null;
    },
    // Reset the entire dashboard state (e.g., on logout)
    resetDashboard: (state) => {
      state.stats = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export all actions for use in components and thunks
export const {
  fetchDashboard,
  fetchDashboardSuccess,
  fetchDashboardFail,
  clearDashboardError,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;