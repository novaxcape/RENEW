import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import './css/Succeed.css'

const Succeed = () => {
  return (
    <section className="success-section">
      <h2 className="success-main-title">Everything You Need to Succeed</h2>

      <div className="success-grid-content">
        
        <div className="success-info-panel">
          <p className="success-info-description">
            Our partner portal gives you all the tools to manage your  <br /> listings, track bookings, and grow your revenue.
          </p>

          <div className="success-features-list-grid">
            <div className="feature-list-item">
              <FiCheckCircle className="icon-success-check" />
              <span>Easy listing management</span>
            </div>
            <div className="feature-list-item">
              <FiCheckCircle className="icon-success-check" />
              <span>Real-time booking</span>
            </div>
            <div className="feature-list-item">
              <FiCheckCircle className="icon-success-check" />
              <span>Detailed analytics dashboard</span>
            </div>
            <div className="feature-list-item">
              <FiCheckCircle className="icon-success-check" />
              <span>Installment payment support</span>
            </div>
            <div className="feature-list-item">
              <FiCheckCircle className="icon-success-check" />
              <span>Flexible pricing options</span>
            </div>
            <div className="feature-list-item">
              <FiCheckCircle className="icon-success-check" />
              <span>Customer reviews and ratings</span>
            </div>
            <div className="feature-list-item">
              <FiCheckCircle className="icon-success-check" />
              <span>Dedicated partner support</span>
            </div>
            <div className="feature-list-item">
              <FiCheckCircle className="icon-success-check" />
              <span>Marketing and promotion tools</span>
            </div>
          </div>
        </div>

        <div className="success-pricing-card">
          <h3 className="pricing-card-title">Simple Commission Structure</h3>
          
          <div className="commission-stats-display-row">
            <div className="stat-block-item">
              <span className="stat-label">Platform Commission</span>
              <span className="stat-percentage blue-highlight">15%</span>
            </div>
            <div className="stat-block-item text-right">
              <span className="stat-label">You Keep</span>
              <span className="stat-percentage dark-highlight">85%</span>
            </div>
          </div>

          <div className="pricing-bullet-list">
            <div className="pricing-bullet-item">
              <FiCheckCircle className="icon-pricing-check" />
              <span>Weekly payouts to your bank account</span>
            </div>
            <div className="pricing-bullet-item">
              <FiCheckCircle className="icon-pricing-check" />
              <span>No hidden fees or charges</span>
            </div>
            <div className="pricing-bullet-item">
              <FiCheckCircle className="icon-pricing-check" />
              <span>Transparent transaction reporting</span>
            </div>
          </div>
        </div>

      </div>

      <div className="success-portrait-center-container">
        <img 
          src="/novaxcape/succeed.png" 
          alt="Successful Partner Illustration" 
          className="portrait-model-image" 
        />
      </div>
    </section>
  )
}

export default Succeed
