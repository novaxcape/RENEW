import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Login / signup pages: send already-logged-in users away.
const PublicRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole } = useAuth();

  // Only the client and vendor auth pages redirect; other usages just render.
  const isAuthPage = role === undefined || role === "vendor";
  if (isAuthenticated && isAuthPage) {
    return <Navigate to={userRole === "vendor" ? "/vendor/dashboard" : "/"} replace />;
  }
  return children;
};

export default PublicRoute;
