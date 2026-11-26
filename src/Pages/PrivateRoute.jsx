import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// <PrivateRoute>            -> any logged-in user
// <PrivateRoute role="vendor"> -> only that role
const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole } = useAuth();
  const location = useLocation();
  const loginPath = role === "vendor" ? "/vendor/login" : "/signin";

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname + location.search }} />;
  }
  if (role && userRole !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;
