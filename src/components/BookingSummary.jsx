import React from "react";
import "./css/BookingSummary.css";

const BookingSummary= () => {
  return (
    <div className="bp-page">
     
      <div className="bp-header">
        <h1 className="bp-title">Complete Your booking</h1>
        <p className="bp-subtitle">Just a few more step to your booking</p>
      </div>

      <div className="bp-layout">
        
        <div className="bp-card">

          {/* Date Section */}
          <div className="bp-section">
            <h2 className="bp-section-title">Select Visit Date</h2>
            <div className="bp-date-input-wrapper">
              <input
                type="text"
                className="bp-date-input"
                placeholder="mm/dd/yyyy"
                readOnly
              />
              <span className="bp-calendar-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="3" width="16" height="15" rx="2" stroke="#271A13" strokeWidth="1.5" />
                  <path d="M2 7h16" stroke="#271A13" strokeWidth="1.5" />
                  <path d="M6 1v4M14 1v4" stroke="#271A13" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </div>

          {/* Ticket Section */}
          <div className="bp-section">
            <h2 className="bp-section-title">Select Ticket</h2>
            <div className="bp-tickets">

              {/* Adult */}
              <div className="bp-ticket-row">
                <div className="bp-ticket-info">
                  <span className="bp-ticket-label">Adult</span>
                  <span className="bp-ticket-desc">Ages 18+ - N2,500</span>
                </div>
                <div className="bp-counter">
                  <button className="bp-counter-btn">
                    <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                      <path d="M1 1h12" stroke="#271A13" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span className="bp-counter-value">1</span>
                  <button className="bp-counter-btn">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v12M1 7h12" stroke="#271A13" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Child */}
              <div className="bp-ticket-row">
                <div className="bp-ticket-info">
                  <span className="bp-ticket-label">Child</span>
                  <span className="bp-ticket-desc">Ages 5-7 - N1,500</span>
                </div>
                <div className="bp-counter">
                  <button className="bp-counter-btn">
                    <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                      <path d="M1 1h12" stroke="#271A13" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span className="bp-counter-value">1</span>
                  <button className="bp-counter-btn">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v12M1 7h12" stroke="#271A13" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Family Pack */}
              <div className="bp-ticket-row">
                <div className="bp-ticket-info">
                  <span className="bp-ticket-label">Family pack</span>
                  <span className="bp-ticket-desc">2 Adults + 2 Childrens - N7,000</span>
                </div>
                <div className="bp-counter">
                  <button className="bp-counter-btn">
                    <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                      <path d="M1 1h12" stroke="#271A13" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span className="bp-counter-value">1</span>
                  <button className="bp-counter-btn">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v12M1 7h12" stroke="#271A13" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Card — Booking Summary */}
        <div className="bp-card bp-right-card">
          <h2 className="bp-summary-title">Booking Summary</h2>

          <div className="bp-summary-items">

            {/* Adult */}
            <div className="bp-summary-row">
              <div className="bp-summary-item-info">
                <span className="bp-summary-item-name">Adult x1</span>
                <span className="bp-summary-item-price-desc">₦2,500 each</span>
              </div>
              <span className="bp-summary-item-total">₦2,500</span>
            </div>

            {/* Child */}
            <div className="bp-summary-row">
              <div className="bp-summary-item-info">
                <span className="bp-summary-item-name">Child x1</span>
                <span className="bp-summary-item-price-desc">₦1,500 each</span>
              </div>
              <span className="bp-summary-item-total">₦1,500</span>
            </div>

            {/* Family Pack */}
            <div className="bp-summary-row">
              <div className="bp-summary-item-info">
                <span className="bp-summary-item-name">Family Pack x1</span>
                <span className="bp-summary-item-price-desc">₦7,000 each</span>
              </div>
              <span className="bp-summary-item-total">₦7,000</span>
            </div>

          </div>

          <div className="bp-summary-divider" />

          <div className="bp-summary-fees">
            <div className="bp-fee-row">
              <span className="bp-fee-label">Subtotal</span>
              <span className="bp-fee-value">₦11,000</span>
            </div>
            <div className="bp-fee-row">
              <span className="bp-fee-label">Service fee</span>
              <span className="bp-fee-value">₦500</span>
            </div>
          </div>

          <div className="bp-summary-divider" />

          <div className="bp-total-row">
            <span className="bp-total-label">Total</span>
            <span className="bp-total-value">₦11,500</span>
          </div>

          <button className="bp-cta-btn">Continue To Payment</button>

          <p className="bp-installment">
            Or <a href="#" className="bp-installment-link">Pay Instalmentally</a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default BookingSummary;