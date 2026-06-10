import React, { useState } from 'react';
import '../components/css/Ourgoal.css';
import forest from "/novaxcape/forest.png";

const Ourgoal = () => {
  const [activeTab, setActiveTab] = useState('vision');

  const visionText = "To become Africa's most trusted and comprehensive tourism booking platform, inspiring millions to explore their local heritage and discover the beauty that surrounds them. We envision a future where every Nigerian has easy access to unforgettable experiences in their own backyard.";
  
  const missionText = "To make tourism accessible and affordable for all Nigerians by providing a seamless digital platform that connects people with amazing destinations. We're committed to supporting local tourism centres,  promoting cultural preservation, and creating memorable experiences for every visitor.";
  return (
    <div className="goals-container">
      
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

        <div className="tab-content">
          <p>{activeTab === 'vision' ? visionText : missionText}</p>
        </div>
      </div>

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