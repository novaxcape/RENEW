// components/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getVendorTouristCenters, getAllPackages } from "../redox/apiSlice";
import { setVendorStatus } from "../redox/authSlice";

const PrivateRoute = ({ children, role = "client" }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);
  
  const { 
    userToken, 
    isAuthenticated, 
    isVendor, 
    vendorId,
    vendorHasCentre,
    vendorHasPackages 
  } = useSelector((state) => state.auth);
  const { vendorCentres, packages } = useSelector((state) => state.api);

  // Check for token in localStorage as fallback
  const token = userToken || localStorage.getItem("userToken") || localStorage.getItem("token");
  const vendorToken = localStorage.getItem("vendorToken");
  const vendorIdFromStorage = vendorId || localStorage.getItem("vendorId");

  // For vendor routes
  if (role === "vendor") {
    const hasVendorAccess = isVendor && Boolean(vendorToken || token);

    if (!hasVendorAccess) {
      return <Navigate to="/vendor/login" state={{ from: location }} replace />;
    }

    // Check vendor status and redirect
    useEffect(() => {
      const checkVendorStatus = async () => {
        try {
          // Skip if already checked or no vendor ID
          if (!vendorIdFromStorage) {
            setRedirectTo("/vendor/add-centre");
            setChecking(false);
            return;
          }

          // If we already have status in Redux, use it
          if (vendorHasCentre !== undefined) {
            setChecking(false);
            return;
          }

          // Fetch vendor centres
          const centresResult = await dispatch(
            getVendorTouristCenters(vendorIdFromStorage)
          ).unwrap();
          
          const centres = centresResult?.data || centresResult || [];
          const hasCentre = centres.length > 0;

          // Check if vendor has packages
          let hasPackages = false;
          if (hasCentre && centres[0]?.id) {
            const packagesResult = await dispatch(
              getAllPackages(centres[0].id)
            ).unwrap();
            const packagesList = packagesResult?.data || packagesResult || [];
            hasPackages = packagesList.length > 0;
          }

          // Update vendor status in auth state
          dispatch(
            setVendorStatus({
              hasCentre,
              hasPackages,
              vendorId: vendorIdFromStorage,
            })
          );

          // Determine redirect based on status and current path
          const currentPath = location.pathname;
          
          if (!hasCentre) {
            if (currentPath !== "/vendor/add-centre") {
              setRedirectTo("/vendor/add-centre");
            }
          } else if (!hasPackages) {
            if (currentPath !== "/vendor/add-package") {
              setRedirectTo("/vendor/add-package");
            }
          } else {
            // Has both - redirect to dashboard if on add pages
            if (currentPath === "/vendor/add-centre" || currentPath === "/vendor/add-package") {
              setRedirectTo("/vendor/dashboard");
            }
          }
        } catch (error) {
          console.error("Error checking vendor status:", error);
          setRedirectTo("/vendor/add-centre");
        } finally {
          setChecking(false);
        }
      };

      // Only check if authenticated and vendor
      if (isAuthenticated && isVendor) {
        checkVendorStatus();
      } else {
        setChecking(false);
      }
    }, [dispatch, isAuthenticated, isVendor, vendorIdFromStorage, location.pathname]);

    // Show loading while checking
    if (checking) {
      return (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh",
          flexDirection: "column",
          gap: "20px"
        }}>
          <div className="spinner"></div>
          <p>Checking vendor status...</p>
        </div>
      );
    }

    // Redirect if needed
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // If vendor has centre and packages, render children
    if (vendorHasCentre && vendorHasPackages) {
      return children;
    }

    // If vendor doesn't have centre or packages, don't render
    return null;
  }

  // For client routes
  if (!token || !isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;