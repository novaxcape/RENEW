import { useState, useEffect } from "react";
import { FiSearch, FiMenu } from "react-icons/fi";
import "../Styles/Dashboard.css";

const TopNavbar = ({ onMenuOpen = () => {} }) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [vendorName, setVendorName] = useState("Lekki CC"); // Default fallback

  // Get vendor name from localStorage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem("Names");
    if (storedName) {
      setVendorName(storedName);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("Names");
    // Add any other cleanup (tokens, etc.)
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="top-navbar">
      <div className="navbar-left">
        <h2 className="analytics-title">Analytics</h2>
      </div>

      <div className="navbar-mobile1-logo">
        <img src="/novaxcape/logo.png" alt="Novaxcape" />
      </div>

      <div className="search-bar">
        <FiSearch size={15} color="#1e293b" />
        <input
          type="text"
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="top-right">
        <div className="profile">
          <img src="/novaxcape/profile.png" alt="Admin" />
          <div className="profile-info">
            <span className="profile-name">
              {vendorName}
            </span>
            <span className="profile-role">Admin</span>
          </div>
        </div>

        <button
          className="hamburger-btn"
          type="button"
          onClick={onMenuOpen}
          aria-label="Open menu"
        >
          <FiMenu size={24} />
        </button>
      </div>

    </div>
  );
};

export default TopNavbar;