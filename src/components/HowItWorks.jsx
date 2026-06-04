import React from 'react';
import './css/HowItWorks.css';

const HowItWorks = () => {
  return (
    <div className="howItWorksSection">
      {/* Header */}
      <div className="headerSection">
        <div className="sectionTagline">How it Works</div>
        <h2 className="sectionTitle">We have the best team and the best process</h2>
        <p className="sectionDescription">
          Dedicated to making your tourism experiences seamless and enjoyable, we've built a simple and reliable platform that lets you discover great places, book tickets instantly, and enjoy stress-free visits across Nigeria.
        </p>
      </div>

      {/* Get Started Button */}
      <div className="getStartedContainer">
        <button className="getStartedBtn">Get Started</button>
      </div>

      {/* Steps */}
      <div className="stepsContainer">
        <div className="stepCard">
          <div className="stepNumber">1</div>
          <h3 className="stepTitle">Discover</h3>
          <p className="stepDescription">
            Search and explore verified tourism centres with real photos and accurate information.
          </p>
        </div>

        <div className="stepCard">
          <div className="stepNumber">2</div>
          <h3 className="stepTitle">Book Instantly</h3>
          <p className="stepDescription">
            Select your date and ticket type, then pay securely and Seamlessly.
          </p>
        </div>

        <div className="stepCard">
          <div className="stepNumber">3</div>
          <h3 className="stepTitle">Visit & Enjoy</h3>
          <p className="stepDescription">
            Skip the queue and enjoy a stress-free experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;