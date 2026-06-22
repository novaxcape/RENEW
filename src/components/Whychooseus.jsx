import React from "react";
import "../components/css/Chooseus.css";
import chooseimage from "/novaxcape/chooseimage.png";
import { BsCheck2Circle } from "react-icons/bs";


const Whychooseus = () => {
  return (
   <section className="whyChoose">
      <div className="whyChoose-container">

        {/* Left Side */}
        <div className="whyChoose-left">
          {/* <div className="whyChoose-badge">
            Why Choose Us
          </div> */}

          <img
            src={chooseimage}
            alt="Why Choose Us"
            className="whyChoose-image"
          /> 

        
        </div>

        {/* Right Side */}
         <div className="whyChoose-right">
          <h2>Why Choose us?</h2>

          <p>
            We make discovering and booking tourism centres across  Nigeria
            simple, reliable, and stress-free. Our platform is designed to
            eliminate long queues, on-site ticket hassles, and unnecessary
            uncertainty so you can focus on enjoying memorable experiences.
          </p>

          <h6>
            Whether you're planning a weekend getaway, family outing, or solo
            adventure, NovaXcape gives you real-time availability,
            transparent pricing, secure payments, and instant digital tickets
            all in one place.
          </h6>

          <div className="whyChoose-features">

            <div className="feature">
 <span className="feature-icons"><BsCheck2Circle  size={30}color="white"/></span>
               <span className="feature-text">Instant booking</span>
            </div>
            
            <div className="feature">
 <span className="feature-icons"><BsCheck2Circle size={30} color="white"/></span>
               <span className="feature-text">Flexible payment</span>
            </div>

            <div className="feature">
 <span className="feature-icons"><BsCheck2Circle size={30} color="white"/></span>
               <span className="feature-text">Skip the Queue</span>
            </div>

            <div className="feature">
              <span className="feature-icons"><BsCheck2Circle size={30} color="white"/></span>
              <span className="feature-text">Transparent pricing</span>
            </div>

          </div> 
        </div> 

      </div>
    </section>
  );
};

export default Whychooseus;

