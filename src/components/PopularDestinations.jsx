import React from "react";
import "./css/PopularDestinations.css";

const PopularDestinations = () => {
  return (
    <section className="popular-destination">
      <div className="popular-destination__header">
        <h2 className="popular-destination__title">
          Popular Destination
        </h2>

        <p className="popular-destination__subtitle">
          Explore Top Cities with the most attractions
        </p>
      </div>

      <div className="popular-destination__grid">
        <div className="popular-destination__card">
          <img src="/novaxcape/lagos.jpg" alt="Lagos" className="popular-destination__image" />

          <div className="popular-destination__overlay">
            <div className="popular-destination__info">
              <h3>Lagos</h3>
              <p>24 Attractions</p>
            </div>
          </div>
        </div>
        <div className="popular-destination__card">
          <img src="/novaxcape/Ibadan.jpg" alt="Ibadan" className="popular-destination__image" />

          <div className="popular-destination__overlay">
            <div className="popular-destination__info">
              <h3>Ibadan</h3>
              <p>12 Attractions</p>
            </div>
          </div>
        </div>
        <div className="popular-destination__card">
          <img src="/novaxcape/abuja.jpg" alt="Abuja" className="popular-destination__image" />

          <div className="popular-destination__overlay">
            <div className="popular-destination__info">
              <h3>Abuja</h3>
              <p>18 Attractions</p>
            </div>
          </div>
        </div>
        <div className="popular-destination__card">
          <img src="/novaxcape/port.jpg" alt="Port Harcourt" className="popular-destination__image" />

          <div className="popular-destination__overlay">
            <div className="popular-destination__info">
              <h3>Port Harcourt</h3>
              <p>9 Attractions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
