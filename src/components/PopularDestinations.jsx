import React from "react";
import "./css/PopularDestinations.css";

const PopularDestinations = () => {
  return (
    <section className="popular-destination">
      <div className="popular-destination__header">
        <h2 className="popular-destination__title">Popular Destination</h2>
        <p className="popular-destination__subtitle">Explore Top Cities with the most attractions</p>
      </div>

      <div className="popular-destination__grid">

        <div className="popular-destination__card">
          <img src="/novaxcape/lagos.png" alt="Lagos" className="popular-destination__image" />
        </div>

        <div className="popular-destination__card">
          <img src="/novaxcape/ibadan.png" alt="Ibadan" className="popular-destination__image" />
        </div>

        <div className="popular-destination__card">
          <img src="/novaxcape/abuja.png" alt="Abuja" className="popular-destination__image" />
        </div>

        <div className="popular-destination__card">
          <img src="/novaxcape/port.png" alt="Port Harcourt" className="popular-destination__image" />
        </div>

      </div>
    </section>
  );
};

export default PopularDestinations;