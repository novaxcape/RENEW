import { NavLink, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [showExitModal, setShowExitModal] = useState(false);

  const menuItems = [
    { icon: <FiGrid />, label: "Dashboard", path: "/vendor/dashboard" },
    {
      icon: <FiCalendar />,
      label: "Bookings",
      path: "/vendor/dashboard/bookings",
    },
     {
      icon: <img
              src="/novaxcape/pass.png"
              alt="exit"
              style={{ width: "20px", height: "20px" }}
            /> ,
      label: "Verify Passcode",
      path: "/vendor/dashboard/verify",
    },

    {
      icon: <FiDollarSign />,
      label: "Wallet",
      path: "/vendor/dashboard/wallet",
    },
    {
      icon: <img
              src="/novaxcape/pack.png"
              alt="exit"
              style={{ width: "20px", height: "20px" }}
            /> ,
      label: "Packages",
      path: "/vendor/dashboard/package",
    },


    {
      icon: <FiSettings />,
      label: "Settings",
      path: "/vendor/dashboard/settings",
    },
    {
      icon: <FiHelpCircle />,
      label: "Support",
      path: "/support",
    },
  ];

  return (
    <>
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <button
          className="mobile-sidebar-close"
          type="button"
          onClick={onMobileClose}
          aria-label="Close menu"
        >
          <FiX />
        </button>
        <div className="sidebar-top">
          <div className="logo-section">
            <img
              src="/novaxcape/logo.png"
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
                onClick={onMobileClose}
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

      {showExitModal && (
        <div className="modal-overlay" onClick={() => setShowExitModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Exit Vendor Portal?</h2>
            <p className="modal-desc">
              Are you sure you want to proceed? You’re about to switch from the
              vendor portal to public Novaxcape interface, this action will log
              you out of the partner dashboard.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={() => setShowExitModal(false)}
              >
                No, Cancel
              </button>
              <button
                type="button"
                className="modal-btn-exit"
                onClick={() => {
                  setShowExitModal(false);
                  navigate("/");
                }}
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
