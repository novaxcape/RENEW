import React, { useState } from 'react';
import '../components/css/Ourgoal.css';
import forest from "/novaxcape/forest.png";

const Ourgoal = () => {
  const [activeTab, setActiveTab] = useState('vision');

  const visionText = "To become Africa's most trusted and comprehensive tourism booking platform, inspiring millions to explore their local heritage and discover the beauty that surrounds them. We envision a future where every Nigerian has easy access to unforgettable experiences in their own backyard.";
  
  const missionText = "To build a seamless digital ecosystem that connects travelers to Nigeria's rich culture and landmarks. By leveraging cutting-edge technology, secure payments, and reliable local partnerships, we aim to make tourism accessible, affordable, and deeply enriching for everyone.";

  return (
    <div className="goals-container">
      {/* Left Content Column */}
      <div className="content-column">
        <header className="header-section">
          <h2 className="goal-title">Our Goal</h2>
          <p className="goal-description">
            To become the leading platform that makes discovering and booking 
            tourism centres across Nigeria seamless, stress-free, and enjoyable 
            for every Nigerian at home and in the diaspora.
          </p>
          <p className="goal-description">
            We aim to eliminate the frustration of long queues, on-site ticket 
            buying, and uncertainty by providing real-time availability, transparent 
            pricing, secure payments (including instalments), and instant digital 
            tickets so users can focus on creating unforgettable memories.
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="tabs-wrapper">
          <div className="tabs-buttons">
            <button 
              className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`}
              onClick={() => setActiveTab('vision')}
            >
              Our Vision
            </button>
            <button 
              className={`tab-btn ${activeTab === 'mission' ? 'active' : ''}`}
              onClick={() => setActiveTab('mission')}
            >
              Our Mission
            </button>
          </div>
          <div className="tabs-divider"></div>
        </div>

        {/* Tab Content Dynamic Area */}
        <div className="tab-content">
          <p>{activeTab === 'vision' ? visionText : missionText}</p>
        </div>
      </div>

      {/* Right Image Column */}
      <div className="image-column">
        <div className="image-wrapper">
          <img 
            src={forest} 
            alt="Wooden bridge over a lush, green forest canopy" 
            className="side-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Ourgoal;