// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children, role = "client" }) => {
  const { userToken, isVendor } = useSelector((state) => state.auth);
  const vendorToken = localStorage.getItem("vendorToken");

  if (role === "vendor") {
    if (isVendor && vendorToken) {
      return <Navigate to="/vendor/dashboard" replace />;
    }
    return children;
  }

  // If already logged in, redirect to home
  if (userToken) {
    return <Navigate to="/" replace />;
  }

  // If not logged in, show the public page
  return children;
};

export default PublicRoute;
