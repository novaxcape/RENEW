import React from 'react';
import { LuCalendarDays } from 'react-icons/lu';
import './css/Hero.css';

const Hero = () => {
  return (
    <div className="heroSection">
      <div className="heroLeft">
        <div className="taglineRow">
          <img src="/src/assets/plane.png" alt="Plane Icon" className="planeAssetIcon" />
          <span className="taglineText">Explore Nigeria's hidden gems</span>
        </div>
        
        <div className="headingGroup">
          <h1 className="headingLineOne">Explore Nigeria's Most</h1>
          <h1 className="headingLineTwo">Stunning Places</h1>
        </div>
        
        <p className="descriptionText">
          Discover beautiful tourism centres across Nigeria, book tickets instantly, and create memories that matter.
        </p>
      </div>

      <div className="heroRight">
        <div className="imageGrid">
          <div className="gridItem topLeftCell">
            <div className="statsFloatingBadge">
              <h3 className="statsBadgeTitle">100+Destinations</h3>
              <p className="statsBadgeSub">More Than 100 Travelers use this platform</p>
            </div>
            <img src="/src/assets/photo1.png" alt="Hot Air Balloon" className="gridImage" />
          </div>

          <div className="gridItem topRightCell">
            <div className="verifiedFloatingBadge">
              <div className="verifiedPercent">100%</div>
              <div className="verifiedText">Verified</div>
            </div>
            <img src="/src/assets/photo2.png" alt="Clear Water" className="Image" />
          </div>

          <div className="gridItem bottomLeftCell">
            <img src="/src/assets/photo3.png" alt="House with Balloon" className="Image" />
          </div>

          <div className="gridItem bottomRightCell">
            <img src="/src/assets/photo4.png" alt="Pink Trees" className="gridImage" />
          </div>
        </div>

        <div className="searchContainerBar">
          <div className="searchFieldGroup">
            <input type="text" placeholder="Where to?" className="searchInput" />
          </div>
          
          <div className="searchFieldGroup dateWrapper">
            <LuCalendarDays className="calendarAssetIcon" />
            <input type="text" placeholder="When?" className="searchInput dateInput" />
          </div>
          
          <button className="searchActionBtn">Search</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;