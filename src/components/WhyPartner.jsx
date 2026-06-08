import React from 'react'
import { FiUsers, FiTrendingUp, FiDollarSign, FiShield } from 'react-icons/fi'
import './css/WhyPartner.css'

const WhyPartner = () => {
  return (
    <section className="why-partner-section">
      <div className="why-partner-header">
        <h2 className="why-partner-title">Why Partner with Us?</h2>
        <p className="why-partner-subtitle">
          Join other tourism centres across Nigeria already growing their business with NovaXcape.
        </p>
      </div>

      <div className="why-partner-grid-layout">
        
        <div className="why-partner-column-left">
          <div className="partner-feature-card blue-border">
            <div className="feature-icon-box blue-bg">
              <FiUsers className="feature-icon blue-text" />
            </div>
            <h3 className="feature-title">Reach More Visitors</h3>
            <p className="feature-description">
              Connect with thousands of travelers looking for unique experiences across Nigeria
            </p>
          </div>

          <div className="partner-feature-card orange-border">
            <div className="feature-icon-box blue-bg">
              <FiDollarSign className="feature-icon blue-text" />
            </div>
            <h3 className="feature-title">Increase Revenue</h3>
            <p className="feature-description">
              Boost your bookings with our easy-to-use platform and flexible payment options
            </p>
          </div>
        </div>

        <div className="why-partner-column-center">
          <div className="center-image-container">
            <img 
              src="/novaxcape/partner.png" 
              alt="NovaXcape Partners" 
              className="center-banner-image" 
            />
          </div>
        </div>

        <div className="why-partner-column-right">
          <div className="partner-feature-card blue-border">
            <div className="feature-icon-box blue-bg">
              <FiTrendingUp className="feature-icon blue-text" />
            </div>
            <h3 className="feature-title">Grow Your Business</h3>
            <p className="feature-description">
              Access analytics and insights to optimize your offerings and pricing
            </p>
          </div>

          <div className="partner-feature-card orange-border">
            <div className="feature-icon-box blue-bg">
              <FiShield className="feature-icon blue-text" />
            </div>
            <h3 className="feature-title">Secure Payments</h3>
            <p className="feature-description">
              Get paid weekly with our secure payment processing & commission structure
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default WhyPartner
