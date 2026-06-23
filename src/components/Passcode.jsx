import React, { useState } from 'react';
import './css/Passcode.css';

const Passcode = () => {
  const [passcode, setPasscode] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // 'idle', 'success', 'failed'

  const handleKeyPress = (num) => {
    if (passcode.length < 6 && verificationStatus === 'idle') {
      setPasscode([...passcode, num]);
    }
  };

  const handleBackspace = () => {
    if (passcode.length > 0 && verificationStatus === 'idle') {
      setPasscode(passcode.slice(0, -1));
    }
  };

  const handleVerify = () => {
    if (passcode.length === 6) {
      const codeString = passcode.join('');
      // For testing: '123456' triggers success, anything else fails
      if (codeString === '123456') {
        setVerificationStatus('success');
      } else {
        setVerificationStatus('failed');
      }
    }
  };

  const handleReset = () => {
    setPasscode([]);
    setVerificationStatus('idle');
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
                className={`input-box ${index === passcode.length && verificationStatus === 'idle' ? 'active' : ''}`}
              >
                {passcode[index] !== undefined && <span className="dot"></span>}
              </div>
            ))}
          </div>

          {/* Number Keypad */}
          <div className={`keypad ${passcode.length === 6 ? 'disabled' : ''}`}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button key={num} onClick={() => handleKeyPress(num)} disabled={passcode.length === 6}>
                {num}
              </button>
            ))}
            <button onClick={() => handleKeyPress(0)} disabled={passcode.length === 6}>0</button>
            <button className="backspace-btn" onClick={handleBackspace} disabled={passcode.length === 6}>
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
            disabled={passcode.length < 6 && verificationStatus === 'idle'}
          >
            Verify Passcode
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

          {verificationStatus === 'success' && (
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
                <div className="avatar">AO</div>
                <div className="customer-info">
                  <h5>Adaeze Okonkwo</h5>
                  <p>Ticket ID: NOV-00132</p>
                </div>
              </div>

              <div className="meta-table">
                <div className="meta-row">
                  <span className="meta-label">Ticket Type</span>
                  <span className="meta-value bold-value">Adult Ticket</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Date</span>
                  <span className="meta-value">May 15, 2026</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Amount Paid</span>
                  <span className="meta-value bold-value">₦13,500</span>
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
                  <p className="status-desc">Try again</p>
                </div>
              </div>

              <div className="customer-details">
                <div className="avatar">AO</div>
                <div className="customer-info">
                  <h5>Adaeze Okonkwo</h5>
                  <p>Ticket ID: NOV-00132</p>
                </div>
              </div>

              <div className="meta-table">
                <div className="meta-row">
                  <span className="meta-label">Package Type</span>
                  <span className="meta-value bold-value">Family</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Date</span>
                  <span className="meta-value">May 15, 2026</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Amount Paid</span>
                  <span className="meta-value bold-value">₦13,500</span>
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