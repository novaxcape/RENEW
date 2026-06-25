// Wallet.jsx
import React, { useEffect, useState } from "react";
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

const API_URL = 'https://novaxcape.onrender.com/api/v1';

const Wallet = () => {
  const dispatch = useDispatch();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  // Get wallet data from Redux
  const wallet = useSelector(selectWallet);
  const loading = useSelector(selectWalletLoading);
  const error = useSelector(selectWalletError);
  const balance = useSelector(selectWalletBalance);
  const totalEarnings = useSelector(selectWalletTotalEarnings);
  
  const { userToken, isAuthenticated } = useSelector((state) => state.auth);

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      if (!isAuthenticated || !userToken) {
        dispatch(fetchWalletFail('Please login to view wallet'));
        return;
      }

      dispatch(fetchWalletStart());

      const response = await fetch(`${API_URL}/wallet`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(logout());
          dispatch(fetchWalletFail('Session expired. Please login again.'));
          return;
        }
        const errorData = await response.json();
        dispatch(fetchWalletFail(errorData.message || 'Failed to fetch wallet data'));
        return;
      }

      const data = await response.json();
      // The API returns: { message, data: { id, touristId, balance, totalEarnings, ... } }
      dispatch(fetchWalletSuccess(data.data));

    } catch (error) {
      console.error('Wallet fetch error:', error);
      dispatch(fetchWalletFail(error.message || 'Network error. Please check your connection.'));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWalletData();
    }
    return () => {
      dispatch(clearWalletError());
    };
  }, [dispatch, isAuthenticated]);

  // Handle withdraw
  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (parseFloat(withdrawAmount) > balance) {
      alert('Insufficient balance');
      return;
    }
    // TODO: Implement withdraw logic
    console.log('Withdrawing:', withdrawAmount);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Stats cards data from API
  const statsCards = [
    {
      label: "Total Earnings",
      icon: "/novaxcape/dollar.png",
      value: formatCurrency(totalEarnings),
      badge: "↑ 2.0%",
      isNaira: true,
    },
    {
      label: "Available balance",
      icon: "/novaxcape/dollar.png",
      value: formatCurrency(balance),
      badge: "↑ 2.0%",
      isNaira: true,
    },
    {
      label: "Withdrawn",
      icon: "/novaxcape/dollar.png",
      value: formatCurrency(totalEarnings - balance),
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

  // Show error state
  if (error) {
    return (
      <div className="wallet-page">
        <div className="wallet-error">
          <p style={{ color: 'red' }}>Error: {error}</p>
          <button onClick={fetchWalletData}>Retry</button>
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
              <img src={card.icon} alt={card.label} className="wallet-stat-card__icon" />
            </div>
            <div className="wallet-stat-card__value-row">
              <span className="wallet-stat-card__value">
                
                {card.value}
              </span>
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
            disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="wallet-transactions-panel">
        <div className="wallet-transactions">
          {/* You can fetch and display transactions here */}
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No transactions yet
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;      