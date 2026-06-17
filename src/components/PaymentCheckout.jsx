import React, { useState, useEffect } from 'react';
import './css/PaymentCheckout.css';
import { LuShield } from 'react-icons/lu';
import { CiCalendar } from "react-icons/ci";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getPaymentPlans, createBooking } from '../redox/apiSlice';

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const { touristId, packageId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const { paymentPlans, paymentPlanLoading } = useSelector((state) => state.api);
  const { bookingLoading } = useSelector((state) => state.api);
  const { loggedInUser } = useSelector((state) => state.auth);

  // Get booking data from location state
  const bookingData = location.state || {};
  const totalAmount = bookingData.totalAmount || 0;
  const subtotal = bookingData.subtotal || 0;
  const serviceFee = bookingData.serviceFee || 0;
  const centreDetails = bookingData.centreDetails || {};
  const packageDetails = bookingData.packageDetails || {};
  const clientId = bookingData.clientId || loggedInUser?.id || localStorage.getItem('clientId');
  const date = bookingData.date || '';
  const ticketDetails = bookingData.ticketDetails || [];

  console.log("📄 PaymentCheckout - Mounted");
  console.log("📄 touristId:", touristId);
  console.log("📄 packageId:", packageId);
  console.log("📄 bookingData:", bookingData);
  console.log("📄 clientId:", clientId);
  console.log("📄 date:", date);

  // Fetch payment plans when component mounts
  useEffect(() => {
    if (packageId) {
      dispatch(getPaymentPlans(packageId));
    } else {
      console.warn("⚠️ No packageId found, using static data");
    }
  }, [dispatch, packageId]);

  // Format currency
  const formatNaira = (amount) => {
    if (!amount) return '₦0';
    return `₦${Number(amount).toLocaleString('en-NG')}`;
  };

  // Calculate installment amounts based on plan
  const calculateInstallment = (plan) => {
    if (!plan) return 0;
    const total = Number(totalAmount) || 0;
    const months = plan.durationInMonths || 1;
    return Math.ceil(total / months);
  };

  // Handle plan selection
  const handlePlanSelect = (planId) => {
    setSelectedPlanId(planId);
    const plan = plans.find(p => p.id === planId);
    setSelectedPlan(plan);
  };

  // Handle continue to payment - create booking first then go to payment
  const handleContinueToPayment = async () => {
    if (!selectedPlanId) {
      Swal.fire({
        icon: 'warning',
        title: 'Select a Plan',
        text: 'Please select an installment plan to continue.',
        confirmButtonColor: '#ff6b35',
      });
      return;
    }

    if (!clientId) {
      Swal.fire({
        icon: 'error',
        title: 'User Not Found',
        text: 'Please log in again to continue.',
        confirmButtonColor: '#ff6b35',
      });
      navigate('/signin');
      return;
    }

    if (!date) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Date',
        text: 'Please select a visit date.',
        confirmButtonColor: '#ff6b35',
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ Create booking with installment plan
      const bookingDataPayload = {
        date: date,
        numberOfPeople: bookingData.numberOfPeople || 1,
        specialRequests: "",
        ticketDetails: ticketDetails,
        totalAmount: totalAmount,
        clientId: clientId,
        isInstallment: true,
        paymentPlanId: selectedPlanId,
        paymentPlan: selectedPlan,
      };

      console.log("📄 Creating booking with installment plan:", bookingDataPayload);

      const result = await dispatch(createBooking({
        touristId: touristId,
        packageId: packageId,
        bookingData: bookingDataPayload,
      })).unwrap();

      console.log("✅ Booking created:", result);

      if (!result) {
        throw new Error('No response from server');
      }

      const bookingId = result?.data?.id || 
                        result?.booking?.id || 
                        result?.id ||
                        result?.data?.bookingId ||
                        result?.bookingId;

      console.log("📄 Booking ID:", bookingId);

      if (!bookingId) {
        throw new Error('Could not retrieve booking ID from server response');
      }

      // ✅ Navigate to payment with the booking ID
      navigate(`/payment/${bookingId}`, {
        state: {
          bookingId: bookingId,
          amount: totalAmount,
          selectedPlanId: selectedPlanId,
          selectedPlan: selectedPlan,
          bookingDetails: result,
          centreDetails: centreDetails,
          packageDetails: packageDetails,
          isInstallment: true,
        }
      });

    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: error?.message || 'Unable to process payment. Please try again.',
        confirmButtonColor: '#ff6b35',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get plans from API or use static fallback
  const plans = paymentPlans && paymentPlans.length > 0 ? paymentPlans : [
    { id: '1', durationInMonths: 1, frequency: 'monthly', installmentAmount: Math.ceil(totalAmount / 1) },
    { id: '2', durationInMonths: 2, frequency: 'monthly', installmentAmount: Math.ceil(totalAmount / 2) },
    { id: '3', durationInMonths: 3, frequency: 'monthly', installmentAmount: Math.ceil(totalAmount / 3) },
  ];

  // Render loading state
  if (paymentPlanLoading) {
    return (
      <div className="payment-page-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading payment plans...</p>
        </div>
      </div>
    );
  }

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
            <CiCalendar size={28}/>
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
            {plans.map((plan) => {
              const installmentAmount = plan.installmentAmount || calculateInstallment(plan);
              const isSelected = selectedPlanId === plan.id;
              const frequency = plan.frequency || 'monthly';
              const duration = plan.durationInMonths || 1;
              
              return (
                <div 
                  key={plan.id}
                  className={`plan-option-row ${isSelected ? 'selected' : ''}`}
                  onClick={() => handlePlanSelect(plan.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="plan-left-meta">
                    <span className="plan-duration-title">{duration} Month{duration > 1 ? 's' : ''}</span>
                    <span className="plan-interval-subtitle">{frequency} payment</span>
                  </div>
                  <div className="plan-right-price">
                    <span className="plan-price-value">{formatNaira(installmentAmount)}</span>
                    <span className="plan-price-label">Per {frequency}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="plan-info-alert-box">
            <div className="info-alert-header">
              <LuShield className="info-alert-icon" />
              <span className="info-alert-title">Installment plan detail</span>
            </div>
            <p className="info-alert-text">
              First payment due today. Subsequent payments will be automatically charged {selectedPlan?.frequency || 'monthly'}.
            </p>
          </div>
        </div>

        <div className="booking-summary-card">
          <h3 className="summary-card-title">Booking Summary</h3>

          <div className="summary-breakdown-table">
            <div className="summary-data-row">
              <span className="summary-row-label">Ticket total</span>
              <span className="summary-row-val">{formatNaira(subtotal)}</span>
            </div>
            <div className="summary-data-row">
              <span className="summary-row-label">Service fee</span>
              <span className="summary-row-val">{formatNaira(serviceFee)}</span>
            </div>
          </div>

          <div className="summary-highlight-toast">
            <div className="toast-row-line">
              <span className="toast-label-txt">Total</span>
              <span className="toast-val-price">{formatNaira(totalAmount)}</span>
            </div>
            {selectedPlan && (
              <p className="toast-sub-caption">
                Due today - {selectedPlan.durationInMonths} Month{selectedPlan.durationInMonths > 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="due-date-row-block">
            <span className="due-main-heading">Due today</span>
            <span className="due-main-amount">
              {selectedPlan 
                ? formatNaira(selectedPlan.installmentAmount || calculateInstallment(selectedPlan))
                : formatNaira(totalAmount)
              }
            </span>
          </div>

          <button 
            className="checkout-submit-btn" 
            onClick={handleContinueToPayment}
            disabled={loading || bookingLoading}
          >
            {loading || bookingLoading ? 'Processing...' : 'Continue To Payment'}
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