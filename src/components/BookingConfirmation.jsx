import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { HiOutlineMail } from "react-icons/hi";
import { FiMapPin, FiCalendar, FiShield, FiDownload } from "react-icons/fi";
import { RiIdCardLine } from "react-icons/ri";
import {
  verifyPayment,
  getBookingById,
  getInstallmentPaymentStatus,
  clearPaymentData,
} from "../redox/apiSlice";
import "./css/BookingConfirmation.css";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Component State
  const [bookingDetails, setBookingDetails] = useState({
    location: '',
    visitDate: '',
    bookingId: bookingId || '',
    passcode: '',
    amount: 0,
    status: 'pending',
    reference: '',
    // Installment-specific fields
    isInstallment: false,
    installmentsPaid: 0,
    totalInstallments: 0,
    amountPerInstallment: 0,
    totalAmount: 0,
  });
  // 'verifying' | 'success' | 'partial-success' | 'pending' | 'failed'
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  // Redux & Router State
  const locationBookingData = useMemo(() => location.state || {}, [location.state]);
  const { paymentData, booking: reduxBooking } = useSelector((state) => state.api);

  // Refs for tracking values inside useEffect without triggering re-renders
  const paymentDataRef = useRef(paymentData);
  const reduxBookingRef = useRef(reduxBooking);
  const verificationAttempted = useRef(false);

  useEffect(() => { paymentDataRef.current = paymentData; }, [paymentData]);
  useEffect(() => { reduxBookingRef.current = reduxBooking; }, [reduxBooking]);

  // Utility: Format Date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Fallback if invalid date

      return `${date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })} at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    } catch {
      return dateString;
    }
  };

  // Utility: Update Booking State matching the new API Schema
  const updateBookingDetails = (payload) => {
    if (!payload) return;

    const nestedData = payload.data || {};
    const paymentDetails = nestedData.data || payload.payment || payload.paymentData || {};
    const rootData = payload.data?.data ? payload.data : payload;
    const pendingBookingState = JSON.parse(
      localStorage.getItem("pendingBookingState") || "{}",
    );

    setBookingDetails((prev) => ({
      ...prev,
      location: rootData.location || nestedData.location || prev.location,
      visitDate: rootData.visitDate || nestedData.visitDate || prev.visitDate,
      bookingId: rootData.bookingId || nestedData.bookingId || prev.bookingId,
      passcode: rootData.otp || rootData.passcode || nestedData.passcode || prev.passcode,

      amount:
        paymentDetails.amount ||
        paymentDetails.totalAmount ||
        nestedData.amount ||
        nestedData.totalAmount ||
        rootData.amount ||
        rootData.totalAmount ||
        pendingBookingState.amount ||
        pendingBookingState.totalAmount ||
        prev.amount,
      status: paymentDetails.status || nestedData.status || rootData.status || prev.status,
      reference:
        paymentDetails.reference ||
        nestedData.reference ||
        rootData.reference ||
        prev.reference,
    }));
  };

  // Utility: Merge installment-status payload into bookingDetails
  const updateInstallmentDetails = (installmentData) => {
    if (!installmentData) return;
    setBookingDetails((prev) => ({
      ...prev,
      isInstallment: true,
      installmentsPaid: installmentData.installmentsPaid ?? prev.installmentsPaid,
      totalInstallments: installmentData.totalInstallments ?? prev.totalInstallments,
      amountPerInstallment: installmentData.amountPerInstallment ?? prev.amountPerInstallment,
      totalAmount: installmentData.totalAmount ?? prev.totalAmount,
      amount: installmentData.totalAmount ?? prev.amount,
      bookingId: installmentData.bookingId || prev.bookingId,
    }));
  };

  useEffect(() => {
    if (verificationAttempted.current) return;
    let isMounted = true;

    const verifyAndFetchBooking = async () => {
      verificationAttempted.current = true;

      const urlParams = new URLSearchParams(location.search);
      const reference =
        urlParams.get('reference') ||
        urlParams.get('trxref') ||
        locationBookingData.reference ||
        paymentDataRef.current?.reference ||
        paymentDataRef.current?.data?.reference;

      if (reference) {
        try {
          const result = await dispatch(verifyPayment({ reference, bookingId })).unwrap();

          if (!isMounted) return;

          // verifyPayment resolving (not throwing) means the payment call itself
          // succeeded. We no longer trust a specific `message` string or a
          // `status === 'success'` value here, because installment payments
          // return different shapes/wording (e.g. "Installment 1 of 2 paid
          // successfully", status: "installment"). Instead, we follow up with
          // the installment-status endpoint to get the real, structured picture.
          updateBookingDetails({
            ...result,
            status: 'confirmed',
          });

          try {
            const installmentResult = await dispatch(
              getInstallmentPaymentStatus(bookingId)
            ).unwrap();

            const statusData = installmentResult?.data || {};
            const { installmentsPaid, totalInstallments, status } = statusData;

            updateInstallmentDetails(statusData);

            const isFullyPaid =
              totalInstallments != null && installmentsPaid === totalInstallments;

            if (isFullyPaid || status === 'confirmed' || status === 'completed') {
              setVerificationStatus('success');
              Swal.fire({
                icon: 'success',
                title: 'Payment Successful! 🎉',
                text: 'Your booking has been confirmed.',
                confirmButtonColor: '#ff6b35',
                timer: 2000,
                showConfirmButton: false,
              });
            } else if (installmentsPaid > 0) {
              // Partial payment made, more installments remain
              setVerificationStatus('partial-success');
              Swal.fire({
                icon: 'success',
                title: `Installment ${installmentsPaid} of ${totalInstallments} Paid! 🎉`,
                text: 'Your booking is in progress — pay the remaining installment to fully confirm.',
                confirmButtonColor: '#ff6b35',
                timer: 2500,
                showConfirmButton: false,
              });
            } else {
              // No installments recorded as paid despite verifyPayment succeeding —
              // treat cautiously as failed rather than assuming success.
              setVerificationStatus('failed');
              setErrorMessage('Payment could not be confirmed. Please contact support if you were charged.');
            }
          } catch (installmentError) {
            // If this is a one-off (non-installment) booking, the installment-status
            // endpoint may 404 or return nothing meaningful — that's fine, since
            // verifyPayment already resolved successfully. Treat as full success.
            setVerificationStatus('success');
            Swal.fire({
              icon: 'success',
              title: 'Payment Successful! 🎉',
              text: 'Your booking has been confirmed.',
              confirmButtonColor: '#ff6b35',
              timer: 2000,
              showConfirmButton: false,
            });
          }
        } catch (error) {
          if (isMounted) {
            setVerificationStatus('failed');
            setErrorMessage(typeof error === 'string' ? error : error?.message || 'Could not verify payment.');
          }
        }
      } else {
        // Fallback checks if no payment reference is found
        try {
          const existingBooking = locationBookingData.booking || reduxBookingRef.current;
          const isExistingConfirmed = existingBooking && ['confirmed', 'completed'].includes(existingBooking.status) || existingBooking?.paymentStatus === 'success';

          if (isExistingConfirmed) {
            setVerificationStatus('success');
            updateBookingDetails(existingBooking);
          } else if (bookingId) {
            const result = await dispatch(getBookingById(bookingId)).unwrap();
            const fetchedBooking = result?.data || result?.booking || result;
            const isFetchedConfirmed = fetchedBooking && ['confirmed', 'completed'].includes(fetchedBooking.status) || fetchedBooking?.paymentStatus === 'success';

            if (isFetchedConfirmed) {
              setVerificationStatus('success');
              updateBookingDetails(fetchedBooking);
            } else {
              setVerificationStatus('pending');
              updateBookingDetails(fetchedBooking || locationBookingData);
            }
          } else {
            setVerificationStatus('pending');
            updateBookingDetails(locationBookingData);
          }
        } catch (error) {
          if (isMounted) {
            setVerificationStatus('pending');
            updateBookingDetails(locationBookingData);
          }
        }
      }
    };

    verifyAndFetchBooking();
    return () => { isMounted = false; };
  }, [dispatch, bookingId, locationBookingData, location.search]);

  // Handlers
  const handleDownloadPasscode = () => {
    const passcode = bookingDetails.passcode || 'N/A';
    const passcodeText = `Booking Confirmation\n\nBooking ID: ${bookingDetails.bookingId}\nPasscode: ${passcode}\nLocation: ${bookingDetails.location}\nVisit Date: ${formatDate(bookingDetails.visitDate)}\nAmount Paid: ₦${Number(bookingDetails.amount).toLocaleString()}`;

    const blob = new Blob([passcodeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passcode-${bookingDetails.bookingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    Swal.fire({
      icon: 'success',
      title: 'Passcode Downloaded!',
      text: 'Your passcode has been downloaded successfully.',
      confirmButtonColor: '#ff6b35',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleCopyPasscode = () => {
    if (!bookingDetails.passcode) return;
    navigator.clipboard.writeText(bookingDetails.passcode);
    Swal.fire({
      icon: 'success',
      title: 'Copied!',
      text: 'Passcode copied to clipboard.',
      confirmButtonColor: '#ff6b35',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleBackToHome = () => {
    dispatch(clearPaymentData());
    navigate('/');
  };

  const handleRetryPayment = () => {
    navigate(`/payment-checkout/${bookingId}`, {
      state: {
        bookingId: bookingId,
        amount: bookingDetails.amount,
        totalAmount: bookingDetails.totalAmount || bookingDetails.amount,
        bookingData: locationBookingData,
        reference: bookingDetails.reference,
        isInstallment: bookingDetails.isInstallment || false,
        centreDetails: locationBookingData.centreDetails,
        packageDetails: locationBookingData.packageDetails,
      },
    });
  };

  // For partial-success: navigate to pay the next installment specifically
  const handlePayNextInstallment = () => {
    navigate(`/payment-checkout/${bookingId}`, {
      state: {
        bookingId: bookingId,
        amount: bookingDetails.totalAmount || bookingDetails.amount,
        totalAmount: bookingDetails.totalAmount || bookingDetails.amount,
        subtotal: locationBookingData.subtotal,
        serviceFee: locationBookingData.serviceFee,
        bookingData: locationBookingData,
        reference: bookingDetails.reference,
        isInstallment: true,
        centreDetails: locationBookingData.centreDetails,
        packageDetails: locationBookingData.packageDetails,
        ticketDetails: locationBookingData.ticketDetails,
      },
    });
  };

  // UI Renders based on verification status
  if (verificationStatus === 'verifying') {
    return (
      <div className="confirmation-page-wrapper">
        <div className="confirmation-card">
          <div className="loading-container">
            <div className="spinner"></div>
            <h2 className="confirmation-title">Verifying Payment...</h2>
            <p className="confirmation-subtitle">Please wait while we confirm your transaction.</p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'failed') {
    return (
      <div className="confirmation-page-wrapper">
        <div className="confirmation-card">
          <div className="failed-state">
            <div className="failed-icon">❌</div>
            <h2 className="confirmation-title">Verification Failed</h2>
            <p className="confirmation-subtitle">{errorMessage || "We couldn't verify your payment."}</p>
            <button className="homepage-redirect-btn" onClick={handleRetryPayment}>
              Retry Payment
            </button>
            <button className="homepage-redirect-btn" onClick={handleBackToHome} style={{ marginTop: '12px', background: '#e2e8f0', color: '#334155' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'pending') {
    return (
      <div className="confirmation-page-wrapper">
        <div className="confirmation-card">
          <div className="pending-state">
            <div className="pending-icon">⏳</div>
            <h2 className="confirmation-title">Payment Pending</h2>
            <p className="confirmation-subtitle">Your booking is awaiting payment confirmation.</p>
            {bookingDetails.bookingId && (
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                Booking ID: <strong>{bookingDetails.bookingId}</strong>
              </p>
            )}
            <button className="homepage-redirect-btn" onClick={handleRetryPayment}>
              Complete Payment
            </button>
            <button className="homepage-redirect-btn" onClick={handleBackToHome} style={{ marginTop: '12px', background: '#e2e8f0', color: '#334155' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'partial-success') {
    const remaining = bookingDetails.totalInstallments - bookingDetails.installmentsPaid;
    return (
      <div className="confirmation-page-wrapper">
        <div className="confirmation-card">
          <div className="pending-state">
            <div className="pending-icon">✅</div>
            <h2 className="confirmation-title">
              Installment {bookingDetails.installmentsPaid} of {bookingDetails.totalInstallments} Paid
            </h2>
            <p className="confirmation-subtitle">
              You've paid ₦{Number(bookingDetails.amountPerInstallment).toLocaleString()} toward a total of ₦{Number(bookingDetails.totalAmount).toLocaleString()}.
              {remaining > 0 && ` ${remaining} installment${remaining > 1 ? 's' : ''} remaining.`}
            </p>
            {bookingDetails.bookingId && (
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                Booking ID: <strong>{bookingDetails.bookingId}</strong>
              </p>
            )}
            <button className="homepage-redirect-btn" onClick={handlePayNextInstallment}>
              Pay Next Installment
            </button>
            <button className="homepage-redirect-btn" onClick={handleBackToHome} style={{ marginTop: '12px', background: '#e2e8f0', color: '#334155' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // verificationStatus === 'success'
  const displayPasscode = bookingDetails.passcode || '••••••';

  return (
    <div className="confirmation-page-wrapper">
      <div className="confirmation-card">
        <div className="success-badge-container">
          <img src="/novaxcape/check.png" alt="Booking Confirmed" className="success-checkmark-img" />
        </div>

        <h1 className="confirmation-title">Booking Confirmed!</h1>
        <p className="confirmation-subtitle">Your booking has been successfully confirmed.</p>

        <div className="email-toast-message">
          <div className="email-left-content">
            <HiOutlineMail className="email-toast-icon" />
            <span className="email-toast-text">Your digital ticket has been sent to your email.</span>
          </div>
        </div>

        <div className="booking-details-box">
          <h3 className="details-section-title">Booking Details</h3>

          <div className="detail-item-row">
            <FiMapPin className="detail-meta-icon" />
            <div className="detail-text-cell">
              <span className="detail-field-label">Location</span>
              <span className="detail-field-value">{bookingDetails.location || 'Not specified'}</span>
            </div>
          </div>

          <div className="detail-item-row">
            <FiCalendar className="detail-meta-icon" />
            <div className="detail-text-cell">
              <span className="detail-field-label">Visit Date</span>
              <span className="detail-field-value">{formatDate(bookingDetails.visitDate)}</span>
            </div>
          </div>

          <div className="detail-item-row">
            <RiIdCardLine className="detail-meta-icon" />
            <div className="detail-text-cell">
              <span className="detail-field-label">Booking ID</span>
              <span className="detail-field-value">{bookingDetails.bookingId || 'N/A'}</span>
            </div>
          </div>

          {bookingDetails.amount > 0 && (
            <div className="detail-item-row">
              <span className="detail-meta-icon">₦</span>
              <div className="detail-text-cell">
                <span className="detail-field-label">Amount Paid</span>
                <span className="detail-field-value">₦{Number(bookingDetails.amount).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="passcode-container-card">
          <div className="passcode-header-row">
            <FiShield className="passcode-shield-icon" />
            <h4 className="passcode-main-heading">Gate Verification Passcode</h4>
          </div>
          <p className="passcode-sub-caption">Tap to copy · show this code at the gate for entry</p>

          <div className="passcode-display-block" onClick={handleCopyPasscode} style={{ cursor: 'pointer' }} title="Tap to copy">
            {displayPasscode.split('').map((digit, index) => (
              <span key={index} className="passcode-digit">{digit}</span>
            ))}
          </div>

          <button className="download-passcode-action-btn" onClick={handleDownloadPasscode}>
            <FiDownload className="download-action-icon" />
            Download Ticket Details
          </button>
        </div>

        <div className="navigation-footer-action">
          <button className="homepage-redirect-btn" onClick={handleBackToHome}>
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
