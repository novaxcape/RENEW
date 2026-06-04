import React from "react";
import "../components/css/AboutSection.css";



const Aboutsection = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-images">
          <div className="left-column">
            <img src="/novaxcape/img1.png" alt="Volunteer" className="medium-image" />
            <img src="/novaxcape/img2.png" alt="Volunteer" className="small-image" />
          </div>

          <div className="right-column">
            <img src="/novaxcape/img3.png" alt="Group" className="large-image" />
          </div>
        </div>

        <div className="about-content">
          <h2>About NovaXcape</h2>

          <p>
            NovaXcape is Nigeria's leading online platform for discovering and
            booking tickets to amazing tourism destinations across the country.
          </p>

          <p>
            We bridge the gap between adventure seekers and tourism centres,
            making it easier than ever to explore Nigeria's diverse attractions.
            Founded with a passion for promoting local tourism, we've partnered
            with the best tourism centres, art galleries, nature parks, and
            cultural sites to bring you curated experiences that showcase the
            beauty and richness of Nigeria.
          </p>

          <p>
            Whether you're planning a family outing, a romantic getaway, or a
            solo adventure, NovaXcape provides a seamless booking experience
            with secure payments, instant confirmations, and dedicated customer
            support.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Aboutsection;
