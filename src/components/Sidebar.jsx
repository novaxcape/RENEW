import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiGrid,
  FiCalendar,
  FiDollarSign,
  FiSettings,
  FiHelpCircle,
  FiX,
} from "react-icons/fi";

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const [showExitModal, setShowExitModal] = useState(false);

  const menuItems = [
    { icon: <FiGrid />, label: "Dashboard", path: "/vendor/dashboard" },
    {
      icon: <FiCalendar />,
      label: "Bookings",
      path: "/vendor/dashboard/bookings",
    },
    {
      icon: <FiDollarSign />,
      label: "Revenue Trend",
      path: "/vendor/dashboard/revenue",
    },
    {
      icon: <FiSettings />,
      label: "Settings",
      path: "/vendor/dashboard/settings",
    },
    {
      icon: <FiHelpCircle />,
      label: "Support",
      path: "/vendor/dashboard/support",
    },
  ];

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo-section">
            <img
              src="/novaxcape/pic.png"
              alt="Novaxcape Logo"
              className="logo-img"
            />
            <p className="admin-portal-text">Admin Portal</p>
          </div>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/vendor/dashboard"}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="sidebar-footer">
          <p className="account-title">Accounts</p>
          <div className="logout-btn" onClick={() => setShowExitModal(true)}>
            <img
              src="/novaxcape/log.png"
              alt="exit"
              style={{ width: "20px", height: "20px" }}
            />
            <span>Exit Partner Portal</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
