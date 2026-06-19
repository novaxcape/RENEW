import React from "react";
import "./css/Wallet.css";

const statsCards = [
  
  {
    label: "Total Earnings",
    icon: "/novaxcape/dollar.png",
    value: "950,000",
    badge: "↑ 2.0%",
    badgeType: "orange",
    
    isNaira: true,
  },
  {
    label: "Available balance",
    icon: "/novaxcape/dollar.png",
    value: "150,500",
    badge: "↑ 2.0%",
    badgeType: "orange",
   
    isNaira: true,
  },
  {
    label: "Withdrawn",
    icon: "/novaxcape/dollar.png",
    value: "800,000",
    badge: "↑ 2.0%",
    badgeType: "orange",
    
    isNaira: true,
  },
];

const transactions = [
  {
    id: 1,
    title: "Withdrawal to Lekki Conservation Centre",
    date: "May 20,2026 -14:05 PM",
    amount: "200,000",
    status: "Successful",
  },
  {
    id: 2,
    title: "Withdrawal to Lekki Conservation Centre",
    date: "May 22,2026 -13:00 PM",
    amount: "200,000",
    status: "Successful",
  },
  {
    id: 3,
    title: "Withdrawal to Lekki Conservation Centre",
    date: "May 30,2026 -18:00 PM",
    amount: "200,000",
    status: "Successful",
  },
  {
    id: 4,
    title: "Withdrawal to Lekki Conservation Centre",
    date: "June 04,2026 -14:05 PM",
    amount: "200,000",
    status: "Successful",
  },
];

const Wallet = () => {
  return (
    <div className="wallet-page">
      <div className="wallet-stats-withdraw-row">
        <div className="wallet-stats-grid">
          {statsCards.map((card, index) => (
            <div className="wallet-stat-card" key={index}>
              <div className="wallet-stat-card__header">
                <span className="wallet-stat-card__label">{card.label}</span>
                <img src={card.icon} alt={card.label} className="wallet-stat-card__icon" />
              </div>
              <div className="wallet-stat-card__value-row">
                <span className="wallet-stat-card__value">
                  {card.isNaira && <span className="wallet-stat-card__naira">₦</span>}
                  {card.value}
                </span>
                <span className={`wallet-stat-card__badge wallet-stat-card__badge--${card.badgeType}`}>
                  {card.badge}
                </span>
              </div>
              <p className="wallet-stat-card__yesterday">{card.yesterday}</p>
            </div>
          ))}
        </div>

        <div className="wallet-withdraw-row">
          <button className="wallet-withdraw-btn">Withdraw</button>
        </div>
      </div>

      <div className="wallet-transactions">
        {transactions.map((tx) => (
          <div className="wallet-tx-card" key={tx.id}>
            <div className="wallet-tx-card__left">
              <div className="wallet-tx-card__icon-wrap">
                <span className="wallet-tx-card__dollar-icon">$</span>
              </div>
              <div className="wallet-tx-card__info">
                <p className="wallet-tx-card__title">{tx.title}</p>
                <p className="wallet-tx-card__date">{tx.date}</p>
              </div>
            </div>
            <div className="wallet-tx-card__right">
              <p className="wallet-tx-card__amount">₦ {tx.amount}</p>
              <span className="wallet-tx-card__status">{tx.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;