import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import "./css/BookingConfirmation.css";
import { HiOutlineMail } from "react-icons/hi";
import { FiMapPin, FiCalendar, FiShield, FiDownload } from "react-icons/fi";
import { RiIdCardLine } from "react-icons/ri";
import { verifyPayment, getBookingById } from "../redox/apiSlice";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [bookingDetails, setBookingDetails] = useState({
    location: '',
    visitDate: '',
    bookingId: bookingId || '',
    passcode: '',
    amount: 0,
    status: 'pending'
  });

  const { paymentData, paymentLoading, paymentError, booking } = useSelector((state) => state.api);

  // Get booking data from location state
  const bookingData = location.state || {};

  useEffect(() => {
    // First, fetch booking details to get real data
    const fetchBookingDetails = async () => {
      if (bookingId) {
        try {
          const result = await dispatch(getBookingById(bookingId)).unwrap();
          const bookingData = result?.data || result?.booking || result;
          if (bookingData) {
            setBookingDetails(prev => ({
              ...prev,
              location: bookingData.centreName || bookingData.tourist?.centreName || 'Tourist Centre',
              visitDate: bookingData.visitDate || bookingData.date || 'Date TBD',
              bookingId: bookingData.bookingNumber || bookingData.id || bookingId,
              passcode: bookingData.passcode || Math.floor(100000 + Math.random() * 900000).toString(),
              amount: bookingData.amount || bookingData.totalAmount || 0,
              status: bookingData.status || 'pending'
            }));
          }
        } catch (error) {
          console.error('Error fetching booking:', error);
        }
      }
    };

    fetchBookingDetails();

    // Verify payment on mount
    const verifyPaymentHandler = async () => {
      const reference = bookingData.reference || 
                        new URLSearchParams(location.search).get('reference') ||
                        new URLSearchParams(location.search).get('trxref');
      
      console.log("🔍 Verifying payment with reference:", reference);
      
      if (reference) {
        try {
          const result = await dispatch(verifyPayment({
            reference: reference,
            bookingId: bookingId
          })).unwrap();

          console.log("✅ Verification result:", result);

          if (result?.data?.status === 'success' || result?.status === 'success') {
            setVerificationStatus('success');
            setBookingDetails(prev => ({
              ...prev,
              status: 'confirmed',
              amount: result.data.amount || prev.amount
            }));
            
            // Update booking status in state
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
          }
        } catch (error) {
          console.error('Verification error:', error);
          setVerificationStatus('failed');
        }
      } else {
        // If no reference, check if booking was already confirmed
        if (bookingData.status === 'confirmed' || bookingDetails.status === 'confirmed') {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('pending');
        }
      }
    };

    verifyPaymentHandler();
  }, [dispatch, bookingId, bookingData, location.search]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDownloadPasscode = () => {
    const passcodeText = `Booking Confirmation\n\nBooking ID: ${bookingDetails.bookingId}\nPasscode: ${bookingDetails.passcode}\nLocation: ${bookingDetails.location}\nVisit Date: ${bookingDetails.visitDate}\nAmount Paid: ₦${Number(bookingDetails.amount).toLocaleString()}`;
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

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleRetryPayment = () => {
    navigate(`/payment/${bookingId}`, {
      state: {
        bookingId: bookingId,
        amount: bookingDetails.amount,
        bookingData: bookingData
      }
    });
  };

  // Show loading state
  if (verificationStatus === 'verifying') {
    return (
      <div className="confirmation-page-wrapper">
        <div className="confirmation-card">
          <div className="loading-container">
            <div className="spinner"></div>
            <h2>Verifying Payment...</h2>
            <p>Please wait while we confirm your payment.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show failed state
  if (verificationStatus === 'failed') {
    return (
      <div className="confirmation-page-wrapper">
        <div className="confirmation-card">
          <div className="failed-state">
            <div className="failed-icon">❌</div>
            <h2>Payment Verification Failed</h2>
            <p>We couldn't verify your payment. Please contact support or try again.</p>
            <button 
              className="homepage-redirect-btn"
              onClick={handleRetryPayment}
            >
              Retry Payment
            </button>
            <button 
              className="homepage-redirect-btn secondary"
              onClick={handleBackToHome}
              style={{ marginTop: '10px', background: '#f0f0f0', color: '#333' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show pending state (waiting for payment)
  if (verificationStatus === 'pending') {
    return (
      <div className="confirmation-page-wrapper">
        <div className="confirmation-card">
          <div className="pending-state">
            <div className="pending-icon">⏳</div>
            <h2>Payment Pending</h2>
            <p>Your booking is awaiting payment confirmation.</p>
            <button 
              className="homepage-redirect-btn"
              onClick={handleRetryPayment}
            >
              Complete Payment
            </button>
            <button 
              className="homepage-redirect-btn secondary"
              onClick={handleBackToHome}
              style={{ marginTop: '10px', background: '#f0f0f0', color: '#333' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="confirmation-page-wrapper">
      <div className="confirmation-card">
        <div className="success-badge-container">
          <img
            src="/novaxcape/check.png"
            alt="Booking Confirmed"
            className="success-checkmark-img"
          />
        </div>

        <h1 className="confirmation-title">Booking Confirmed!</h1>
        <p className="confirmation-subtitle">
          Your booking has been successfully confirmed.
        </p>

        <div className="email-toast-message">
          <div className="email-left-content">
            <HiOutlineMail className="email-toast-icon" />
            <span className="email-toast-text">
              Your digital ticket has been sent to your email.
            </span>
          </div>
        </div>

        <div className="booking-details-box">
          <h3 className="details-section-title">Booking Details</h3>

          <div className="detail-item-row">
            <FiMapPin className="detail-meta-icon" />
            <div className="detail-text-cell">
              <span className="detail-field-label">Location</span>
              <span className="detail-field-value">
                {bookingDetails.location}
              </span>
            </div>
          </div>

          <div className="detail-item-row">
            <FiCalendar className="detail-meta-icon" />
            <div className="detail-text-cell">
              <span className="detail-field-label">Visit Date</span>
              <span className="detail-field-value">
                {formatDate(bookingDetails.visitDate)}
              </span>
            </div>
          </div>

          <div className="detail-item-row">
            <RiIdCardLine className="detail-meta-icon" />
            <div className="detail-text-cell">
              <span className="detail-field-label">Booking ID</span>
              <span className="detail-field-value">{bookingDetails.bookingId}</span>
            </div>
          </div>

          {bookingDetails.amount > 0 && (
            <div className="detail-item-row">
              <span className="detail-meta-icon">💰</span>
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
            <h4 className="passcode-main-heading">
              Gate verification Passcode
            </h4>
          </div>
          <p className="passcode-sub-caption">
            Show this code at the gate for entry verification
          </p>

          <div className="passcode-display-block">
            {bookingDetails.passcode.split('').map((digit, index) => (
              <span key={index} className="passcode-digit">{digit}</span>
            ))}
          </div>

          <button 
            className="download-passcode-action-btn"
            onClick={handleDownloadPasscode}
          >
            <FiDownload className="download-action-icon" />
            Download Passcode
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