// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { userToken } = useSelector((state) => state.auth);
  
  // If already logged in, redirect to home
  if (userToken) {
    return <Navigate to="/" replace />;
  }
  
  // If not logged in, show the public page
  return children;
};

export default PublicRoute;