import React from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import './css/PopularDestinations.css';

const PopularDestinations = () => {
  return (
    <div className="destinationsSection">
      <div className="destinationsHeader">
        <div className="sectionMainTitle">Popular Destination</div>
        <div className="sectionSubDescription">Explore Top Cities with the most attractions</div>
      </div>

      <div className="destinationsGrid">
        <div className="destinationCard">
          <img src="/src/assets/lagos.png" alt="Lagos" className="cardDisplayImage" />
          <div className="cardTextOverlay">
            <div className="locationLabelRow">
              <IoLocationOutline className="locationPinIcon" />
              <div className="cityNameText">Lagos</div>
            </div>
            <div className="attractionCountText">45 Attractions</div>
          </div>
        </div>

        <div className="destinationCard">
          <img src="/src/assets/ibadan.png" alt="Ibadan" className="cardDisplayImage" />
          <div className="cardTextOverlay">
            <div className="locationLabelRow">
              <IoLocationOutline className="locationPinIcon" />
              <div className="cityNameText">Ibadan</div>
            </div>
            <div className="attractionCountText">20 Attractions</div>
          </div>
        </div>

        <div className="destinationCard">
          <img src="/src/assets/abuja.png" alt="Abuja" className="cardDisplayImage" />
          <div className="cardTextOverlay">
            <div className="locationLabelRow">
              <IoLocationOutline className="locationPinIcon" />
              <div className="cityNameText">Abuja</div>
            </div>
            <div className="attractionCountText">27 Attractions</div>
          </div>
        </div>

        <div className="destinationCard">
          <img src="/src/assets/port.png" alt="Port Harcourt" className="cardDisplayImage" />
          <div className="cardTextOverlay">
            <div className="locationLabelRow">
              <IoLocationOutline className="locationPinIcon" />
              <div className="cityNameText">Port Harcourt</div>
            </div>
            <div className="attractionCountText">16 Attractions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularDestinations;
