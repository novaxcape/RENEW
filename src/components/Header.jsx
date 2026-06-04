import "../components/css/Header.css";
import { FaHeart, FaUser, FaBars } from "react-icons/fa";

const Header = () => {
  // const location = useLocation();
  // const isLandingPage = location.pathname === "/";
  // const isProductPage = location.pathname.startsWith("/product");

  return (
    <>
      <div className="header">
        <div className="header-body">

          {/* LOGO */}
          <div className="logo">
            <img
              src="/novaxcape/logo.png"
              alt="Novaxcape"
              className="header-logo-img"
            />
          </div>

          {/* NAV LINKS */}
          <div className="link">
            <ul>
              <li>Home</li>
              <li>Discover</li>
              <li>ForCenter</li>
              <li>About us</li>
              <li>Support</li>
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