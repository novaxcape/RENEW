import { useState } from "react";
import "../Styles/Dashboard.css";

const TopNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="top-navbar">
      <div className="navbar-left">
        <h2 className="analytics-title">Analytics</h2>
      </div>

      <div className="search-bar">
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Search reports..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="top-right">
        <div className="location-selector">
          <i className="fas fa-map-marker-alt"></i>
          <span>Lekki CC</span>
          <i className="fas fa-chevron-down" style={{ fontSize: "12px" }}></i>
        </div>
        
        <div className="profile" onClick={() => setShowDropdown(!showDropdown)}>
          <img src="https://i.pravatar.cc/150?img=7" alt="Admin" />
          <span>Admin</span>
          <i className="fas fa-chevron-down" style={{ fontSize: "12px" }}></i>
        </div>
      </div>
      
      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="profile-dropdown show">
          <a href="#profile">
            <i className="fas fa-user"></i>
            <span>My Profile</span>
          </a>
          <a href="#settings">
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </a>
          <hr />
          <a href="#logout">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default TopNavbar;