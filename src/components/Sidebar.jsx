import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = () => {
  const menuItems = [
    {
      icon: <FiGrid />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <FiCalendar />,
      label: "Bookings",
      path: "/dashboard/bookings",
    },
    {
      icon: <FiBarChart2 />,
      label: "Revenue Trend",
      path: "/dashboard/revenue",
    },
    {
      icon: <FiSettings />,
      label: "Settings",
      path: "/dashboard/settings",
    },
    {
      icon: <FiHelpCircle />,
      label: "Support",
      path: "/dashboard/support",
    },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div>
        <div className="logo-section">
          <img
            src="/novaxcape/logo.png"
            alt="Novaxcape Logo"
            className="logo"
          />

          <p>Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
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

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="account-section">
          <p className="account-title">ACCOUNT</p>

          <button className="logout-btn">
            <FiLogOut />
            <span>Exit Partner Portal</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
