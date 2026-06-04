import React from 'react';
import './css/PaymentCheckout.css';
import { LuShield } from 'react-icons/lu';
import { CiCalendar } from "react-icons/ci";

const PaymentCheckout = () => {
  return (
    <div className="payment-page-wrapper">
      
      <div className="back-btn-container">
        <button className="back-nav-btn">Back</button>
      </div>

      <div className="payment-page-header">
        <h1 className="main-title">Payment</h1>
        <p className="main-subtitle">Choose your payment plan and complete your booking</p>
      </div>

      <div className="installment-banner-container">
        <div className="installment-banner-card">
          <div className="banner-icon-box">
            <CiCalendar  size={28}/>
          </div>
          <h2 className="banner-title">Installment Payment</h2>
          <p className="banner-subtitle">Split payment into smaller amount</p>
          <span className="banner-badge">Flexible plan Available</span>
        </div>
      </div>

      <div className="payment-layout-container">
        
        <div className="plan-selector-card">
          <h3 className="card-section-heading">Choose Installment Plan</h3>

          <div className="plans-list-wrapper">
            
            <div className="plan-option-row">
              <div className="plan-left-meta">
                <span className="plan-duration-title">1 Month</span>
                <span className="plan-interval-subtitle">Monthly payment</span>
              </div>
              <div className="plan-right-price">
                <span className="plan-price-value">₦4,667</span>
                <span className="plan-price-label">Per week</span>
              </div>
            </div>

            <div className="plan-option-row selected">
              <div className="plan-left-meta">
                <span className="plan-duration-title">2 Month</span>
                <span className="plan-interval-subtitle">Monthly payment</span>
              </div>
              <div className="plan-right-price">
                <span className="plan-price-value">₦3,667</span>
                <span className="plan-price-label">Per month</span>
              </div>
            </div>

            <div className="plan-option-row">
              <div className="plan-left-meta">
                <span className="plan-duration-title">3 Month</span>
                <span className="plan-interval-subtitle">Monthly payment</span>
              </div>
              <div className="plan-right-price">
                <span className="plan-price-value">₦2,167</span>
                <span className="plan-price-label">Per month</span>
              </div>
            </div>

          </div>

          <div className="plan-info-alert-box">
            <div className="info-alert-header">
              <LuShield className="info-alert-icon" />
              <span className="info-alert-title">Installment plan detail</span>
            </div>
            <p className="info-alert-text">
              First payment due today. Subsequent payments will be automatically charged monthly.
            </p>
          </div>
        </div>

        <div className="booking-summary-card">
          <h3 className="summary-card-title">Booking Summary</h3>

          <div className="summary-breakdown-table">
            <div className="summary-data-row">
              <span className="summary-row-label">Ticket total</span>
              <span className="summary-row-val">₦11,000</span>
            </div>
            <div className="summary-data-row">
              <span className="summary-row-label">Interest</span>
              <span className="summary-row-val">₦1000</span>
            </div>
          </div>

          <div className="summary-highlight-toast">
            <div className="toast-row-line">
              <span className="toast-label-txt">Ticket total</span>
              <span className="toast-val-price">₦3,667</span>
            </div>
            <p className="toast-sub-caption">Due today - 2 Months</p>
          </div>

          <div className="due-date-row-block">
            <span className="due-main-heading">Due date</span>
            <span className="due-main-amount">₦3,667</span>
          </div>

          <button className="checkout-submit-btn">Continue To Payment</button>

          <div className="security-notice-row">
            <LuShield className="security-shield-icon" />
            <span className="security-notice-txt">Your payment is encrypted and secure.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentCheckout;
