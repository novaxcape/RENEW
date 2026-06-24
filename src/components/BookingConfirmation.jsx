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
            // result is the raw unwrapped API response:
            // { message: "...", data: { ... }, otp: "123456" }
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

              // ✅ FIX: otp lives at the ROOT of the API response (result.otp),
              // not inside result.data — check there first before falling through
              const otp =
                result?.otp ||           // ✅ root level — this is where the API puts it
                responseData?.otp ||     // fallback if responseData is the full response
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
              className="homepage-redirect-btn secondary"
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
              className="homepage-redirect-btn secondary"
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

        {/* ── Green header banner ── */}
        <div className="conf-header-banner">
          <div className="conf-check-ring">
            <FiShield className="conf-check-icon" />
          </div>
          <h1 className="conf-banner-title">Booking Confirmed!</h1>
          <p className="conf-banner-subtitle">Your reservation is all set and ready to go.</p>
        </div>

        {/* ── Email notification bar ── */}
        <div className="conf-email-bar">
          <HiOutlineMail />
          <span>Digital ticket sent to your email address</span>
        </div>

        {/* ── Body ── */}
        <div className="conf-body">
          <p className="conf-section-label">Booking details</p>

          <div className="conf-detail-row">
            <div className="conf-detail-icon-wrap"><FiMapPin /></div>
            <div>
              <span className="conf-detail-label">Location</span>
              <span className="conf-detail-value">{bookingDetails.location || 'Not specified'}</span>
            </div>
          </div>

          <div className="conf-detail-row">
            <div className="conf-detail-icon-wrap"><FiCalendar /></div>
            <div>
              <span className="conf-detail-label">Visit date</span>
              <span className="conf-detail-value">{formatDate(bookingDetails.visitDate)}</span>
            </div>
          </div>

          <div className="conf-detail-row">
            <div className="conf-detail-icon-wrap"><RiIdCardLine /></div>
            <div>
              <span className="conf-detail-label">Booking ID</span>
              <span className="conf-detail-value">{bookingDetails.bookingId || 'N/A'}</span>
            </div>
          </div>

          {bookingDetails.amount > 0 && (
            <div className="conf-detail-row">
              <div className="conf-detail-icon-wrap">
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#555' }}>₦</span>
              </div>
              <div>
                <span className="conf-detail-label">Amount paid</span>
                <span className="conf-detail-value">
                  <span className="conf-amount-badge">
                    ✓ ₦{Number(bookingDetails.amount).toLocaleString()}
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* ── Passcode block ── */}
          <div className="conf-passcode-block">
            <div className="conf-passcode-header">
              <FiShield />
              <span>Gate verification passcode</span>
            </div>
            <p className="conf-passcode-caption">
              Tap digits to copy · show at the gate for entry
            </p>

            <div
              className="conf-passcode-digits"
              onClick={handleCopyPasscode}
              style={{ cursor: 'pointer' }}
              title="Tap to copy"
            >
              {displayPasscode.split('').map((digit, index) => (
                <div key={index} className="conf-passcode-digit">{digit}</div>
              ))}
            </div>

            <button className="conf-download-btn" onClick={handleDownloadPasscode}>
              <FiDownload />
              Download ticket details
            </button>
          </div>

          <button className="conf-home-btn" onClick={handleBackToHome}>
            ← Back to homepage
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;
