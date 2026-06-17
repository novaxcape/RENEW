import React, { useState, useEffect } from 'react';
import './css/PaymentCheckout.css';
import { LuShield } from 'react-icons/lu';
import { CiCalendar } from "react-icons/ci";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getPaymentPlans, initializePayment } from '../redox/apiSlice';

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  
  // ✅ Get state from Redux
  const { paymentPlans, paymentPlanLoading } = useSelector((state) => state.api);
  const { loggedInUser, userToken } = useSelector((state) => state.auth);
  const { paymentLoading, paymentError, paymentData } = useSelector((state) => state.api);

  // Get booking data from location state
  const bookingData = location.state || {};
  const totalAmount = bookingData.amount || bookingData.totalAmount || 0;
  const subtotal = bookingData.subtotal || 0;
  const serviceFee = bookingData.serviceFee || 0;
  const centreDetails = bookingData.centreDetails || {};
  const packageDetails = bookingData.packageDetails || {};
  const packageId = packageDetails?.id || bookingData.packageId;
  const clientId = loggedInUser?.id || localStorage.getItem('clientId');

  console.log("📄 PaymentCheckout - Mounted");
  console.log("📄 bookingId from URL:", bookingId);
  console.log("📄 bookingData:", bookingData);
  console.log("📄 totalAmount:", totalAmount);
  console.log("📄 isInstallment:", bookingData.isInstallment);

  // Fetch payment plans when component mounts (for installment)
  useEffect(() => {
    if (bookingData.isInstallment && packageId) {
      dispatch(getPaymentPlans(packageId));
    }
  }, [dispatch, packageId, bookingData.isInstallment]);

  // ✅ Auto-initialize payment for non-installment bookings
  useEffect(() => {
    if (bookingId && !bookingData.isInstallment && !paymentInitialized && !paymentLoading) {
      // Auto-init payment for regular bookings
      handleContinueToPayment(true);
    }
  }, [bookingId, bookingData.isInstallment, paymentInitialized, paymentLoading]);

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

  // ✅ Main handler for continue to payment using Redux thunk
  const handleContinueToPayment = async (autoInit = false) => {
    // For installment, validate plan selection
    if (bookingData.isInstallment && !autoInit) {
      if (!selectedPlanId) {
        Swal.fire({
          icon: 'warning',
          title: 'Select a Plan',
          text: 'Please select an installment plan to continue.',
          confirmButtonColor: '#ff6b35',
        });
        return;
      }
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

    setLoading(true);

    try {
      // ✅ Prepare payment data
      const paymentDataPayload = {
        amount: totalAmount,
        currency: 'NGN',
        // If installment, include plan details
        ...(selectedPlanId && {
          planId: selectedPlanId,
          isInstallment: true,
        }),
        callbackUrl: `${window.location.origin}/booking-confirmation/${bookingId}`,
        metadata: {
          bookingId: bookingId,
          isInstallment: !!selectedPlanId,
          planDetails: selectedPlan,
          centreName: centreDetails?.centreName || centreDetails?.name,
          packageName: packageDetails?.packageName,
          clientId: clientId,
        }
      };

      console.log("📄 Initializing payment with:", paymentDataPayload);

      // ✅ Dispatch the Redux thunk
      const result = await dispatch(initializePayment({
        bookingId: bookingId,
        paymentData: paymentDataPayload,
      })).unwrap();

      console.log("✅ Payment initialized:", result);

      setPaymentInitialized(true);

      // ✅ Extract data from response
      const paymentResult = result?.data || result;
      const redirectUrl = paymentResult?.redirect_url || 
                         paymentResult?.authorization_url ||
                         paymentResult?.paymentUrl ||
                         result?.redirect_url;

      const paymentReference = paymentResult?.reference || result?.reference;
      const paymentStatus = paymentResult?.status || result?.status;

      // ✅ Handle redirect to payment gateway
      if (redirectUrl) {
        await Swal.fire({
          icon: 'success',
          title: 'Redirecting to Payment Gateway',
          text: 'You will be redirected to complete your payment.',
          timer: 2000,
          showConfirmButton: false,
        });
        
        window.location.href = redirectUrl;
        
      } else if (paymentReference) {
        // Payment initialized but no redirect URL
        Swal.fire({
          icon: 'info',
          title: 'Payment Initiated',
          html: `
            <p>Your payment has been initiated.</p>
            <p><strong>Reference:</strong> ${paymentReference}</p>
            <p><strong>Status:</strong> ${paymentStatus || 'Pending'}</p>
            <p>Please check your email for payment instructions.</p>
          `,
          confirmButtonColor: '#ff6b35',
        }).then(() => {
          navigate(`/booking-confirmation/${bookingId}`, {
            state: {
              bookingId: bookingId,
              amount: totalAmount,
              paymentReference: paymentReference,
              selectedPlanId: selectedPlanId,
              selectedPlan: selectedPlan,
              centreDetails: centreDetails,
              packageDetails: packageDetails,
              isInstallment: !!selectedPlanId,
            }
          });
        });
        
      } else {
        // Fallback - show success
        Swal.fire({
          icon: 'success',
          title: 'Booking Confirmed!',
          text: 'Your booking has been confirmed. Please check your email for details.',
          confirmButtonColor: '#ff6b35',
        }).then(() => {
          navigate(`/booking-confirmation/${bookingId}`, {
            state: {
              bookingId: bookingId,
              amount: totalAmount,
              selectedPlanId: selectedPlanId,
              selectedPlan: selectedPlan,
              centreDetails: centreDetails,
              packageDetails: packageDetails,
              isInstallment: !!selectedPlanId,
            }
          });
        });
      }

    } catch (error) {
      console.error("❌ Payment error:", error);
      
      let errorMessage = 'Unable to process payment. Please try again.';
      if (error === 'Please log in to continue' || error?.message?.includes('login')) {
        errorMessage = 'Please log in to continue with payment.';
      } else if (error?.message?.includes('404') || error?.message?.includes('not found')) {
        errorMessage = 'Booking not found. Please try again.';
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

  // Get plans from API or use fallback
  const plans = paymentPlans && paymentPlans.length > 0 ? paymentPlans : [
    { id: '1', durationInMonths: 1, frequency: 'monthly', installmentAmount: Math.ceil(totalAmount / 1) },
    { id: '2', durationInMonths: 2, frequency: 'monthly', installmentAmount: Math.ceil(totalAmount / 2) },
    { id: '3', durationInMonths: 3, frequency: 'monthly', installmentAmount: Math.ceil(totalAmount / 3) },
  ];

  // Loading state for auto-init
  if (loading && !bookingData.isInstallment) {
    return (
      <div className="payment-page-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Initializing payment...</p>
        </div>
      </div>
    );
  }

  // Loading state for installment plans
  if (bookingData.isInstallment && paymentPlanLoading) {
    return (
      <div className="payment-page-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading payment plans...</p>
        </div>
      </div>
    );
  }

  // Payment error display
  if (paymentError && !bookingData.isInstallment) {
    return (
      <div className="payment-page-wrapper">
        <div className="error-container">
          <h2>Payment Error</h2>
          <p>{paymentError}</p>
          <button 
            className="checkout-submit-btn" 
            onClick={() => handleContinueToPayment(true)}
          >
            Retry Payment
          </button>
          <button 
            className="back-nav-btn" 
            onClick={() => navigate(-1)}
            style={{ marginTop: '12px' }}
          >
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
          {bookingData.isInstallment 
            ? 'Choose your payment plan and complete your booking'
            : 'Complete your payment to confirm your booking'
          }
        </p>
      </div>

      {/* Installment Banner - Only for installment bookings */}
      {bookingData.isInstallment && (
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
      )}

      <div className="payment-layout-container">
        
        {/* Plan Selector - Only for installment bookings */}
        {bookingData.isInstallment && (
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
        )}

        {/* Booking Summary Card */}
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
            onClick={() => handleContinueToPayment(false)}
            disabled={loading || paymentLoading}
          >
            {loading || paymentLoading ? 'Processing...' : 
             bookingData.isInstallment ? 'Continue To Payment' : 'Pay Now'}
          </button>

          {paymentError && (
            <p className="payment-error-text" style={{ color: 'red', textAlign: 'center', marginTop: '12px' }}>
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