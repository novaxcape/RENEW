// redux/dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Dashboard state
  stats: null,
  loading: false,
  error: null,
  
  // Wallet state
  wallet: null,
  walletLoading: false,
  walletError: null,
  
  // Transactions state (if you want to add transactions later)
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // ========== DASHBOARD REDUCERS ==========
    fetchDashboard: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload;
      state.error = null;
    },
    fetchDashboardFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearDashboardError: (state) => {
      state.error = null;
    },
    resetDashboard: (state) => {
      state.stats = null;
      state.loading = false;
      state.error = null;
    },

    // ========== WALLET REDUCERS ==========
    fetchWalletStart: (state) => {
      state.walletLoading = true;
      state.walletError = null;
    },
    fetchWalletSuccess: (state, action) => {
      state.walletLoading = false;
      state.wallet = action.payload;
      state.walletError = null;
    },
    fetchWalletFail: (state, action) => {
      state.walletLoading = false;
      state.walletError = action.payload;
    },
    clearWalletError: (state) => {
      state.walletError = null;
    },
    resetWallet: (state) => {
      state.wallet = null;
      state.walletLoading = false;
      state.walletError = null;
    },

    // ========== TRANSACTIONS REDUCERS (optional) ==========
    fetchTransactionsStart: (state) => {
      state.transactionsLoading = true;
      state.transactionsError = null;
    },
    fetchTransactionsSuccess: (state, action) => {
      state.transactionsLoading = false;
      state.transactions = action.payload;
      state.transactionsError = null;
    },
    fetchTransactionsFail: (state, action) => {
      state.transactionsLoading = false;
      state.transactionsError = action.payload;
    },
    clearTransactionsError: (state) => {
      state.transactionsError = null;
    },
  },
});

// Export all actions
export const {
  // Dashboard actions
  fetchDashboard,
  fetchDashboardSuccess,
  fetchDashboardFail,
  clearDashboardError,
  resetDashboard,
  
  // Wallet actions
  fetchWalletStart,
  fetchWalletSuccess,
  fetchWalletFail,
  clearWalletError,
  resetWallet,
  
  // Transactions actions
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFail,
  clearTransactionsError,
} = dashboardSlice.actions;

// ========== DASHBOARD SELECTORS ==========
export const selectDashboard = (state) => state.dashboard;
export const selectStats = (state) => state.dashboard.stats;
export const selectLoading = (state) => state.dashboard.loading;
export const selectError = (state) => state.dashboard.error;

export const selectVendorName = (state) => state.dashboard.stats?.vendorName || '';
export const selectRequests = (state) => state.dashboard.stats?.requests || { today: 0, yesterday: 0 };
export const selectRevenue = (state) => state.dashboard.stats?.revenue || { today: 0, yesterday: 0 };
export const selectBookings = (state) => state.dashboard.stats?.bookings || { today: 0, yesterday: 0, total: 0 };
export const selectTicketTypes = (state) => state.dashboard.stats?.ticketTypes || { breakdown: [], total: 0 };
export const selectVisitorStats = (state) => state.dashboard.stats?.visitorStats || [];
export const selectRatings = (state) => state.dashboard.stats?.ratings || { average: 0, count: 0 };

// ========== WALLET SELECTORS ==========
export const selectWallet = (state) => state.dashboard.wallet;
export const selectWalletLoading = (state) => state.dashboard.walletLoading;
export const selectWalletError = (state) => state.dashboard.walletError;

// Computed wallet selectors
export const selectWalletBalance = (state) => state.dashboard.wallet?.balance || 0;
export const selectWalletTotalEarnings = (state) => state.dashboard.wallet?.totalEarnings || 0;
export const selectWalletId = (state) => state.dashboard.wallet?.id || null;
export const selectWalletTouristId = (state) => state.dashboard.wallet?.touristId || null;

// ========== TRANSACTIONS SELECTORS ==========
export const selectTransactions = (state) => state.dashboard.transactions || [];
export const selectTransactionsLoading = (state) => state.dashboard.transactionsLoading;
export const selectTransactionsError = (state) => state.dashboard.transactionsError;

export default dashboardSlice.reducer;