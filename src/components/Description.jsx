import React from 'react'
import '../Styles/Product.css'
const Description = () => {
  return (
     <section className="listing-heading-area">
          <h1 className="hero-title">Lekki Conservation Centre</h1>
          <div className="listing-sub-metadata">
            <span className="meta-inline-item">📍 Lekki, Lagos State</span>
            <span className="meta-inline-item">⏰ Daily 8AM - 4PM</span>
            <span className="meta-inline-item orange-stars">
              ⭐⭐⭐⭐⭐ <span className="numeric-rating">5.0</span>{" "}
              <span className="total-reviews">(567)</span>
            </span>
          </div>
          <div className="pill-tags-row">
            <span className="pill-tag">Nature trails</span>
            <span className="pill-tag">Picnic Areas</span>
            <span className="pill-tag">WildLife Viewing</span>
            <span className="pill-tag">Canopy walkway</span>
          </div>
        </section>
  )
}

export default Description
