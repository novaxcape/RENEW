import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoIosTrendingUp } from "react-icons/io";
import { FiTrendingUp } from "react-icons/fi";
import "../components/css/TopAttractions.css";

export default function TopAttractions() {
  return (
    <section className="top-attractions">

      
      <div className="section-header">
        <div className="header-title-row">
          <  IoIosTrendingUp className="header-arrow" />
          <h2 className="header-title">Top Attractions</h2>
        </div>
       
      </div>
          <p className="header-subtitle">Most visited and highly rated tourism centres this month</p>
      {/* Grid */}
      <div className="attractions-grid">

        {/* Card 1 - Lekki Conservation Centre */}
        <div className="attraction-card">
          <div className="card-image-wrapper">
            <img src="/novaxcape/lekki.png" alt="Lekki Conservation Centre" className="card-image" />
            <span className="trending-badge">
              <FiTrendingUp className="badge-icon" /> Trending
            </span>
          </div>
          <div className="card-info">
            <p className="card-name">Lekki Conservation Centre</p>
            <p className="card-city">Lagos</p>
            <div className="card-rating">
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <span className="rating-number">5.0</span>
              <span className="review-count">(567)</span>
            </div>
          </div>
        </div>

        {/* Card 2 - Yankari National Park */}
        <div className="attraction-card">
          <div className="card-image-wrapper">
            <img src="/novaxcape/yankari.png" alt="Yankari National Park" className="card-image" />
            <span className="trending-badge">
              <FiTrendingUp className="badge-icon" /> Trending
            </span>
          </div>
          <div className="card-info">
            <p className="card-name">Yankari National Park</p>
            <p className="card-city">Bauchi</p>
            <div className="card-rating">
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--empty" />
              <span className="rating-number">4.0</span>
              <span className="review-count">(213)</span>
            </div>
          </div>
        </div>

        {/* Card 3 - Olumo Rock */}
        <div className="attraction-card">
          <div className="card-image-wrapper">
            <img src="/novaxcape/olumo.png" alt="Olumo Rock" className="card-image" />
          </div>
          <div className="card-info">
            <p className="card-name">Olumo Rock</p>
            <p className="card-city">Abeokuta</p>
            <div className="card-rating">
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <span className="rating-number">5.0</span>
              <span className="review-count">(400)</span>
            </div>
          </div>
        </div>

        {/* Card 4 - Obudu Mountain Resort */}
        <div className="attraction-card">
          <div className="card-image-wrapper">
            <img src="/novaxcape/obudu.png" alt="Obudu Mountain Resort" className="card-image" />
            <span className="trending-badge">
              <FiTrendingUp className="badge-icon" /> Trending
            </span>
          </div>
          <div className="card-info">
            <p className="card-name">Obudu Mountain Resort</p>
            <p className="card-city">Cross River</p>
            <div className="card-rating">
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStarHalfAlt className="star star--half" />
              <span className="rating-number">4.5</span>
              <span className="review-count">(200)</span>
            </div>
          </div>
        </div>

        {/* Card 5 - Green Legacy Resort */}
        <div className="attraction-card">
          <div className="card-image-wrapper">
            <img src="/novaxcape/greenLegacy.png" alt="Green Legacy Resort" className="card-image" />
          </div>
          <div className="card-info">
            <p className="card-name">Green Legacy Resort</p>
            <p className="card-city">Abeokuta</p>
            <div className="card-rating">
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--empty" />
              <span className="rating-number">4.0</span>
              <span className="review-count">(122)</span>
            </div>
          </div>
        </div>

        {/* Card 6 - Omu Resort */}
        <div className="attraction-card">
          <div className="card-image-wrapper">
            <img src="/novaxcape/omu.png" alt="Omu Resort" className="card-image" />
            <span className="trending-badge">
              <FiTrendingUp className="badge-icon" /> Trending
            </span>
          </div>
          <div className="card-info">
            <p className="card-name">Omu Resort</p>
            <p className="card-city">Lagos</p>
            <div className="card-rating">
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <FaStar className="star star--full" />
              <span className="rating-number">5.0</span>
              <span className="review-count">(567)</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}