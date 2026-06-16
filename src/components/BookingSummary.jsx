import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/BookingSummary.css";

const ticketTypes = [
  {
    id: "adult",
    label: "Adult",
    description: "Ages 18+ - N2,500",
    price: 2500,
  },
  {
    id: "child",
    label: "Child",
    description: "Ages 5-7 - N1,500",
    price: 1500,
  },
  {
    id: "family",
    label: "Family pack",
    description: "2 Adults + 2 Childrens - N7,000",
    price: 7000,
  },
];

const SERVICE_FEE = 500;

export default function BookingSummary() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [quantities, setQuantities] = useState({
    adult: 1,
    child: 1,
    family: 1,
  });

  const increment = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));

  const decrement = (id) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] - 1),
    }));

  const subtotal = ticketTypes.reduce(
    (sum, t) => sum + t.price * quantities[t.id],
    0
  );
  const total = subtotal + SERVICE_FEE;

  const formatNaira = (amount) => `₦${amount.toLocaleString("en-NG")}`;

  const summaryItems = ticketTypes.filter((t) => quantities[t.id] > 0);

  return (
    <div className="bp-page">
      <div className="bp-header">
        <h1 className="bp-title">Complete Your booking</h1>
        <p className="bp-subtitle">Just a few more step to your booking</p>
      </div>

      <div className="bp-layout">
        {/* Left Card */}
        <div className="bp-card bp-left-card">
          {/* Date Section */}
          <section className="bp-section">
            <h2 className="bp-section-title">Select Visit Date</h2>
            <div className="bp-date-input-wrapper">
              <input
                type="text"
                className="bp-date-input"
                placeholder="mm/dd/yyyy"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
              />
              <span className="bp-calendar-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect
                    x="2"
                    y="3"
                    width="16"
                    height="15"
                    rx="2"
                    stroke="#271A13"
                    strokeWidth="1.5"
                  />
                  <path d="M2 7h16" stroke="#271A13" strokeWidth="1.5" />
                  <path
                    d="M6 1v4M14 1v4"
                    stroke="#271A13"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
          </section>

          {/* Ticket Section */}
          <section className="bp-section">
            <h2 className="bp-section-title">Select Ticket</h2>
            <div className="bp-tickets">
              {ticketTypes.map((ticket) => (
                <div key={ticket.id} className="bp-ticket-row">
                  <div className="bp-ticket-info">
                    <span className="bp-ticket-label">{ticket.label}</span>
                    <span className="bp-ticket-desc">{ticket.description}</span>
                  </div>
                  <div className="bp-counter">
                    <button
                      className="bp-counter-btn"
                      onClick={() => decrement(ticket.id)}
                      aria-label={`Decrease ${ticket.label}`}
                    >
                      <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                        <path
                          d="M1 1h12"
                          stroke="#271A13"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <span className="bp-counter-value">
                      {quantities[ticket.id]}
                    </span>
                    <button
                      className="bp-counter-btn"
                      onClick={() => increment(ticket.id)}
                      aria-label={`Increase ${ticket.label}`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M7 1v12M1 7h12"
                          stroke="#271A13"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Card — Booking Summary */}
        <div className="bp-card bp-right-card">
          <h2 className="bp-summary-title">Booking Summary</h2>

          <div className="bp-summary-items">
            {summaryItems.map((t) => (
              <div key={t.id} className="bp-summary-row">
                <div className="bp-summary-item-info">
                  <span className="bp-summary-item-name">
                    {t.id === "family" ? "Family Pack" : t.label} x
                    {quantities[t.id]}
                  </span>
                  <span className="bp-summary-item-price-desc">
                    ₦{t.price.toLocaleString("en-NG")} each
                  </span>
                </div>
                <span className="bp-summary-item-total">
                  {formatNaira(t.price * quantities[t.id])}
                </span>
              </div>
            ))}
          </div>

          <div className="bp-summary-divider" />

          <div className="bp-summary-fees">
            <div className="bp-fee-row">
              <span className="bp-fee-label">Subtotal</span>
              <span className="bp-fee-value">{formatNaira(subtotal)}</span>
            </div>
            <div className="bp-fee-row">
              <span className="bp-fee-label">Service fee</span>
              <span className="bp-fee-value">{formatNaira(SERVICE_FEE)}</span>
            </div>
          </div>

          <div className="bp-summary-divider" />

          <div className="bp-total-row">
            <span className="bp-total-label">Total</span>
            <span className="bp-total-value">{formatNaira(total)}</span>
          </div>

          <button className="bp-cta-btn">Continue To Payment</button>

          <p className="bp-installment">
            Or{" "}
            <span
              className="bp-installment-link"
              onClick={() => navigate("/payment/instalment")}
              style={{ cursor: "pointer" }}
            >
              Pay Instalmentally
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}