import { useState, useRef, useEffect } from "react";
import { FiBell, FiChevronDown, FiSearch, FiMenu } from "react-icons/fi";
import "../Styles/Dashboard.css";

const notifications = [
  { id: 1, title: "New booking for lekki conservation centre", time: "3 hours ago" },
  { id: 2, title: "Payment received – #15,000", time: "2 hours ago" },
  { id: 3, title: "Review posted by customer", time: "1 hour ago" },
];

const TopNavbar = ({ onMenuOpen = () => {} }) => {
   
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorName, setVendorName] = useState("Lekki CC"); // Default fallback
  const notifRef = useRef(null);

  // Get vendor name from localStorage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem("Names");
    if (storedName) {
      setVendorName(storedName);
    }
  }, []);

  // Handle click outside for notifications
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <div className="iconwrapper" ref={notifRef}>
        <div className="iconbell" onClick={() => setShowNotifications(!showNotifications)}>
          <FiBell size={20} color="#334155" />
        </div>
        <span className="icondot"></span>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <p className="notification-title">Notification</p>
                <span className="notification-badge">1 new</span>
              </div>
              {notifications.map((n) => (
                <div className="notification-item" key={n.id}>
                  <p className="notification-item-title">{n.title}</p>
                  <p className="notification-item-time">{n.time}</p>
                </div>
              ))}
              <button className="notification-view-all">View all notifications</button>
            </div>
          )}
        </div>

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
