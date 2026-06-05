import "../components/css/Header.css";
import { FaHeart, FaUser, FaBars } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="header">
        <div className="header-body">
          {/* LOGO */}
          <div className="logo">
            <Link to="/">
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
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/discover"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Discover
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/centres"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  ForCenter
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  About us
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/support"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Support
                </NavLink>
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
