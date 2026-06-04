import "../components/css/Header.css";
import { FaHeart, FaUser, FaBars } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom"; // 1. Imported Link and useLocation

const Header = () => {
  const location = useLocation(); // 2. Un-commented to track active route

  // Helper function to check if the current path matches the link
  const isActive = (path) => location.pathname === path ? "active-link" : "";

  return (
    <>
      <div className="header">
        <div className="header-body">

          {/* LOGO */}
          <div className="logo">
            <Link to="/"> {/* 3. Made the logo clickable to go Home */}
              <img
                src="/novaxcape/logo.png"
                alt="Novaxcape"
                className="header-logo-img"
              />
            </Link>
          </div>

          {/* NAV LINKS */}
          <div className="link">
            <ul>
              <li className={isActive("/")}>
                <Link to="/">Home</Link>
              </li>
              <li className={isActive("/discoverpage")}>
                <Link to="/discover">Discover</Link>
              </li>
              <li className={isActive("/centres")}>
                <Link to="/for-center">ForCenter</Link>
              </li>
              <li className={isActive("/about")}>
                <Link to="/about">About us</Link>
              </li>
              <li className={isActive("/support")}>
                <Link to="/support">Support</Link>
              </li>
            </ul>
          </div>

          {/* RIGHT SIDE */}
          <div className="button">

            {/* MOBILE ICONS */}
            <div className="mobile-icons">
              <FaHeart />
              <FaUser />
              <FaBars />
            </div>

            {/* DESKTOP BUTTON */}
            <button className="signin">Sign Up</button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Header;
