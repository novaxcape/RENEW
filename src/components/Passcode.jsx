// Pages/Passcode.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { verifyPasscode } from '../redox/apiSlice';
import Swal from 'sweetalert2';
import './css/Passcode.css';

const Passcode = () => {
  const dispatch = useDispatch();
  const [passcode, setPasscode] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // 'idle', 'success', 'failed'
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleKeyPress = (num) => {
    if (passcode.length < 6 && verificationStatus === 'idle') {
      setPasscode([...passcode, num]);
      setError('');
      setResponseMessage('');
    }
  };

  const handleBackspace = () => {
    if (passcode.length > 0 && verificationStatus === 'idle') {
      setPasscode(passcode.slice(0, -1));
      setError('');
      setResponseMessage('');
    }
  };

  const handleVerify = async () => {
    if (passcode.length === 6) {
      const codeString = passcode.join('');
      setLoading(true);
      setError('');
      setResponseMessage('');

      try {
        // ✅ Call the API to verify passcode
        const result = await dispatch(verifyPasscode({ passcode: codeString })).unwrap();
        
        console.log('✅ Full API Response:', result);
        console.log('✅ Response type:', typeof result);
        console.log('✅ Response keys:', result ? Object.keys(result) : 'null');

        // ✅ Check if the response indicates success or failure
        // The API returns { message: "Invalid passcode" } for failure
        // For success, it returns { message: "string", data: { ... } }
        
        // ✅ Safely check for message
        const responseMessage = result?.message || '';
        
        if (responseMessage === 'Invalid passcode') {
          // ❌ Invalid passcode
          setVerificationStatus('failed');
          setError('Invalid passcode. Please try again.');
          
          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: 'Invalid passcode. Please check and try again.',
            confirmButtonColor: '#ff6b35',
          });
        } else if (result?.data || result?.booking) {
          // ✅ Success - valid passcode
          const booking = result?.data || result?.booking || result;
          setBookingData(booking);
          setVerificationStatus('success');
          setResponseMessage(responseMessage || 'Passcode verified successfully!');
          
          Swal.fire({
            icon: 'success',
            title: 'Passcode Verified!',
            text: 'Customer is cleared for entry.',
            confirmButtonColor: '#ff6b35',
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (result && typeof result === 'object' && Object.keys(result).length > 0) {
          // ✅ If we have a response object but no explicit data or booking field
          // Try to use the entire response as booking data
          setBookingData(result);
          setVerificationStatus('success');
          setResponseMessage(responseMessage || 'Passcode verified successfully!');
          
          Swal.fire({
            icon: 'success',
            title: 'Passcode Verified!',
            text: 'Customer is cleared for entry.',
            confirmButtonColor: '#ff6b35',
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          // ❌ Unknown response
          setVerificationStatus('failed');
          setError('Unexpected response from server.');
          
          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: 'Unexpected response from server. Please try again.',
            confirmButtonColor: '#ff6b35',
          });
        }
      } catch (error) {
        console.error('❌ Passcode verification failed:', error);
        console.error('❌ Error type:', typeof error);
        console.error('❌ Error value:', error);
        
        // Handle different error cases
        let errorMessage = 'Invalid passcode. Please try again.';
        
        // ✅ Check if error is a string
        if (typeof error === 'string') {
          if (error.includes('Invalid passcode')) {
            errorMessage = 'Invalid passcode. Please check and try again.';
          } else if (error.includes('Passcode is required')) {
            errorMessage = 'Please enter a passcode.';
          } else {
            errorMessage = error;
          }
        } 
        // ✅ Check if error has a message property
        else if (error?.message) {
          if (error.message.includes('Invalid passcode')) {
            errorMessage = 'Invalid passcode. Please check and try again.';
          } else {
            errorMessage = error.message;
          }
        }
        // ✅ Check if error response has data
        else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        setError(errorMessage);
        setVerificationStatus('failed');
        
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: errorMessage,
          confirmButtonColor: '#ff6b35',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setPasscode([]);
    setVerificationStatus('idle');
    setBookingData(null);
    setError('');
    setResponseMessage('');
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    if (!amount) return '₦0';
    return `₦${amount.toLocaleString()}`;
  };

  // Get customer name from booking data
  const getCustomerName = () => {
    if (bookingData?.client?.firstName && bookingData?.client?.lastName) {
      return `${bookingData.client.firstName} ${bookingData.client.lastName}`;
    }
    if (bookingData?.client?.name) {
      return bookingData.client.name;
    }
    if (bookingData?.tourist?.centreName) {
      return bookingData.tourist.centreName;
    }
    if (bookingData?.customerName) {
      return bookingData.customerName;
    }
    if (bookingData?.name) {
      return bookingData.name;
    }
    return 'Customer';
  };

  // Get initials for avatar
  const getInitials = () => {
    const name = getCustomerName();
    if (!name || name === 'Customer') return 'CU';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get booking number
  const getBookingNumber = () => {
    return bookingData?.bookingNumber || 
           bookingData?.booking?.bookingNumber || 
           bookingData?.id || 
           'N/A';
  };

  // Get package name
  const getPackageName = () => {
    return bookingData?.package?.packageName || 
           bookingData?.packageName || 
           bookingData?.ticketType || 
           'Standard';
  };

  // Get amount
  const getAmount = () => {
    return bookingData?.package?.amount || 
           bookingData?.amount || 
           bookingData?.price || 
           0;
  };

  // Get visit date
  const getVisitDate = () => {
    return bookingData?.visitDate || 
           bookingData?.date || 
           bookingData?.bookingDate || 
           null;
  };

  return (
    <div className="verifier-container">
      <div className="verifier-header">
        <h2>Verify Customer Passcode</h2>
        <p>Enter the customer's 6-digit passcode to confirm their booking upon arrival.</p>
      </div>

      <div className="verifier-body">
        {/* Left Card: Input & Keypad */}
        <div className="card left-card">
          <div className="shield-icon-container">
            <svg className="shield-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 11l2 2 4-4" />
            </svg>
          </div>

          <h3 className="card-title">Enter Passcode</h3>
          <p className="card-subtitle">Ask the customer for their 6-digit arrival passcode</p>

          {/* 6-Digit Inputs */}
          <div className="passcode-inputs">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index} 
                className={`input-box ${index === passcode.length && verificationStatus === 'idle' ? 'active' : ''} 
                  ${verificationStatus === 'success' ? 'success' : ''} 
                  ${verificationStatus === 'failed' ? 'failed' : ''}`}
              >
                {passcode[index] !== undefined && <span className="dot"></span>}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}
          
          {/* Success Message */}
          {responseMessage && verificationStatus === 'success' && (
            <div className="success-message">{responseMessage}</div>
          )}

          {/* Number Keypad */}
          <div className={`keypad ${passcode.length === 6 ? 'disabled' : ''}`}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button 
                key={num} 
                onClick={() => handleKeyPress(num)} 
                disabled={passcode.length === 6 || loading}
              >
                {num}
              </button>
            ))}
            <button 
              onClick={() => handleKeyPress(0)} 
              disabled={passcode.length === 6 || loading}
            >
              0
            </button>
            <button 
              className="backspace-btn" 
              onClick={handleBackspace} 
              disabled={passcode.length === 0 || loading}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            </button>
          </div>

          {/* Action Button */}
          <button 
            className={`action-btn ${passcode.length === 6 ? 'filled' : 'primary'}`}
            onClick={handleVerify}
            disabled={passcode.length < 6 || loading}
          >
            {loading ? 'Verifying...' : 'Verify Passcode'}
          </button>

          {/* Reset Link */}
          {verificationStatus !== 'idle' && (
            <button className="reset-link" onClick={handleReset}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
              Verify another customer
            </button>
          )}
        </div>

        {/* Right Card: Dynamic Status Panels */}
        <div className="right-panel">
          {verificationStatus === 'idle' && (
            <div className="card info-card">
              <h4>How it works</h4>
              <ol className="steps-list">
                <li>
                  <span className="step-number">1</span>
                  <p>Ask the customer for their 6-digit passcode from their booking confirmation.</p>
                </li>
                <li>
                  <span className="step-number">2</span>
                  <p>Enter the digits using the keypad on the left.</p>
                </li>
                <li>
                  <span className="step-number">3</span>
                  <p>Press Verify — the system will instantly confirm their booking.</p>
                </li>
                <li>
                  <span className="step-number">4</span>
                  <p>Grant or deny entry based on the result.</p>
                </li>
              </ol>
            </div>
          )}

          {verificationStatus === 'success' && bookingData && (
            <div className="card status-card success-card">
              <div className="status-header">
                <div className="status-icon-container green-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h4 className="success-text">Verified Successfully</h4>
                  <p className="status-desc">Customer is cleared for entry</p>
                </div>
              </div>

              <div className="customer-details">
                <div className="avatar">{getInitials()}</div>
                <div className="customer-info">
                  <h5>{getCustomerName()}</h5>
                  <p>Ticket ID: {getBookingNumber()}</p>
                </div>
              </div>

              <div className="meta-table">
                <div className="meta-row">
                  <span className="meta-label">Ticket Type</span>
                  <span className="meta-value bold-value">{getPackageName()}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Date</span>
                  <span className="meta-value">{formatDate(getVisitDate())}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Amount Paid</span>
                  <span className="meta-value bold-value">{formatCurrency(getAmount())}</span>
                </div>
              </div>

              <div className="badge grant-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Grant Entry
              </div>
            </div>
          )}

          {verificationStatus === 'failed' && (
            <div className="card status-card error-card">
              <div className="status-header">
                <div className="status-icon-container red-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div>
                  <h4 className="error-text">Verification Failed</h4>
                  <p className="status-desc">Invalid passcode entered</p>
                </div>
              </div>

              <div className="customer-details">
                <div className="avatar">CU</div>
                <div className="customer-info">
                  <h5>Customer</h5>
                  <p>Invalid passcode</p>
                </div>
              </div>

              <div className="badge deny-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                No Entry
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Passcode;