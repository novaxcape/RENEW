import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, role = "client" }) => {
  const location = useLocation();
  const { userToken, isVendor } = useSelector((state) => state.auth);

  const token = userToken || localStorage.getItem("token");
  const vendorToken = localStorage.getItem("vendorToken");

  if (role === "vendor") {
    const hasVendorAccess = isVendor && Boolean(vendorToken || token);

    if (!hasVendorAccess) {
      return <Navigate to="/vendor/login" state={{ from: location }} replace />;
    }

    return children;
  }

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;