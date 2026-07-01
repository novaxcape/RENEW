// Wallet.jsx - FULLY EDITED WITH SWEETALERT2
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  fetchWalletStart,
  fetchWalletSuccess,
  fetchWalletFail,
  clearWalletError,
  selectWallet,
  selectWalletLoading,
  selectWalletError,
  selectWalletBalance,
  selectWalletTotalEarnings,
} from "../redox/dashboardSlice";
import { logout } from "../redox/authSlice";
import "./css/Wallet.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const getAuthToken = (reduxToken) =>
  localStorage.getItem("vendorToken") ||
  reduxToken ||
  localStorage.getItem("userToken") ||
  localStorage.getItem("token");

const getStoredTouristId = () =>
  localStorage.getItem("latestTouristId") ||
  localStorage.getItem("selectedCentreId") ||
  localStorage.getItem("centreId") ||
  localStorage.getItem("touristId");

const getWalletPayload = (responseData) =>
  responseData?.data?.wallet ||
  responseData?.data ||
  responseData?.wallet ||
  responseData;

const getWalletTouristId = (walletData) =>
  walletData?.touristId ||
  walletData?.tourist?.id ||
  walletData?.tourist?._id ||
  walletData?.touristCentre?.id ||
  walletData?.touristCentre?._id;

// ✅ FIXED: Better transaction extraction with multiple fallbacks
const getWalletTransactions = (walletData) => {
  if (!walletData) return [];

  // Try all possible locations for transactions
  const possiblePaths = [
    walletData?.transactions,
    walletData?.data?.transactions,
    walletData?.transactionHistory,
    walletData?.data?.transactionHistory,
    walletData?.walletTransactions,
    walletData?.data?.walletTransactions,
    walletData?.withdrawals,
    walletData?.data?.withdrawals,
    walletData?.payouts,
    walletData?.data?.payouts,
    walletData?.history,
    walletData?.data?.history,
    walletData?.transactions?.data,
    walletData?.transactionHistory?.data,
    walletData?.data?.transactions?.data,
  ];

  for (const path of possiblePaths) {
    if (Array.isArray(path) && path.length > 0) {
      console.log("✅ Found transactions at path:", path);
      return path;
    }
  }

  // If no transactions found, log the wallet structure for debugging
  console.log("🔍 Wallet data structure:", JSON.stringify(walletData, null, 2));
  console.log("🔍 Wallet keys:", Object.keys(walletData || {}));
  
  // Check if there's any array in the wallet data
  for (const key of Object.keys(walletData || {})) {
    if (Array.isArray(walletData[key]) && walletData[key].length > 0) {
      console.log(`✅ Found array at key "${key}":`, walletData[key]);
      return walletData[key];
    }
  }

  return [];
};

const getWithdrawalHistoryPayload = (responseData) => {
  const withdrawals =
    responseData?.withdrawals ||
    responseData?.data?.withdrawals ||
    responseData?.data ||
    [];

  return Array.isArray(withdrawals) ? withdrawals : [];
};

const parseResponseBody = async (response) => {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const getWalletErrorMessage = (status, data) => {
  const message = data?.message || "Failed to fetch wallet data";

  if (message.toLowerCase().includes("tourist not found")) {
    return "No tourist centre is linked to your account yet. Please create a tourist centre first to access your wallet.";
  }

  if (status === 404 && message.toLowerCase().includes("tourist")) {
    return "No tourist centre is linked to this vendor account yet. Please create a centre first, or ask support to link this vendor to an existing centre.";
  }

  if (status === 401) {
    return "Your session has expired. Please login again.";
  }

  if (status === 403) {
    return "You don't have permission to access this wallet.";
  }

  return message;
};

// ✅ SweetAlert helper functions
const showSuccessAlert = (title, text) => {
  Swal.fire({
    icon: "success",
    title: title,
    text: text,
    confirmButtonColor: "#ff6b35",
    timer: 3000,
    timerProgressBar: true,
  });
};

const showErrorAlert = (title, text) => {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonColor: "#ff6b35",
  });
};

const showWarningAlert = (title, text, confirmText, callback) => {
  Swal.fire({
    icon: "warning",
    title: title,
    text: text,
    confirmButtonColor: "#ff6b35",
    confirmButtonText: confirmText || "OK",
    showCancelButton: true,
    cancelButtonColor: "#6c757d",
  }).then((result) => {
    if (callback && result.isConfirmed) {
      callback();
    }
  });
};

const showInfoAlert = (title, text, callback) => {
  Swal.fire({
    icon: "info",
    title: title,
    text: text,
    confirmButtonColor: "#ff6b35",
  }).then((result) => {
    if (callback && result.isConfirmed) {
      callback();
    }
  });
};

const Wallet = () => {
  const dispatch = useDispatch();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);
  const [withdrawalsError, setWithdrawalsError] = useState(null);

  const wallet = useSelector(selectWallet);
  const loading = useSelector(selectWalletLoading);
  const error = useSelector(selectWalletError);
  const balance = useSelector(selectWalletBalance);
  const totalEarnings = useSelector(selectWalletTotalEarnings);

  const { userToken, isAuthenticated } = useSelector((state) => state.auth);

  const fetchWithdrawalHistory = useCallback(
    async (touristId, authToken = getAuthToken(userToken)) => {
      if (!touristId || !authToken) {
        setWithdrawals([]);
        return;
      }

      try {
        setWithdrawalsLoading(true);
        setWithdrawalsError(null);

        const response = await fetch(
          `${API_URL}/withdrawal/withdrawals/${encodeURIComponent(
            touristId,
          )}?page=1&limit=10`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await parseResponseBody(response);
        console.log("Withdrawal history response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to load withdrawal history");
        }

        setWithdrawals(getWithdrawalHistoryPayload(data));
      } catch (error) {
        console.error("Withdrawal history fetch error:", error);
        setWithdrawals([]);
        setWithdrawalsError(
          error.message || "Failed to load withdrawal history",
        );
      } finally {
        setWithdrawalsLoading(false);
      }
    },
    [userToken],
  );

  // Fetch wallet data
  const fetchWalletData = useCallback(async () => {
    try {
      const token = getAuthToken(userToken);

      if (!token) {
        dispatch(fetchWalletFail("Please login to view wallet"));
        return;
      }

      dispatch(fetchWalletStart());

      const response = await fetch(`${API_URL}/wallet`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await parseResponseBody(response);
      console.log("📦 Wallet API Response:", JSON.stringify(data, null, 2));

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(logout());
          dispatch(fetchWalletFail("Session expired. Please login again."));
          showWarningAlert(
            "Session Expired",
            "Your session has expired. Please login again.",
            "Login",
            () => (window.location.href = "/signin")
          );
          return;
        }

        if (
          response.status === 404 &&
          data?.message?.toLowerCase().includes("tourist")
        ) {
          dispatch(fetchWalletFail("No tourist centre found"));
          return;
        }

        dispatch(fetchWalletFail(getWalletErrorMessage(response.status, data)));
        return;
      }

      const walletData = getWalletPayload(data);
      const touristId = getWalletTouristId(walletData);

      if (touristId) {
        localStorage.setItem("latestTouristId", touristId);
      }

      // ✅ Log transaction data for debugging
      const transactions = getWalletTransactions(walletData);
      console.log("📊 Extracted transactions:", transactions);
      console.log("📊 Transaction count:", transactions.length);

      dispatch(fetchWalletSuccess(walletData));

      // Show success notification if transactions found
      if (transactions.length > 0) {
        console.log(`✅ Found ${transactions.length} transactions`);
      }
    } catch (error) {
      console.error("Wallet fetch error:", error);
      dispatch(
        fetchWalletFail(
          error.message || "Network error. Please check your connection.",
        ),
      );
    }
  }, [dispatch, userToken]);

  useEffect(() => {
    if (isAuthenticated || getAuthToken(userToken)) {
      fetchWalletData();
    }
    return () => {
      dispatch(clearWalletError());
    };
  }, [dispatch, fetchWalletData, isAuthenticated, userToken]);

  useEffect(() => {
    const touristId = getWalletTouristId(wallet) || getStoredTouristId();

    if (wallet && touristId) {
      fetchWithdrawalHistory(touristId);
    }
  }, [fetchWithdrawalHistory, wallet]);

  // Handle withdraw with SweetAlert
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const touristId = getWalletTouristId(wallet) || getStoredTouristId();
    const token = getAuthToken(userToken);

    if (!amount || amount <= 0) {
      showWarningAlert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
    
    if (amount > balance) {
      showWarningAlert("Insufficient Balance", "You don't have enough balance to withdraw this amount.");
      return;
    }
    
    if (!touristId) {
      showWarningAlert(
        "Tourist Centre Not Found",
        "Please refresh or add a centre first before withdrawing.",
        "Create Centre",
        () => (window.location.href = "/vendor/create-centre")
      );
      return;
    }
    
    if (!token) {
      showWarningAlert(
        "Authentication Required",
        "Please login to withdraw funds.",
        "Login",
        () => (window.location.href = "/signin")
      );
      return;
    }

    // ✅ Confirm withdrawal with SweetAlert
    const confirmResult = await Swal.fire({
      title: "Confirm Withdrawal",
      html: `
        <p>You are about to withdraw:</p>
        <p style="font-size: 24px; font-weight: bold; color: #ff6b35;">
          ${formatCurrency(amount)}
        </p>
        <p style="font-size: 14px; color: #666; margin-top: 8px;">
          Available balance: ${formatCurrency(balance)}
        </p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Withdraw",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      setWithdrawing(true);

      const response = await fetch(
        `${API_URL}/withdrawal/payout-funds/${touristId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        },
      );

      const data = await parseResponseBody(response);

      if (!response.ok) {
        throw new Error(data.message || "Withdrawal failed");
      }

      showSuccessAlert(
        "✅ Withdrawal Initiated!",
        data.message || "Your withdrawal has been initiated successfully."
      );
      
      setWithdrawAmount("");

      dispatch(
        fetchWalletSuccess({
          ...(wallet || {}),
          balance: data.walletBalance ?? balance - amount,
        }),
      );
      fetchWalletData();
      fetchWithdrawalHistory(touristId, token);
    } catch (error) {
      console.error("Withdrawal error:", error);
      showErrorAlert(
        "Withdrawal Failed",
        error.message || "Failed to process withdrawal."
      );
    } finally {
      setWithdrawing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Stats cards data from API
  const statsCards = [
    {
      label: "Total Earnings",
      icon: "/novaxcape/dollar.png",
      value: formatCurrency(totalEarnings || 0),
      badge: "↑ 2.0%",
      isNaira: true,
    },
    {
      label: "Available Balance",
      icon: "/novaxcape/dollar.png",
      value: formatCurrency(balance || 0),
      badge: "↑ 2.0%",
      isNaira: true,
    },
    {
      label: "Withdrawn",
      icon: "/novaxcape/dollar.png",
      value: formatCurrency((totalEarnings || 0) - (balance || 0)),
      badge: "↑ 2.0%",
      isNaira: true,
    },
  ];

  const transactions = useMemo(() => {
    const walletTransactions = getWalletTransactions(wallet);
    return withdrawals.length > 0 ? withdrawals : walletTransactions;
  }, [wallet, withdrawals]);

  // ✅ Log transactions when they change
  useEffect(() => {
    console.log("📊 Transactions in state:", transactions);
    console.log("📊 Transaction count:", transactions.length);
  }, [transactions]);

  const formatTransactionDate = (dateValue) => {
    if (!dateValue) return "Date unavailable";

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

    return parsedDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTransactionTitle = (transaction) =>
    transaction.title ||
    transaction.description ||
    transaction.narration ||
    transaction.type ||
    transaction.transactionType ||
    transaction.purpose ||
    (transaction.bankName ? `Withdrawal to ${transaction.bankName}` : "") ||
    "Wallet transaction";

  const getTransactionAmount = (transaction) =>
    transaction.amount ||
    transaction.value ||
    transaction.total ||
    transaction.payoutAmount ||
    0;

  const getTransactionStatus = (transaction) =>
    transaction.status || transaction.paymentStatus || "Completed";

  const isWithdrawalTransaction = (transaction) =>
    Boolean(
      transaction.bankName ||
        transaction.bankCode ||
        transaction.providerReference ||
        transaction.walletId,
    );

  // Show loading state
  if (loading) {
    return (
      <div className="wallet-page">
        <div className="wallet-loading">
          <div className="spinner"></div>
          <p>Loading wallet...</p>
        </div>
      </div>
    );
  }

  // Show error state with friendly message and action
  if (error) {
    const isNoTouristError =
      error.includes("tourist centre") ||
      error.includes("No tourist centre is linked");

    return (
      <div className="wallet-page">
        <div className="wallet-error">
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🏦</div>
            <h2 style={{ color: "#333", marginBottom: "10px" }}>
              {isNoTouristError ? "No Tourist Centre Found" : "Wallet Error"}
            </h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              {isNoTouristError
                ? "You need to create a tourist centre first before you can access your wallet. Please click the button below to get started."
                : error}
            </p>
            {isNoTouristError && (
              <button
                onClick={() => (window.location.href = "/vendor/create-centre")}
                style={{
                  padding: "12px 30px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Create Tourist Centre
              </button>
            )}
            {!isNoTouristError && (
              <button
                onClick={fetchWalletData}
                style={{
                  padding: "12px 30px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Check if wallet data exists
  if (!wallet) {
    return (
      <div className="wallet-page">
        <div className="wallet-empty">
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>💰</div>
            <h2 style={{ color: "#333", marginBottom: "10px" }}>
              No Wallet Found
            </h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Please create a tourist centre to start earning.
            </p>
            <button
              onClick={() => (window.location.href = "/vendor/create-centre")}
              style={{
                padding: "12px 30px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Create Tourist Centre
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-page">
      <div className="wallet-stats-grid">
        {statsCards.map((card, index) => (
          <div className="wallet-stat-card" key={index}>
            <div className="wallet-stat-card__header">
              <span className="wallet-stat-card__label">{card.label}</span>
              <img
                src={card.icon}
                alt={card.label}
                className="wallet-stat-card__icon"
              />
            </div>
            <div className="wallet-stat-card__value-row">
              <span className="wallet-stat-card__value">{card.value}</span>
              <span className="wallet-stat-card__badge">{card.badge}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="wallet-withdraw-row">
        <div className="wallet-withdraw-input">
          <input
            type="number"
            placeholder="Enter amount to withdraw"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="wallet-withdraw-field"
            min="0"
            step="100"
          />
          <button
            className="wallet-withdraw-btn"
            onClick={handleWithdraw}
            disabled={
              withdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0
            }
          >
            {withdrawing ? (
              <>
                <span className="spinner-small"></span> Withdrawing...
              </>
            ) : (
              "Withdraw"
            )}
          </button>
        </div>
      </div>

      <div className="wallet-transactions-panel">
        <h3 className="wallet-transactions-title">Transaction History</h3>
        <div className="wallet-transactions">
          {withdrawalsLoading ? (
            <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
              Loading withdrawal history...
            </p>
          ) : withdrawalsError ? (
            <p style={{ textAlign: "center", padding: "20px", color: "#d92d20" }}>
              {withdrawalsError}
            </p>
          ) : transactions && transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <div
                className="wallet-tx-card"
                key={transaction.id || transaction._id || index}
              >
                <div className="wallet-tx-card__left">
                  <div className="wallet-tx-card__icon-wrap">
                    <span className="wallet-tx-card__dollar-icon">₦</span>
                  </div>
                  <div className="wallet-tx-card__info">
                    <p className="wallet-tx-card__title">
                      {getTransactionTitle(transaction)}
                    </p>
                    <p className="wallet-tx-card__date">
                      {formatTransactionDate(
                        transaction.createdAt ||
                          transaction.date ||
                          transaction.updatedAt ||
                          transaction.timestamp,
                      )}
                    </p>
                  </div>
                </div>
                <div className="wallet-tx-card__right">
                  <p
                    className="wallet-tx-card__amount"
                    style={{
                      color: isWithdrawalTransaction(transaction)
                        ? "#dc3545"
                        : "#28a745",
                    }}
                  >
                    {isWithdrawalTransaction(transaction)
                      ? "-"
                      : getTransactionAmount(transaction) > 0
                      ? "+"
                      : ""}
                    {formatCurrency(getTransactionAmount(transaction))}
                  </p>
                  <span
                    className={`wallet-tx-card__status ${
                      getTransactionStatus(transaction).toLowerCase() === "completed" ||
                      getTransactionStatus(transaction).toLowerCase() === "success" ||
                      getTransactionStatus(transaction).toLowerCase() === "successful"
                        ? "status-completed"
                        : getTransactionStatus(transaction).toLowerCase() === "pending" ||
                          getTransactionStatus(transaction).toLowerCase() === "processing"
                        ? "status-pending"
                        : "status-failed"
                    }`}
                  >
                    {getTransactionStatus(transaction)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              <p style={{ color: "#666", fontSize: "16px" }}>
                No transactions yet
              </p>
              <p style={{ color: "#999", fontSize: "14px" }}>
                Your transaction history will appear here once you start earning.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
