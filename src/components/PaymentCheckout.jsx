import React, { useState, useEffect } from 'react';
import './css/PaymentCheckout.css';
import { LuShield } from 'react-icons/lu';
import { CiCalendar } from "react-icons/ci";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { initializePayment, getInstallmentPaymentStatus } from '../redox/apiSlice';

const decodeJwtPayload = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalizedPayload));
  } catch (error) {
    console.warn("Unable to decode auth token payload:", error);
    return null;
  }
};

const getEntityId = (value) =>
  value?.id ||
  value?._id ||
  value?.clientId ||
  value?.ClientId ||
  value?.userId ||
  value?.UserId ||
  null;

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const params = useParams();
  const bookingId = params.bookingId || params.touristId;
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { loggedInUser, userToken } = useSelector((state) => state.auth);
  const { paymentLoading, paymentError, paymentData } = useSelector((state) => state.api);

  const storedBookingState = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem("pendingBookingState") || "null");
      return stored?.bookingId === bookingId ? stored : {};
    } catch (error) {
      console.error("Error reading pending booking state:", error);
      return {};
    }
  })();

  const bookingData = location.state || storedBookingState || {};
  const isInstallment = bookingData.isInstallment || false;
  const totalAmount = bookingData.amount || bookingData.totalAmount || 0;
  const subtotal = bookingData.subtotal || 0;
  const serviceFee = bookingData.serviceFee || 0;
  const centreDetails = bookingData.centreDetails || {};
  const packageDetails = bookingData.packageDetails || {};

  const authToken =
    userToken ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("token");
  const tokenPayload = decodeJwtPayload(authToken);
  const clientId =
    getEntityId(loggedInUser) ||
    bookingData.clientId ||
    localStorage.getItem('clientId') ||
    getEntityId(tokenPayload);

  console.log("📄 PaymentCheckout - Mounted");
  console.log("📄 bookingId:", bookingId);
  console.log("📄 isInstallment:", isInstallment);
  console.log("📄 totalAmount:", totalAmount);

  // ✅ Fetch installment status if this is an installment booking
  useEffect(() => {
    if (bookingId && isInstallment) {
      dispatch(getInstallmentPaymentStatus(bookingId));
    }
  }, [dispatch, bookingId, isInstallment]);

  // Installment data from API: { data: { totalInstallments, amountPerInstallment, installmentsPaid, ... } }
  const installmentStatus = isInstallment ? (paymentData || {}) : null;
  const totalInstallments = installmentStatus?.totalInstallments || 2;
  const amountPerInstallment = installmentStatus?.amountPerInstallment || Math.ceil(totalAmount / totalInstallments);
  const installmentsPaid = installmentStatus?.installmentsPaid || 0;

  const plans = isInstallment ? [
    {
      id: `installment-${totalInstallments}`,
      totalInstallments,
      installmentAmount: amountPerInstallment,
      installmentsPaid,
    }
  ] : [];

  useEffect(() => {
    if (isInstallment && plans.length === 1 && !selectedPlanId) {
      setSelectedPlanId(plans[0].id);
      setSelectedPlan(plans[0]);
    }
  }, [isInstallment, plans.length]);

  // ✅ Auto-initialize payment for non-installment bookings
  useEffect(() => {
    if (bookingId && !isInstallment && !paymentInitialized && !loading) {
      handleContinueToPayment();
    }
  }, [bookingId, isInstallment]);

  const formatNaira = (amount) => {
    if (!amount) return '₦0';
    return `₦${Number(amount).toLocaleString('en-NG')}`;
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlanId(planId);
    const plan = plans.find(p => p.id === planId);
    setSelectedPlan(plan);
  };

  // ✅ FIXED: Only pass bookingId — no paymentData body
  // ✅ FIXED: Correct redirect URL path — result.data.data.checkout_url
  const handleContinueToPayment = async () => {
    if (isInstallment && !selectedPlanId) {
      Swal.fire({
        icon: 'warning',
        title: 'Select a Plan',
        text: 'Please select an installment plan to continue.',
        confirmButtonColor: '#ff6b35',
      });
      return;
    }

    if (!bookingId) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Not Found',
        text: 'Invalid booking. Please try again.',
        confirmButtonColor: '#ff6b35',
      });
      return;
    }

    if (!authToken) {
      Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'Please log in again to continue.',
        confirmButtonColor: '#ff6b35',
      });
      navigate('/signin');
      return;
    }

    setLoading(true);

    try {
      console.log("💳 Initializing payment for bookingId:", bookingId);

      // ✅ No body — backend reads everything from booking record
      const result = await dispatch(initializePayment({ bookingId })).unwrap();

      console.log("✅ Payment initialized:", result);
      console.log("✅ Full response:", JSON.stringify(result, null, 2));

      setPaymentInitialized(true);

      // ✅ FIXED: API returns { message, data: { status, message, data: { reference, checkout_url } } }
      const redirectUrl =
        result?.data?.data?.checkout_url ||
        result?.data?.data?.redirect_url ||
        result?.data?.checkout_url ||
        result?.data?.redirect_url ||
        result?.data?.authorization_url ||
        result?.checkout_url ||
        result?.redirect_url;

      const reference =
        result?.data?.data?.reference ||
        result?.data?.reference ||
        result?.reference;

      const status = result?.data?.status || result?.status;

      console.log("🔗 redirectUrl:", redirectUrl);
      console.log("🔗 reference:", reference);

      if (redirectUrl && redirectUrl.startsWith('http')) {
        console.log("🔄 Redirecting to Korapay:", redirectUrl);

        await Swal.fire({
          icon: 'success',
          title: 'Redirecting to Payment Gateway',
          text: 'You will be redirected to Korapay to complete your payment.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        window.location.href = redirectUrl;

      } else if (reference) {
        Swal.fire({
          icon: 'info',
          title: 'Payment Initiated',
          html: `
            <p>Your payment has been initiated.</p>
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>Status:</strong> ${status || 'Pending'}</p>
            <p>Please check your email for payment instructions.</p>
          `,
          confirmButtonColor: '#ff6b35',
        }).then(() => {
          navigate(`/booking-confirmation/${bookingId}`, {
            state: { bookingId, amount: totalAmount, reference, centreDetails, packageDetails }
          });
        });

      } else {
        console.warn("⚠️ No redirect_url or reference in response:", JSON.stringify(result, null, 2));

        Swal.fire({
          icon: 'warning',
          title: 'Unexpected Response',
          text: 'Payment was processed but no redirect link was returned. Please contact support.',
          confirmButtonColor: '#ff6b35',
        }).then(() => {
          navigate('/my-bookings');
        });
      }

    } catch (error) {
      console.error("❌ Payment error:", error);

      let errorMessage = 'Unable to process payment. Please try again.';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: errorMessage,
        confirmButtonColor: '#ff6b35',
        confirmButtonText: 'Try Again',
      });
    } finally {
      setLoading(false);
    }
  };

  // Amount due today
  const amountDueToday = isInstallment && selectedPlan
    ? selectedPlan.installmentAmount
    : totalAmount;

  // Loading / auto-initializing for non-installment
  if ((loading || paymentLoading) && !isInstallment) {
    return (
      <div className="payment-page-wrapper">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: '#666' }}>Initializing payment...</p>
        </div>
      </div>
    );
  }

  // Error state for non-installment
  if (paymentError && !loading && !isInstallment) {
    return (
      <div className="payment-page-wrapper">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>Payment Error</h2>
          <p style={{ color: 'red', margin: '16px 0' }}>{paymentError}</p>
          <button className="checkout-submit-btn" onClick={handleContinueToPayment} style={{ marginBottom: '12px' }}>
            Retry Payment
          </button>
          <button className="back-nav-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
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
        <p className="main-subtitle">
          {isInstallment
            ? 'Choose your payment plan and complete your booking'
            : 'Complete your payment to confirm your booking'
          }
        </p>
      </div>

      {/* Installment Banner */}
      {isInstallment && (
        <div className="installment-banner-container">
          <div className="installment-banner-card">
            <div className="banner-icon-box">
              <CiCalendar size={28} />
            </div>
            <h2 className="banner-title">Installment Payment</h2>
            <p className="banner-subtitle">Split payment into smaller amounts</p>
            <span className="banner-badge">Flexible Plan Available</span>
            {installmentStatus && (
              <span className="banner-badge">
                {installmentsPaid} of {totalInstallments} paid
              </span>
            )}
          </div>
        </div>
      )}

      <div className="payment-layout-container">

        {/* Plan Selector — installment only */}
        {isInstallment && (
          <div className="plan-selector-card">
            <h3 className="card-section-heading">Choose Installment Plan</h3>

            <div className="plans-list-wrapper">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`plan-option-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => handlePlanSelect(plan.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="plan-left-meta">
                      <span className="plan-duration-title">{plan.totalInstallments} Installments</span>
                      <span className="plan-interval-subtitle">
                        {plan.installmentsPaid} of {plan.totalInstallments} paid
                      </span>
                    </div>
                    <div className="plan-right-price">
                      <span className="plan-price-value">{formatNaira(plan.installmentAmount)}</span>
                      <span className="plan-price-label">Per installment</span>
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
                {installmentsPaid === 0
                  ? 'First installment due today. The remaining installment will be paid separately.'
                  : `You have paid ${installmentsPaid} of ${totalInstallments} installments. Next payment due now.`
                }
              </p>
            </div>
          </div>
        )}

        {/* Booking Summary Card */}
        <div className="booking-summary-card">
          <h3 className="summary-card-title">Booking Summary</h3>

          {/* Centre & Package Info */}
          {(centreDetails?.centreName || centreDetails?.name) && (
            <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
              <p style={{ fontWeight: 600, marginBottom: '4px' }}>
                {centreDetails.centreName || centreDetails.name}
              </p>
              {(centreDetails.city || centreDetails.state) && (
                <p style={{ color: '#666', fontSize: '14px' }}>
                  {centreDetails.city}, {centreDetails.state}
                </p>
              )}
              {(packageDetails?.packageName || packageDetails?.name) && (
                <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
                  Package: {packageDetails.packageName || packageDetails.name}
                </p>
              )}
            </div>
          )}

          {/* Ticket breakdown */}
          {bookingData.ticketDetails && bookingData.ticketDetails.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              {bookingData.ticketDetails.map((ticket, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span className="summary-row-label">
                    {ticket.ticketLabel || ticket.ticketType} x {ticket.quantity}
                  </span>
                  <span className="summary-row-val">
                    {formatNaira(ticket.price * ticket.quantity)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="summary-breakdown-table">
            <div className="summary-data-row">
              <span className="summary-row-label">Subtotal</span>
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
            {isInstallment && selectedPlan && (
              <p className="toast-sub-caption">
                Due today — installment {installmentsPaid + 1} of {totalInstallments}
              </p>
            )}
          </div>

          <div className="due-date-row-block">
            <span className="due-main-heading">Due Today</span>
            <span className="due-main-amount">{formatNaira(amountDueToday)}</span>
          </div>

          <button
            className="checkout-submit-btn"
            onClick={handleContinueToPayment}
            disabled={loading || paymentLoading || (isInstallment && !selectedPlanId)}
          >
            {loading || paymentLoading ? 'Processing...' :
              isInstallment ? 'Continue To Payment' : 'Pay Now'}
          </button>

          {paymentError && (
            <p style={{ color: 'red', textAlign: 'center', marginTop: '12px', fontSize: '14px' }}>
              {paymentError}
            </p>
          )}

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
