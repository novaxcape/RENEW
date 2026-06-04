import React from 'react';
import './css/Recommend.css';

const Recommend = () => {
  return (
    <div className="recommendSection">
      <div className="recommendLeft">
        <div className="imageCollage">
          <div className="collageCard cardMain">
            <img src="/src/assets/hot.png" alt="Hot Air Balloon View" className="collageImg" />
          </div>
          <div className="collageCard cardBottom">
            <img src="/src/assets/tree.png" alt="Pink Stream Scenery" className="collageImg" />
          </div>
          <div className="collageCard cardTopRight">
            <img src="/src/assets/dol.png" alt="Dolphin Jumping" className="collageImg" />
          </div>
        </div>
      </div>

      <div className="recommendRight">
        <div className="sectionTagline">What we Recommend</div>
        
        <h2 className="sectionHeading">
          <span className="headingBold">We Recommend</span> <br />
          <span className="headingLight">Beautiful Destinations Every  Month</span> 
          
        </h2>
        
        <p className="sectionSubtext">
          Let's choose your dream destinations here we provide many Locations and we offer the best destination every week.
        </p>

        <div className="statsRowGroup">
          <div className="statBlockCard">
            <div className="statValueNumber">2000+</div>
            <div className="statValueLabel">Our Explorers</div>
          </div>
          
          <div className="statBlockCard">
            <div className="statValueNumber">100+</div>
            <div className="statValueLabel">Destinations</div>
          </div>
          
          <div className="statBlockCard">
            <div className="statValueNumber">20+</div>
            <div className="statValueLabel">Years Experience</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommend;
