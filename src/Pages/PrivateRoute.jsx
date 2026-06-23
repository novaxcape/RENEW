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
    vendorHasPackages,
  } = useSelector((state) => state.auth);

  const token =
    userToken ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("token");
  const vendorToken = localStorage.getItem("vendorToken");
  const vendorIdFromStorage = vendorId || localStorage.getItem("vendorId");

  // ✅ Define onboarding pages that should skip status checks
  const onboardingPages = ["/add-centre", "/kyc", "/vendor/dashboard/package"];

  useEffect(() => {
    const checkVendorStatus = async () => {
      try {
        // ✅ Skip checking on onboarding pages
        if (onboardingPages.includes(location.pathname)) {
          console.log(
            `📄 Onboarding page detected: ${location.pathname}, skipping status check`,
          );
          setChecking(false);
          return;
        }

        // ✅ Check localStorage for KYC completion
        const kycSubmitted = localStorage.getItem("kycSubmitted") === "true";
        const hasCentreFromStorage =
          localStorage.getItem("vendorHasCentre") === "true";
        const hasPackagesFromStorage =
          localStorage.getItem("vendorHasPackages") === "true";

        if (kycSubmitted && hasCentreFromStorage && hasPackagesFromStorage) {
          console.log("✅ KYC already submitted, vendor is complete");

          dispatch(
            setVendorStatus({
              hasCentre: true,
              hasPackages: true,
              vendorId: vendorIdFromStorage,
            }),
          );

          // ✅ Clear any previous redirect
          setRedirectTo(null);
          setChecking(false);
          return;
        }

        if (!vendorIdFromStorage) {
          setRedirectTo("/add-centre");
          setChecking(false);
          return;
        }

        // ✅ Check Redux state first before API call
        if (vendorHasCentre !== undefined && vendorHasPackages !== undefined) {
          const currentPath = location.pathname;

          if (!vendorHasCentre) {
            setRedirectTo("/add-centre");
          } else if (!vendorHasPackages) {
            setRedirectTo("/vendor/dashboard/package");
          } else if (vendorHasCentre && vendorHasPackages) {
            if (onboardingPages.includes(currentPath)) {
              setRedirectTo("/vendor/dashboard");
            }
          }

          setChecking(false);
          return;
        }

        // Fetch vendor centres
        const centresResult = await dispatch(
          getVendorTouristCenters(vendorIdFromStorage),
        ).unwrap();

        const centres = centresResult?.data || centresResult || [];
        const hasCentre = centres.length > 0;

        let hasPackages = false;
        if (hasCentre && centres[0]?.id) {
          try {
            const packagesResult = await dispatch(
              getAllPackages(centres[0].id),
            ).unwrap();
            const packagesList = packagesResult?.data || packagesResult || [];
            hasPackages = packagesList.length > 0;
          } catch (pkgError) {
            console.error("Error fetching packages:", pkgError);
            hasPackages = false;
          }
        }

        // Update vendor status in auth state
        dispatch(
          setVendorStatus({
            hasCentre,
            hasPackages,
            vendorId: vendorIdFromStorage,
          }),
        );

        if (!hasCentre) {
          setRedirectTo("/add-centre");
        } else if (!hasPackages) {
          setRedirectTo("/vendor/dashboard/package");
        }
      } catch (error) {
        console.error("Error checking vendor status:", error);
        setRedirectTo("/add-centre");
      } finally {
        setChecking(false);
      }
    };

    if (isAuthenticated && isVendor) {
      checkVendorStatus();
    } else {
      setChecking(false);
    }
  }, [
    dispatch,
    isAuthenticated,
    isVendor,
    vendorIdFromStorage,
    location.pathname,
    vendorHasCentre,
    vendorHasPackages,
  ]);

  // For vendor routes
  if (role === "vendor") {
    const hasVendorAccess = isVendor && Boolean(vendorToken || token);

    if (!hasVendorAccess) {
      return <Navigate to="/vendor/login" state={{ from: location }} replace />;
    }

    if (checking) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div className="spinner"></div>
          <p>Checking vendor status...</p>
        </div>
      );
    }

    // ✅ Check if KYC is submitted
    const kycSubmitted = localStorage.getItem("kycSubmitted") === "true";

    // ✅ Get status from Redux or localStorage
    const hasCentre = vendorHasCentre || localStorage.getItem("vendorHasCentre") === "true";
    const hasPackages = vendorHasPackages || localStorage.getItem("vendorHasPackages") === "true";

    // ✅ If KYC is completed, allow access to all pages
    if (kycSubmitted && hasCentre && hasPackages) {
      return children;
    }

    // ✅ If on onboarding page, allow access
    if (onboardingPages.includes(location.pathname)) {
      return children;
    }

    // ✅ Redirect if needed
    if (redirectTo && !onboardingPages.includes(location.pathname)) {
      return <Navigate to={redirectTo} replace />;
    }

    // ✅ Check status and redirect
    if (!hasCentre) {
      return <Navigate to="/add-centre" replace />;
    }

    if (!hasPackages) {
      return <Navigate to="/vendor/dashboard/package" replace />;
    }

    return children;
  }

  // For client routes
  if (!token || !isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;