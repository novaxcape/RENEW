import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import "./css/BookingSummary.css";
import { 
  createBooking, 
  initializePayment, 
  getPackageById,
  getPaymentPlans 
} from "../redox/apiSlice";

const SERVICE_FEE = 500;

const decodeJwtPayload = (token) => {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalizedPayload));
  } catch (error) {
    console.warn("Unable to decode auth token payload:", error);
    return null;
  }
};

const getEntityId = (value) =>
  value?.id ||
  value?._id ||
  value?.clientId ||
  value?.ClientId ||
  value?.userId ||
  value?.UserId ||
  null;

const getRoleName = (value) =>
  value?.role ||
  value?.Role ||
  value?.userType ||
  value?.type ||
  "";

const getPackageTouristId = (pkg, centre, fallbackId) =>
  pkg?.touristId ||
  pkg?.tourist?.id ||
  pkg?.tourist?._id ||
  pkg?.touristCentre?.id ||
  pkg?.touristCentre?._id ||
  centre?.touristId ||
  centre?.id ||
  centre?._id ||
  fallbackId;

const getLocalDateInputValue = (dateValue = new Date()) => {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateInputValue = (dateValue) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue || "")) {
    return null;
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return parsedDate;
};

const getVisitDateError = (dateValue, minimumDateValue) => {
  if (!dateValue) {
    return "Please select a visit date.";
  }

  const selectedDate = parseDateInputValue(dateValue);
  const minimumDate = parseDateInputValue(minimumDateValue);

  if (!selectedDate) {
    return "Please enter a valid visit date.";
  }

  if (minimumDate && selectedDate < minimumDate) {
    return "Please select today or a future visit date.";
  }

  return "";
};

export default function BookingSummaryPage() {
  const navigate = useNavigate();
  const { touristId, packageId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loggedInUser, userToken, isAuthenticated } = useSelector(
    (state) => state.auth,
  );
  const { 
    bookingLoading, 
    bookingError,
    selectedPackage,
    packagesLoading,
    paymentPlans,
    paymentPlanLoading
  } = useSelector((state) => state.api);

  const [bookingData, setBookingData] = useState({
    packageDetails: location.state?.packageDetails || null,
    centreDetails: location.state?.centreDetails || null,
  });

  const [date, setDate] = useState("");
  const [quantities, setQuantities] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [packageData, setPackageData] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const minimumVisitDate = useMemo(() => getLocalDateInputValue(), []);
  const authToken =
    userToken ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("vendorToken");
  const tokenPayload = useMemo(() => decodeJwtPayload(authToken), [authToken]);
  const authenticatedRole = (
    getRoleName(loggedInUser) ||
    getRoleName(tokenPayload)
  ).toLowerCase();
  const authenticatedClientId =
    authenticatedRole === "vendor"
      ? null
      : getEntityId(loggedInUser) ||
        localStorage.getItem("clientId") ||
        getEntityId(tokenPayload);
  const bookingTouristId = getPackageTouristId(
    packageData || bookingData.packageDetails,
    bookingData.centreDetails,
    touristId
  );

  console.log("📄 BookingSummaryPage - Mounted");
  console.log("📄 touristId:", touristId);
  console.log("📄 packageId:", packageId);

  // ✅ Fetch package details and payment plans
  useEffect(() => {
    const fetchPackageData = async () => {
      if (location.state?.packageDetails) {
        const pkg = location.state.packageDetails;
        setPackageData(pkg);
        setBookingData(prev => ({
          ...prev,
          packageDetails: pkg,
          centreDetails: location.state.centreDetails || prev.centreDetails,
        }));
        generateTicketTypes(pkg);
        return;
      }

      if (packageId) {
        try {
          console.log("📦 Fetching package details for ID:", packageId);
          
          const packageResult = await dispatch(getPackageById(packageId)).unwrap();
          console.log("📦 Package details fetched:", packageResult);
          
          const pkg = packageResult?.data || packageResult?.package || packageResult;
          setPackageData(pkg);
          setBookingData(prev => ({
            ...prev,
            packageDetails: pkg,
            centreDetails: pkg?.touristCentre || pkg?.centre || prev.centreDetails,
          }));

          console.log("📋 Fetching payment plans for package:", packageId);
          const plansResult = await dispatch(getPaymentPlans(packageId)).unwrap();
          console.log("📋 Payment plans fetched:", plansResult);
          
          const plans = plansResult?.data || plansResult?.plans || plansResult || [];
          generateTicketTypes(pkg, plans);
          
        } catch (error) {
          console.error("❌ Failed to fetch package data:", error);
          const savedData = localStorage.getItem("selectedPackage");
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              setPackageData(parsed);
              setBookingData(prev => ({
                ...prev,
                packageDetails: parsed,
              }));
              generateTicketTypes(parsed);
            } catch (e) {
              console.error("Error parsing saved package:", e);
            }
          }
        }
      }
    };

    fetchPackageData();
  }, [dispatch, packageId, location.state]);

  const generateTicketTypes = (pkg, plans = []) => {
    console.log("🔄 Generating ticket types from:", { pkg, plans });
    
    let types = [];

    if (plans && plans.length > 0) {
      types = plans.map((plan, index) => ({
        id: plan.id || `plan-${index}`,
        label: plan.planName || plan.name || `Plan ${index + 1}`,
        description: plan.description || `${plan.planName || 'Package'} - ₦${(plan.amount || 0).toLocaleString()}`,
        price: plan.amount || plan.price || 0,
        planId: plan.id,
        isInstallment: plan.isInstallment || false,
      }));
    } else if (pkg?.packages && Array.isArray(pkg.packages) && pkg.packages.length > 0) {
      types = pkg.packages.map((pkgItem, index) => ({
        id: pkgItem.id || `pkg-${index}`,
        label: pkgItem.packageType || pkgItem.name || `Package ${index + 1}`,
        description: pkgItem.description || `${pkgItem.packageType || 'Package'} - ₦${(pkgItem.amount || 0).toLocaleString()}`,
        price: pkgItem.amount || pkgItem.price || 0,
        packageId: pkgItem.id,
      }));
    } else if (pkg?.ticketTypes && Array.isArray(pkg.ticketTypes)) {
      types = pkg.ticketTypes.map((ticket, index) => ({
        id: ticket.id || `ticket-${index}`,
        label: ticket.name || ticket.label || `Ticket ${index + 1}`,
        description: ticket.description || `${ticket.name || 'Ticket'} - ₦${(ticket.price || 0).toLocaleString()}`,
        price: ticket.price || 0,
      }));
    } else if (pkg?.amount || pkg?.price) {
      const amount = pkg.amount || pkg.price || 0;
      types = [{
        id: 'standard',
        label: 'Standard Ticket',
        description: `${pkg.packageName || pkg.name || 'Package'} - ₦${amount.toLocaleString()}`,
        price: amount,
      }];
    }

    console.log("✅ Generated ticket types:", types);
    setTicketTypes(types);

    const initialQuantities = {};
    types.forEach((ticket, index) => {
      initialQuantities[ticket.id] = index === 0 ? 1 : 0;
    });
    setQuantities(initialQuantities);
  };

  const fallbackTicketTypes = useMemo(() => [
    {
      id: "adult",
      label: "Adult",
      description: "Ages 18+ - N2,500",
      price: 2500,
    },
    {
      id: "child",
      label: "Child",
      description: "Ages 5-7 - N1,500",
      price: 1500,
    },
    {
      id: "family",
      label: "Family pack",
      description: "2 Adults + 2 Childrens - N7,000",
      price: 7000,
    },
  ], []);

  const displayTicketTypes = ticketTypes.length > 0 ? ticketTypes : fallbackTicketTypes;

  // ✅ Check authentication on mount
  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("userToken");
    const isLoggedIn = !!token || isAuthenticated;

    if (!isLoggedIn) {
      console.log("🚫 User not authenticated - redirecting to signin");

      const pendingData = {
        touristId: bookingTouristId,
        centreId: bookingTouristId,
        clientId: authenticatedClientId,
        packageId: packageId,
        packageDetails: bookingData.packageDetails,
        centreDetails: bookingData.centreDetails,
        returnUrl: `/booking-summary/${bookingTouristId}/${packageId}`,
      };
      localStorage.setItem("pendingBooking", JSON.stringify(pendingData));

      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please log in to complete your booking.",
        confirmButtonColor: "#ff6b35",
        confirmButtonText: "Go to Login",
      }).then(() => {
        navigate("/signin", {
          state: {
            from: `/booking-summary/${bookingTouristId}/${packageId}`,
            bookingData: pendingData,
          },
        });
      });
    }
  }, [
    isAuthenticated,
    navigate,
    touristId,
    packageId,
    bookingData,
    authenticatedClientId,
    bookingTouristId,
  ]);

  // ✅ Restore from localStorage if needed
  useEffect(() => {
    if (!bookingData.packageDetails) {
      const pendingBooking = localStorage.getItem("pendingBooking");
      if (pendingBooking) {
        try {
          const parsed = JSON.parse(pendingBooking);
          setBookingData({
            packageDetails: parsed.packageDetails,
            centreDetails: parsed.centreDetails,
          });
          setPackageData(parsed.packageDetails);
          
          if (parsed.packageDetails) {
            generateTicketTypes(parsed.packageDetails);
          }
        } catch (e) {
          console.error("Error parsing pending booking:", e);
        }
      }
    }
  }, [bookingData.packageDetails]);

  console.log("booking data:", bookingData);
  console.log("ticket types:", displayTicketTypes);

  const increment = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const decrement = (id) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));

  const subtotal = displayTicketTypes.reduce(
    (sum, t) => sum + t.price * (quantities[t.id] || 0),
    0,
  );
  const total = subtotal + SERVICE_FEE;

  const formatNaira = (amount) => `₦${amount.toLocaleString("en-NG")}`;

  const summaryItems = displayTicketTypes.filter(
    (t) => (quantities[t.id] || 0) > 0
  );
  const visitDateError = useMemo(
    () => getVisitDateError(date, minimumVisitDate),
    [date, minimumVisitDate]
  );
  const canContinueToPayment =
    !bookingLoading &&
    !isProcessing &&
    !visitDateError &&
    summaryItems.length > 0;

  // ✅ Handle payment - FIXED: initializePayment now only sends bookingId
  const handleContinueToPayment = async ({ isInstallment = false } = {}) => {
    console.log("🚀 Starting payment process...");
    
    const token = localStorage.getItem("token") || localStorage.getItem("userToken");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please log in to complete your booking.",
        confirmButtonColor: "#ff6b35",
        confirmButtonText: "Go to Login",
      }).then(() => {
        navigate("/signin", {
          state: {
            from: `/booking-summary/${touristId}/${packageId}`,
            bookingData: {
              touristId: bookingTouristId,
              centreId: bookingTouristId,
              packageId: packageId,
              packageDetails: bookingData.packageDetails,
              centreDetails: bookingData.centreDetails,
            },
          },
        });
      });
      return;
    }

    const currentVisitDateError = getVisitDateError(date, minimumVisitDate);
    if (currentVisitDateError) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: currentVisitDateError,
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    if (summaryItems.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No Tickets Selected",
        text: "Please select at least one ticket.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const [year, month, day] = date.split("-");
      const formattedDate = `${month}/${day}/${year}`;
      const selectedTicketDetails = summaryItems.map((t) => ({
        ticketType: t.id,
        ticketLabel: t.label,
        quantity: quantities[t.id] || 0,
        price: t.price,
        amount: t.price * (quantities[t.id] || 0),
      }));
      const numberOfPeople = selectedTicketDetails.reduce(
        (sum, ticket) => sum + ticket.quantity,
        0,
      );

      const bookingDataPayload = {
        visitDate: formattedDate,
        touristId: bookingTouristId,
        centreId: bookingTouristId,
        packageId,
        amount: total,
        totalAmount: total,
        subtotal,
        serviceFee: SERVICE_FEE,
        ...(isInstallment && { paymentMethod: "installment" }),
        numberOfPeople,
        ticketDetails: selectedTicketDetails,
      };

      if (authenticatedRole === "vendor") {
        Swal.fire({
          icon: "warning",
          title: "Client Account Required",
          text: "Please log in with a client account to complete a booking.",
          confirmButtonColor: "#ff6b35",
        });
        return;
      }

      if (!authenticatedClientId) {
        Swal.fire({
          icon: "warning",
          title: "Authentication Required",
          text: "Please log in again so we can confirm your client account.",
          confirmButtonColor: "#ff6b35",
          confirmButtonText: "Go to Login",
        }).then(() => {
          navigate("/signin", {
            state: {
              from: `/booking-summary/${touristId}/${packageId}`,
              bookingData: {
                touristId: bookingTouristId,
                centreId: bookingTouristId,
                packageId: packageId,
                packageDetails: bookingData.packageDetails,
                centreDetails: bookingData.centreDetails,
              },
            },
          });
        });
        return;
      }

      const bookingResult = await dispatch(
        createBooking({
          clientId: authenticatedClientId,
          centreId: bookingTouristId,
          packageId: packageId,
          bookingData: bookingDataPayload
        })
      ).unwrap();

      const bookingId =
        bookingResult?.data?.id ||
        bookingResult?.booking?.id ||
        bookingResult?.id;

      if (!bookingId) {
        throw new Error("Could not retrieve booking ID");
      }

      await Swal.fire({
        icon: "success",
        title: "🎉 Booking Created Successfully!",
        text: "Your booking has been created. Now redirecting to payment...",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      localStorage.removeItem("pendingBooking");

      // Save booking state before payment
      const bookingState = {
        bookingId: bookingId,
        amount: total,
        subtotal: subtotal,
        serviceFee: SERVICE_FEE,
        centreDetails: bookingData.centreDetails,
        packageDetails: bookingData.packageDetails,
        ticketDetails: selectedTicketDetails,
        numberOfPeople,
        date: formattedDate,
        packageId: packageId,
        touristId: bookingTouristId,
        clientId: authenticatedClientId,
        centreId: bookingTouristId,
        isInstallment,
      };
      localStorage.setItem("pendingBookingState", JSON.stringify(bookingState));

      if (isInstallment) {
        navigate(`/payment-checkout/${bookingId}`, { state: bookingState });
        return;
      }

      try {
        // ✅ FIXED: Only pass bookingId — backend reads everything else from the booking record
        const paymentResponse = await dispatch(
          initializePayment({
            bookingId,
            paymentData: {
              amount: total,
              totalAmount: total,
              subtotal,
              serviceFee: SERVICE_FEE,
              currency: "NGN",
              callbackUrl: `${window.location.origin}/booking-confirmation/${bookingId}`,
              metadata: {
                bookingId,
                packageId,
                touristId: bookingTouristId,
                clientId: authenticatedClientId,
                ticketDetails: selectedTicketDetails,
                numberOfPeople,
              },
            },
          })
        ).unwrap();

        console.log("PAYMENT RESPONSE:", paymentResponse);
        console.log("PAYMENT RESPONSE STRUCTURE:", JSON.stringify(paymentResponse, null, 2));

        const paymentResult = paymentResponse?.data || paymentResponse;
        const redirectUrl =
          paymentResult?.data?.checkout_url ||
          paymentResult?.checkout_url ||
          paymentResult?.redirect_url ||
          paymentResult?.authorization_url ||
          paymentResult?.paymentUrl ||
          paymentResponse?.redirect_url;

        if (redirectUrl && redirectUrl.startsWith('http')) {
          console.log("🔄 Redirecting to:", redirectUrl);
          await Swal.fire({
            icon: "info",
            title: "Redirecting to Payment",
            text: "You will be redirected to the payment gateway to complete your transaction.",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          
          window.location.href = redirectUrl;
        } else {
          console.warn("⚠️ No valid redirect URL found, falling back to checkout page");
          console.log("Full payment response for debugging:", JSON.stringify(paymentResponse, null, 2));
          
          const result = await Swal.fire({
            icon: "success",
            title: "Booking Created Successfully!",
            html: `
              <p>Your booking has been created with ID: <strong>${bookingId}</strong></p>
              <p>Total Amount: <strong>${formatNaira(total)}</strong></p>
              <p style="margin-top: 15px; color: #666; font-size: 14px;">
                Please complete your payment by clicking the button below.
              </p>
              <p style="margin-top: 15px;">
                <button onclick="window.location.href='/payment-checkout/${bookingId}'" 
                        style="background: #ff6b35; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
                  Complete Payment
                </button>
              </p>
            `,
            confirmButtonColor: "#ff6b35",
            confirmButtonText: "View My Bookings",
          });
          
          if (result.isConfirmed) {
            navigate("/my-bookings");
          }
        }
      } catch (paymentError) {
        console.error("❌ Payment initialization failed:", paymentError);
        
        const result = await Swal.fire({
          icon: "warning",
          title: "Booking Created but Payment Failed",
          html: `
            <p>Your booking was created successfully with ID: <strong>${bookingId}</strong></p>
            <p>Total Amount: <strong>${formatNaira(total)}</strong></p>
            <p style="margin-top: 15px; color: #666; font-size: 14px;">
              ${paymentError?.message || "Please try to complete your payment later or contact support."}
            </p>
            <p style="margin-top: 15px;">
              <button onclick="window.location.href='/payment-checkout/${bookingId}'" 
                      style="background: #ff6b35; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
                Retry Payment
              </button>
            </p>
          `,
          confirmButtonColor: "#ff6b35",
          confirmButtonText: "Go to My Bookings",
        });
        
        if (result.isConfirmed) {
          navigate("/my-bookings");
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);

      let errorMessage = "Unable to process your booking. Please try again.";
      const errorText = typeof error === "string" ? error : error?.message;

      if (errorText === "Client not found") {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please log in again to continue with your booking.",
          confirmButtonColor: "#ff6b35",
          confirmButtonText: "Go to Login",
        }).then(() => {
          navigate("/signin", {
            state: {
              from: `/booking-summary/${touristId}/${packageId}`,
              bookingData: {
                touristId: bookingTouristId,
                centreId: bookingTouristId,
                packageId: packageId,
                packageDetails: bookingData.packageDetails,
                centreDetails: bookingData.centreDetails,
              },
            },
          });
        });
        return;
      } else if (errorText) {
        errorMessage = errorText;
      }

      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: errorMessage,
        confirmButtonColor: "#ff6b35",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Loading state
  if (packagesLoading || paymentPlanLoading) {
    return (
      <div className="bp-page">
        <div className="bp-header">
          <h1 className="bp-title">Loading Package Details...</h1>
        </div>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div className="spinner"></div>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  if (!bookingData.packageDetails && !packageData) {
    return (
      <div className="bp-page">
        <div className="bp-header">
          <h1 className="bp-title">Complete Your Booking</h1>
          <p className="bp-subtitle">Just a few more steps to your booking</p>
        </div>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2>No Booking Data Found</h2>
          <p>Please select a package to book.</p>
          <button
            onClick={() => navigate("/discover")}
            style={{
              background: "#ff6b35",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "16px",
            }}
          >
            Browse Centres
          </button>
        </div>
      </div>
    );
  }

  const displayPackage = packageData || bookingData.packageDetails;
  const displayCentre = bookingData.centreDetails;

  return (
    <div className="bp-page">
      <div className="bp-header">
        <h1 className="bp-title">Complete Your Booking</h1>
        <p className="bp-subtitle">Just a few more steps to your booking</p>

        {displayCentre && (
          <div
            className="bp-booking-info"
            style={{
              background: "#f8f9fa",
              padding: "16px 24px",
              borderRadius: "12px",
              marginTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong>
                {displayCentre.centreName || displayCentre.name}
              </strong>
              <span style={{ marginLeft: "16px", color: "#666" }}>
                {displayCentre.city}, {displayCentre.state}
              </span>
            </div>
            <div>
              <span style={{ color: "#666" }}>
                Package: {displayPackage?.packageName || displayPackage?.name || "Package"}
              </span>
              <span
                style={{
                  marginLeft: "16px",
                  fontWeight: 600,
                  color: "#ff6b35",
                }}
              >
                ₦
                {displayPackage?.amount?.toLocaleString() ||
                  displayPackage?.price?.toLocaleString() ||
                  "0"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="bp-layout">
        <div className="bp-card bp-left-card">
          <section className="bp-section">
            <h2 className="bp-section-title">Select Visit Date</h2>
            <div className="bp-date-input-wrapper">
              <input
                type="date"
                className="bp-date-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minimumVisitDate}
                aria-invalid={Boolean(visitDateError)}
                aria-describedby="visit-date-error"
              />
            </div>
            {visitDateError && (
              <p className="bp-error" id="visit-date-error">
                {visitDateError}
              </p>
            )}
          </section>

          <section className="bp-section">
            <h2 className="bp-section-title">Select Ticket</h2>
            <div className="bp-tickets">
              {displayTicketTypes.map((ticket) => (
                <div key={ticket.id} className="bp-ticket-row">
                  <div className="bp-ticket-info">
                    <span className="bp-ticket-label">{ticket.label}</span>
                    <span className="bp-ticket-desc">{ticket.description}</span>
                  </div>
                  <div className="bp-counter">
                    <button
                      className="bp-counter-btn"
                      onClick={() => decrement(ticket.id)}
                      aria-label={`Decrease ${ticket.label}`}
                    >
                      <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                        <path
                          d="M1 1h12"
                          stroke="#271A13"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <span className="bp-counter-value">
                      {quantities[ticket.id] || 0}
                    </span>
                    <button
                      className="bp-counter-btn"
                      onClick={() => increment(ticket.id)}
                      aria-label={`Increase ${ticket.label}`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M7 1v12M1 7h12"
                          stroke="#271A13"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="bp-card bp-right-card">
          <h2 className="bp-summary-title">Booking Summary</h2>

          {displayPackage && (
            <div className="bp-summary-package" style={{
              background: "#f8f9fa",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600 }}>
                  {displayPackage.packageName || displayPackage.name || "Package"}
                </span>
                <span style={{ color: "#ff6b35", fontWeight: 600 }}>
                  ₦{(displayPackage.amount || displayPackage.price || 0).toLocaleString()}
                </span>
              </div>
              {displayPackage.description && (
                <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
                  {displayPackage.description}
                </p>
              )}
            </div>
          )}

          <div className="bp-summary-items">
            {summaryItems.map((t) => (
              <div key={t.id} className="bp-summary-row">
                <div className="bp-summary-item-info">
                  <span className="bp-summary-item-name">
                    {t.label} x {quantities[t.id] || 0}
                  </span>
                  <span className="bp-summary-item-price-desc">
                    ₦{t.price.toLocaleString("en-NG")} each
                  </span>
                </div>
                <span className="bp-summary-item-total">
                  {formatNaira(t.price * (quantities[t.id] || 0))}
                </span>
              </div>
            ))}
          </div>

          <div className="bp-summary-divider" />

          <div className="bp-summary-fees">
            <div className="bp-fee-row">
              <span className="bp-fee-label">Subtotal</span>
              <span className="bp-fee-value">{formatNaira(subtotal)}</span>
            </div>
            <div className="bp-fee-row">
              <span className="bp-fee-label">Service fee</span>
              <span className="bp-fee-value">{formatNaira(SERVICE_FEE)}</span>
            </div>
          </div>

          <div className="bp-summary-divider" />

          <div className="bp-total-row">
            <span className="bp-total-label">Total</span>
            <span className="bp-total-value">{formatNaira(total)}</span>
          </div>

          <button
            className="bp-cta-btn"
            onClick={() => handleContinueToPayment()}
            disabled={!canContinueToPayment}
          >
            {bookingLoading || isProcessing
              ? "Processing..."
              : "Continue To Payment"}
          </button>

          <button
            type="button"
            className="bp-installment"
            onClick={() => handleContinueToPayment({ isInstallment: true })}
            disabled={!canContinueToPayment}
          >
            or pay in installments
          </button>

          {bookingError && (
            <p
              className="bp-error"
              style={{ color: "red", textAlign: "center", marginTop: "12px" }}
            >
              {bookingError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
