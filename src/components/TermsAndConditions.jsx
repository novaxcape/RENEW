import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import './css/TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <main className="tc-page-wrapper">
      <div className="tc-master-layout">
        
        <div className="back-button-row">
          <button type="button" className="tc-back-btn">Back</button>
        </div>

        <div className="tc-intro-section">
          <h1 className="tc-main-title">Terms and conditions</h1>
          <p className="tc-sub-title">Please read and accept terms and conditions to continue using novaxcape</p>
        </div>

        <div className="tc-body-list">
          <section className="tc-section-block">
            <h2 className="tc-section-title">1. VENDOR REGISTRATION</h2>
            <p className="tc-section-text">
              By registering as a vendor on NovaXcape, you agree to provide accurate and complete information about your tourism center, including but not limited to business registration details, facilities, services, and pricing.
            </p>
          </section>

          <section className="tc-section-block">
            <h2 className="tc-section-title">2. COMMISSION AND FEES</h2>
            <p className="tc-section-text">
              NovaXcape charges a commission of 15% on all bookings made through the platform. Payment shall be processed within 14 business days after service delivery, subject to successful completion and customer confirmation.
            </p>
          </section>

          <section className="tc-section-block">
            <h2 className="tc-section-title">3. SERVICE STANDARDS:</h2>
            <p className="tc-section-text">
              Vendors must maintain high service standards and ensure that all facilities, amenities, and services advertised on the platform are accurately represented and available as described. Any changes must be updated immediately on the platform.
            </p>
          </section>

          <section className="tc-section-block">
            <h2 className="tc-section-title">4. CANCELLATION POLICY:</h2>
            <p className="tc-section-text">
              Vendors must honor the cancellation policy stated on their listing. Unfair cancellations or frequent unavailability may result in penalties, including temporary suspension or permanent removal from the platform.
            </p>
          </section>

          <section className="tc-section-block">
            <h2 className="tc-section-title">5. LIABILITY AND INSURANCE:</h2>
            <p className="tc-section-text">
              Vendors are solely responsible for maintaining adequate insurance coverage for their premises and operations. NovaXcape is not liable for any incidents, injuries, or damages that occur at vendor locations.
            </p>
          </section>

          <section className="tc-section-block">
            <h2 className="tc-section-title">6. DISPUTE RESOLUTION</h2>
            <p className="tc-section-text">
              Incase of disputes with customers vendors agree to work with novaxcape's customer support team to reach an amicable resolution. Repeated customer complaint may result to account review
            </p>
          </section>

          <section className="tc-section-block">
            <h2 className="tc-section-title">7. INTELLECTUAL PROPERTY</h2>
            <p className="tc-section-text">
              Vendors grant NovaXcape a non-exclusive license to use photos, descriptions, and promotional materials provided for marketing purposes across all NovaXcape platforms and partner channels.
            </p>
          </section>

          <section className="tc-section-block">
            <h2 className="tc-section-title">8. TERMINATION</h2>
            <p className="tc-section-text">
              Either party may terminate this agreement with 30 days written notice. NovaXcape reserves the right to immediately suspend or terminate vendor accounts that violate these terms or engage in fraudulent activities.
            </p>
          </section>
        </div>

        <div className="tc-action-footer">
          <label className="tc-checkbox-container">
            <input type="checkbox" className="tc-hidden-checkbox" />
            <span className="tc-custom-checkbox"></span>
            <span className="tc-checkbox-label">yes, i agree.</span>
          </label>

          <div className="tc-submit-row">
            <button type="button" className="tc-proceed-btn">
              Proceed to kyc verificatiom
              <FiArrowRight className="tc-btn-icon" />
            </button>
          </div>
        </div>

      </div>
    </main>
  );
};

export default TermsAndConditions;
