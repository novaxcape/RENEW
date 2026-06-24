import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import "./css/BookingConfirmation.css";
import { HiOutlineMail } from "react-icons/hi";
import { FiMapPin, FiCalendar, FiShield, FiDownload } from "react-icons/fi";
import { RiIdCardLine } from "react-icons/ri";
import { verifyPayment, getBookingById, clearPaymentData } from "../redox/apiSlice";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [bookingDetails, setBookingDetails] = useState({
    location: '',
    visitDate: '',
    bookingId: bookingId || '',
    passcode: '',
    amount: 0,
    status: 'pending',
    reference: '',
  });
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  const locationBookingData = useMemo(() => location.state || {}, [location.state]);
  const { paymentData, booking: reduxBooking } = useSelector((state) => state.api);

  const paymentDataRef = useRef(paymentData);
  const reduxBookingRef = useRef(reduxBooking);
  const verificationAttempted = useRef(false);

  useEffect(() => { paymentDataRef.current = paymentData; }, [paymentData]);
  useEffect(() => { reduxBookingRef.current = reduxBooking; }, [reduxBooking]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }) +
        ' at ' +
        date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    } catch (e) {
      return dateString;
    }
  };

  const updateBookingDetails = (data) => {
    if (!data) return;
    const centreData = data.data || data;
    setBookingDetails((prev) => ({
      ...prev,
      location: centreData.centreName || centreData.tourist?.centreName || centreData.location || prev.location,
      visitDate: centreData.visitDate || centreData.date || centreData.bookingDate || prev.visitDate,
      bookingId: centreData.bookingNumber || centreData.id || centreData.bookingId || prev.bookingId,
      passcode: centreData.passcode || centreData.bookingPasscode || prev.passcode,
      amount: centreData.amount || centreData.totalAmount || centreData.price || centreData.paidAmount || prev.amount,
      status: centreData.status || centreData.paymentStatus || prev.status,
      reference: centreData.reference || centreData.paymentReference || prev.reference,
    }));
  };

  useEffect(() => {
    if (verificationAttempted.current) return;

    let isMounted = true;

    const verifyAndFetchBooking = async () => {
      verificationAttempted.current = true;

      const urlParams = new URLSearchParams(location.search);
      const referenceFromUrl = urlParams.get('reference') || urlParams.get('trxref');
      const referenceFromState = locationBookingData.reference;
      const currentPaymentData = paymentDataRef.current;
      const referenceFromRedux =
        currentPaymentData?.reference ||
        currentPaymentData?.data?.reference ||
        currentPaymentData?.data?.data?.reference;

      const reference = referenceFromUrl || referenceFromState || referenceFromRedux;

      if (reference) {
        try {
          const result = await dispatch(verifyPayment({ reference, bookingId })).unwrap();

          if (isMounted) {
            const responseData = result?.data || result;

            const paymentStatus =
              responseData?.data?.status ||
              responseData?.status ||
              'pending';

            const isSuccess =
              paymentStatus === 'success' ||
              responseData?.data?.transaction?.status === 'success' ||
              responseData?.message?.toLowerCase().includes('success') ||
              result?.message?.toLowerCase().includes('success');

            if (isSuccess) {
              setVerificationStatus('success');

              const bookingData = responseData?.data || responseData || {};

              const otp =
                result?.otp ||
                responseData?.otp ||
                bookingData.passcode ||
                bookingData.bookingPasscode ||
                'N/A';

              updateBookingDetails({
                ...bookingData,
                status: 'confirmed',
                passcode: otp,
              });

              Swal.fire({
                icon: 'success',
                title: 'Payment Successful! 🎉',
                text: 'Your booking has been confirmed.',
                confirmButtonColor: '#ff6b35',
                timer: 2000,
                showConfirmButton: false,
              });
            } else {
              setVerificationStatus('failed');
              setErrorMessage(
                result?.message ||
                responseData?.message ||
                'Payment verification failed.'
              );
            }
          }
        } catch (error) {
          if (isMounted) {
            setVerificationStatus('failed');
            setErrorMessage(
              typeof error === 'string' ? error : error?.message || 'Could not verify payment.'
            );
          }
        }
      } else {
        try {
          const currentReduxBooking = reduxBookingRef.current;
          const existingBooking = locationBookingData.booking || currentReduxBooking;

          if (
            existingBooking &&
            (existingBooking.status === 'confirmed' ||
              existingBooking.status === 'completed' ||
              existingBooking.paymentStatus === 'success')
          ) {
            setVerificationStatus('success');
            updateBookingDetails(existingBooking);
          } else if (bookingId) {
            const result = await dispatch(getBookingById(bookingId)).unwrap();
            const fetchedBooking = result?.data || result?.booking || result;

            if (
              fetchedBooking &&
              (fetchedBooking.status === 'confirmed' ||
                fetchedBooking.status === 'completed' ||
                fetchedBooking.paymentStatus === 'success')
            ) {
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
    navigate(`/payment/${bookingId}`, {
      state: {
        bookingId: bookingId,
        amount: bookingDetails.amount,
        bookingData: locationBookingData,
        reference: bookingDetails.reference,
      },
    });
  };

  // Loading State
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

  // Failed State
  if (verificationStatus === 'failed') {
    return (
      <div className="confirmation-page-wrapper">
        <div className="confirmation-card">
          <div className="failed-state">
            <div className="failed-icon">❌</div>
            <h2 className="confirmation-title">Verification Failed</h2>
            <p className="confirmation-subtitle">
              {errorMessage || "We couldn't verify your payment."}
            </p>
            <button className="homepage-redirect-btn" onClick={handleRetryPayment}>
              Retry Payment
            </button>
            <button
              className="homepage-redirect-btn"
              onClick={handleBackToHome}
              style={{ marginTop: '12px', background: '#e2e8f0', color: '#334155' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending State
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
            <button
              className="homepage-redirect-btn"
              onClick={handleBackToHome}
              style={{ marginTop: '12px', background: '#e2e8f0', color: '#334155' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  const displayPasscode = bookingDetails.passcode || '••••••';

  return (
    <div className="confirmation-page-wrapper">
      <div className="confirmation-card">

        {/* ── Check image ── */}
        <div className="success-badge-container">
          <img
            src="/novaxcape/check.png"
            alt="Booking Confirmed"
            className="success-checkmark-img"
          />
        </div>

        <h1 className="confirmation-title">Booking Confirmed!</h1>
        <p className="confirmation-subtitle">Your booking has been successfully confirmed.</p>

        {/* ── Email bar ── */}
        <div className="email-toast-message">
          <div className="email-left-content">
            <HiOutlineMail className="email-toast-icon" />
            <span className="email-toast-text">
              Your digital ticket has been sent to your email.
            </span>
          </div>
        </div>

        {/* ── Booking details ── */}
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
                <span className="detail-field-value">
                  ₦{Number(bookingDetails.amount).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Passcode ── */}
        <div className="passcode-container-card">
          <div className="passcode-header-row">
            <FiShield className="passcode-shield-icon" />
            <h4 className="passcode-main-heading">Gate Verification Passcode</h4>
          </div>
          <p className="passcode-sub-caption">
            Tap to copy · show this code at the gate for entry
          </p>

          <div
            className="passcode-display-block"
            onClick={handleCopyPasscode}
            style={{ cursor: 'pointer' }}
            title="Tap to copy"
          >
            {displayPasscode.split('').map((digit, index) => (
              <span key={index} className="passcode-digit">{digit}</span>
            ))}
          </div>

          <button className="download-passcode-action-btn" onClick={handleDownloadPasscode}>
            <FiDownload className="download-action-icon" />
            Download Ticket Details
          </button>
        </div>

        {/* ── Footer ── */}
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
