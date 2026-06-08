import React from 'react';
import { LuBuilding2, LuUser, LuCreditCard } from 'react-icons/lu';
import { FiCheckCircle } from 'react-icons/fi';
import './css/KycForm.css';

const KycForm = () => {
  return (
    <main className="kyc-page-wrapper">
      <div className="back-button-row">
        <div className="back-button-container">
          <button type="button" className="kyc-back-btn">Back</button>
        </div>
      </div>

      <div className="content-bg-container">
        <div className="kyc-page-container">
          <div className="kyc-intro-section">
            <h1 className="kyc-main-title">KYC Verification</h1>
            <p className="kyc-sub-title">Complete your verification to start receiving bookings</p>
          </div>

          <form className="kyc-multi-block-form" onSubmit={(e) => e.preventDefault()}>
            <section className="kyc-form-card">
              <div className="card-header-row">
                <LuBuilding2 className="card-header-icon" />
                <h2 className="card-section-title">Business Information</h2>
              </div>
              
              <div className="form-grid-layout">
                <div className="form-input-group">
                  <label className="form-field-label">Centre Name *</label>
                  <input type="text" className="form-text-input" placeholder="e.g., Lekki Tourism Limited" />
                </div>
                
                <div className="form-input-group">
                  <label className="form-field-label">Landmark *</label>
                  <input type="text" className="form-text-input" placeholder="e.g., Near Lekki Toll Gate" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">CAC Registration Number *</label>
                  <input type="text" className="form-text-input" placeholder="e.g., RC 123456" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Centre Email *</label>
                  <input type="email" className="form-text-input" placeholder="info@business.com" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Year Established *</label>
                  <input type="text" className="form-text-input" placeholder="e.g., 2020" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Centre Type *</label>
                  <input type="text" className="form-text-input" placeholder="e.g., recreation, museum" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Centre Phone *</label>
                  <input type="tel" className="form-text-input" placeholder="+234 800 000 0000" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Postal Code *</label>
                  <input type="text" className="form-text-input" placeholder="e.g., 101245" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">City *</label>
                  <input type="text" className="form-text-input" placeholder="e.g., Lagos" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">State *</label>
                  <input type="text" className="form-text-input" placeholder="" />
                </div>

                <div className="form-input-group full-width-field">
                  <label className="form-field-label">Street address *</label>
                  <input type="text" className="form-text-input" placeholder="Street address" />
                </div>
              </div>
            </section>

            <section className="kyc-form-card">
              <div className="card-header-row">
                <LuUser className="card-header-icon" />
                <h2 className="card-section-title">Owner/Director Information</h2>
              </div>
              
              <div className="form-grid-layout">
                <div className="form-input-group">
                  <label className="form-field-label">Full Name *</label>
                  <input type="text" className="form-text-input" placeholder="John Doe" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Email Address *</label>
                  <input type="email" className="form-text-input" placeholder="owner@email.com" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Phone Number *</label>
                  <input type="tel" className="form-text-input" placeholder="+234 800 000 0000" />
                </div>
              </div>
            </section>

            <section className="kyc-form-card">
              <div className="card-header-row">
                <LuCreditCard className="card-header-icon" />
                <h2 className="card-section-title">Bank Account Details</h2>
              </div>
              
              <div className="form-grid-layout">
                <div className="form-input-group">
                  <label className="form-field-label">Bank Name *</label>
                  <input type="text" className="form-text-input" placeholder="e.g., First Bank of Nigeria" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Account Number *</label>
                  <input type="text" className="form-text-input" placeholder="1234567890" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Account Name *</label>
                  <input type="text" className="form-text-input" placeholder="As it appears in bank records" />
                </div>

                <div className="form-input-group">
                  <label className="form-field-label">Bank Code* (optional)</label>
                  <input type="text" className="form-text-input" placeholder="e.g., 011" />
                </div>
              </div>
            </section>

            <div className="submit-action-row">
              <button type="submit" className="kyc-submit-btn">
                Submit for Verification
                <FiCheckCircle className="btn-success-check-icon" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default KycForm;
