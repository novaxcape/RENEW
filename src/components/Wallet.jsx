// Wallet.jsx
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  // Handle specific error cases
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

const Wallet = () => {
  const dispatch = useDispatch();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  // Get wallet data from Redux
  const wallet = useSelector(selectWallet);
  const loading = useSelector(selectWalletLoading);
  const error = useSelector(selectWalletError);
  const balance = useSelector(selectWalletBalance);
  const totalEarnings = useSelector(selectWalletTotalEarnings);

  const { userToken, isAuthenticated } = useSelector((state) => state.auth);

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

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(logout());
          dispatch(fetchWalletFail("Session expired. Please login again."));
          return;
        }

        // Handle tourist not found specifically
        if (
          response.status === 404 &&
          data?.message?.toLowerCase().includes("tourist")
        ) {
          // Don't store error state, just show friendly message
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

      dispatch(fetchWalletSuccess(walletData));
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

  // Handle withdraw
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const touristId = getWalletTouristId(wallet) || getStoredTouristId();
    const token = getAuthToken(userToken);

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (amount > balance) {
      alert("Insufficient balance");
      return;
    }
    if (!touristId) {
      alert("Tourist centre not found. Please refresh or add a centre first.");
      return;
    }
    if (!token) {
      alert("Please login to withdraw funds");
      return;
    }

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

      alert(data.message || "Withdrawal initiated successfully");
      setWithdrawAmount("");

      dispatch(
        fetchWalletSuccess({
          ...(wallet || {}),
          balance: data.walletBalance ?? balance - amount,
        }),
      );
      fetchWalletData();
    } catch (error) {
      console.error("Withdrawal error:", error);
      alert(error.message || "Withdrawal failed");
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
    }).format(amount);
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
      label: "Available balance",
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

  // Show loading state
  if (loading) {
    return (
      <div className="wallet-page">
        <div className="wallet-loading">
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
          />
          <button
            className="wallet-withdraw-btn"
            onClick={handleWithdraw}
            disabled={
              withdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0
            }
          >
            {withdrawing ? "Withdrawing..." : "Withdraw"}
          </button>
        </div>
      </div>

      <div className="wallet-transactions-panel">
        <div className="wallet-transactions">
          {/* You can fetch and display transactions here */}
          <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            No transactions yet
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;