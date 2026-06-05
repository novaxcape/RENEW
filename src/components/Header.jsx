import "../components/css/Header.css";
import { FaHeart, FaUser, FaBars } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom"; // 1. Imported Link, useLocation and useNavigate

const Header = () => {
  const location = useLocation(); // 2. Un-commented to track active route
  const navigate = useNavigate();

  // Helper function to check if the current path matches the link
  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <>
      <div className="header">
        <div className="header-body">
          {/* LOGO */}
          <div className="logo">
            <Link to="/">
              {" "}
              {/* 3. Made the logo clickable to go Home */}
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
              <li
                className={isActive("/")}
                role="button"
                tabIndex={0}
                onClick={() => navigate("/")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/")}
              >
                <Link to="/">Home</Link>
              </li>

              <li
                className={isActive("/discover")}
                role="button"
                tabIndex={0}
                onClick={() => navigate("/discover")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/discover")}
              >
                <Link to="/discover">Discover</Link>
              </li>

              <li
                className={isActive("/centres")}
                role="button"
                tabIndex={0}
                onClick={() => navigate("/centres")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/centres")}
              >
                <Link to="/centres">ForCenter</Link>
              </li>

              <li
                className={isActive("/about")}
                role="button"
                tabIndex={0}
                onClick={() => navigate("/about")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/about")}
              >
                <Link to="/about">About us</Link>
              </li>

              <li
                className={isActive("/support")}
                role="button"
                tabIndex={0}
                onClick={() => navigate("/support")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/support")}
              >
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
            <Link to="/signup">
              <button className="signin">Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
