import React, { useState } from 'react';
import './css/PaymentCheckout.css';
import { LuShield } from 'react-icons/lu';
import { CiCalendar } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createPaymentPlan } from '../redox/apiSlice'; // adjust path if needed

const PLANS = [
  { durationInMonths: 1, frequency: 'weekly',  label: '1 Month',  interval: 'Per week',  price: '₦4,667' },
  { durationInMonths: 2, frequency: 'monthly', label: '2 Month',  interval: 'Per month', price: '₦3,667' },
  { durationInMonths: 3, frequency: 'monthly', label: '3 Month',  interval: 'Per month', price: '₦2,167' },
];

const PaymentCheckout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { packageId } = useParams(); // gets packageId from the URL

  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]); // default: 2 Month

  const isLoading = useSelector((state) => state.api.paymentPlanLoading);
  const error = useSelector((state) => state.api.paymentPlanError);

  const handleContinue = async () => {
    const result = await dispatch(
      createPaymentPlan({
        packageId,
        planData: {
          durationInMonths: selectedPlan.durationInMonths,
          frequency: selectedPlan.frequency,
          currency: 'NGN',
        },
      })
    );

    if (createPaymentPlan.fulfilled.match(result)) {
      // Plan created! Navigate to next step or show success
      console.log('Payment plan created:', result.payload);
      // e.g. navigate('/booking-confirmation');
    }
  };

  return (
    <div className="payment-page-wrapper">

      <div className="back-btn-container">
        <button className="back-nav-btn" onClick={() => navigate(-1)}>Back</button>
      </div>

      <div className="payment-page-header">
        <h1 className="main-title">Payment</h1>
        <p className="main-subtitle">Choose your payment plan and complete your booking</p>
      </div>

      <div className="installment-banner-container">
        <div className="installment-banner-card">
          <div className="banner-icon-box">
            <CiCalendar size={28} />
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
            {PLANS.map((plan) => (
              <div
                key={plan.durationInMonths}
                className={`plan-option-row ${selectedPlan.durationInMonths === plan.durationInMonths ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan)}
                style={{ cursor: 'pointer' }}
              >
                <div className="plan-left-meta">
                  <span className="plan-duration-title">{plan.label}</span>
                  <span className="plan-interval-subtitle">Monthly payment</span>
                </div>
                <div className="plan-right-price">
                  <span className="plan-price-value">{plan.price}</span>
                  <span className="plan-price-label">{plan.interval}</span>
                </div>
              </div>
            ))}
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
              <span className="toast-val-price">{selectedPlan.price}</span>
            </div>
            <p className="toast-sub-caption">Due today - {selectedPlan.label}</p>
          </div>

          <div className="due-date-row-block">
            <span className="due-main-heading">Due date</span>
            <span className="due-main-amount">{selectedPlan.price}</span>
          </div>

          {error && (
            <p style={{ color: 'red', paddingLeft: 35, paddingRight: 35, fontSize: 13 }}>
              {error}
            </p>
          )}

          <button
            className="checkout-submit-btn"
            onClick={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue To Payment'}
          </button>

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