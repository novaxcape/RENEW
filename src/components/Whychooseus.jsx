import React from "react";
import "../components/css/Whychooseus.css";
import chooseimg from "/novaxcape/chooseimg.png";
import { FaCheck } from "react-icons/fa";

const Whychooseus = () => {
  return (
    <section className="whyChoose">
      <div className="whyChoose_container">

        {/* Left Side */}
        <div className="whyChoose_imageSection">
          <div className="whyChoose_badge">
            Why Choose Us
          </div>

          <img
            src={chooseimg}
            alt="Why Choose Us"
            className="whyChoose_image"
          />

          <div className="whyChoose_stats">
            <div className="stat">
              <h3>3+ Years</h3>
              <p>Experience</p>
            </div>

            <div className="stat">
              <h3>Instant Booking</h3>
              <p>And experience</p>
            </div>

            <div className="stat">
              <h3>Diverse</h3>
              <p>Attraction</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="whyChoose_content">
          <h2>Why Choose us?</h2>

          <p>
            We make discovering and booking tourism centres across
            Nigeria simple, reliable, and stress-free. Our platform is
            designed to eliminate long queues, on-site ticket hassles,
            and unnecessary uncertainty so you can focus on enjoying
            memorable experiences.
          </p>

          <p>
            Whether you're planning a weekend getaway, family outing,
            or solo adventure, NovaXcape gives you real-time
            availability, transparent pricing, secure payments, and
            instant digital tickets all in one place.
          </p>

          <div className="features">
            <div className="feature">
              <span className="icon">
                <FaCheck />
              </span>
              <p>Instant booking</p>
            </div>

            <div className="feature">
              <span className="icon">
                <FaCheck />
              </span>
              <p>Flexible payment</p>
            </div>

            <div className="feature">
              <span className="icon">
                <FaCheck />
              </span>
              <p>Skip the Queue</p>
            </div>

            <div className="feature">
              <span className="icon">
                <FaCheck />
              </span>
              <p>Transparent pricing</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Whychooseus;