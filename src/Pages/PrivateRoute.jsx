import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../api/api";

// Sends visitors without a login token to the right sign-in page.
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  if (isLoggedIn()) return children;

  const loginPath = localStorage.getItem("role") === "vendor" ? "/vendor/login" : "/signin";
  return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
};

export default PrivateRoute;
