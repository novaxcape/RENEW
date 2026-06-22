import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import "./css/BookingSummary.css";
import { createBooking, initializePayment } from "../redox/apiSlice";

const ticketTypes = [
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
];

const SERVICE_FEE = 500;

export default function BookingSummaryPage() {
  const navigate = useNavigate();
  const { touristId, packageId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loggedInUser, userToken, isAuthenticated } = useSelector(
    (state) => state.auth,
  );
  const { bookingLoading, bookingError } = useSelector((state) => state.api);

  const [bookingData, setBookingData] = useState({
    packageDetails: location.state?.packageDetails || null,
    centreDetails: location.state?.centreDetails || null,
  });

  const [date, setDate] = useState("");
  const [quantities, setQuantities] = useState({
    adult: 1,
    child: 1,
    family: 1,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  console.log("📄 BookingSummaryPage - Mounted");
  console.log("📄 touristId:", touristId);
  console.log("📄 packageId:", packageId);
  console.log("📄 isAuthenticated:", isAuthenticated);
  console.log("📄 userToken:", userToken ? "Present" : "Missing");
  console.log("📄 loggedInUser:", loggedInUser);

  // ✅ Check authentication on mount - redirect if not logged in
  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("userToken");
    const isLoggedIn = !!token || isAuthenticated;

    console.log("🔐 Auth check - isLoggedIn:", isLoggedIn);

    if (!isLoggedIn) {
      console.log("🚫 User not authenticated - redirecting to signin");

      const pendingData = {
        touristId: touristId,
        packageId: packageId,
        packageDetails: bookingData.packageDetails,
        centreDetails: bookingData.centreDetails,
        returnUrl: `/booking-summary/${touristId}/${packageId}`,
      };
      localStorage.setItem("pendingBooking", JSON.stringify(pendingData));
      console.log("bookingdetails", pendingData);

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
            bookingData: pendingData,
          },
        });
      });
    }
  }, [isAuthenticated, navigate, touristId, packageId, bookingData]);

  useEffect(() => {
    if (!bookingData.packageDetails) {
      const pendingBooking = localStorage.getItem("pendingBooking");
      console.log("📄 pendingBooking from localStorage:", pendingBooking);
      if (pendingBooking) {
        try {
          const parsed = JSON.parse(pendingBooking);
          setBookingData({
            packageDetails: parsed.packageDetails,
            centreDetails: parsed.centreDetails,
          });
        } catch (e) {
          console.error("Error parsing pending booking:", e);
        }
      }
    }
  }, [bookingData.packageDetails]);

  console.log("booking data found:", bookingData);

  const increment = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));

  const decrement = (id) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] - 1),
    }));

  const subtotal = ticketTypes.reduce(
    (sum, t) => sum + t.price * quantities[t.id],
    0,
  );
  const total = subtotal + SERVICE_FEE;

  const formatNaira = (amount) => `₦${amount.toLocaleString("en-NG")}`;

  const summaryItems = ticketTypes.filter((t) => quantities[t.id] > 0);

  // ✅ Handle payment
  const handleContinueToPayment = async () => {
    console.log("🚀 Starting payment process...");
    
    // ✅ Check authentication
    const token =
      localStorage.getItem("token") || localStorage.getItem("userToken");
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
              touristId: touristId,
              packageId: packageId,
              packageDetails: bookingData.packageDetails,
              centreDetails: bookingData.centreDetails,
            },
          },
        });
      });
      return;
    }

    // Validate date
    if (!date) {
      Swal.fire({
        icon: "error",
        title: "Missing Date",
        text: "Please select a visit date.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    // Validate tickets
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
      // ✅ Format date as MM/DD/YYYY
      let formattedDate = date;
      if (formattedDate && formattedDate.includes("-")) {
        const parts = formattedDate.split("-");
        formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
      }
      console.log("📅 Formatted date:", formattedDate);

      // ✅ Create booking data payload
      const bookingDataPayload = {
        visitDate: formattedDate,
      };

      console.log("📤 bookingDataPayload:", bookingDataPayload);
      console.log("📤 touristId:", touristId);
      console.log("📤 packageId:", packageId);

      // ✅ Ensure all parameters are defined
      if (!touristId || !packageId) {
        throw new Error("Missing touristId or packageId");
      }

      if (!bookingDataPayload.visitDate) {
        throw new Error("Missing visitDate");
      }

      // ✅ Call the thunk with the correct structure
      console.log("📤 Calling createBooking with:", {
        touristId,
        packageId,
        bookingData: bookingDataPayload
      });

      const bookingResult = await dispatch(
        createBooking({
          touristId: touristId,
          packageId: packageId,
          bookingData: bookingDataPayload
        })
      ).unwrap();

      console.log("📄 Booking Result:", bookingResult);

      if (!bookingResult) {
        throw new Error("No response from server");
      }

      const bookingId =
        bookingResult?.data?.id ||
        bookingResult?.booking?.id ||
        bookingResult?.id;

      console.log("📄 Booking ID:", bookingId);

      if (!bookingId) {
        throw new Error("Could not retrieve booking ID");
      }

      // ✅ Show success alert for booking creation
      await Swal.fire({
        icon: "success",
        title: "🎉 Booking Created Successfully!",
        text: "Your booking has been created. Now redirecting to payment...",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      localStorage.removeItem("pendingBooking");

      // ✅ Initialize payment
      const customerEmail =
        loggedInUser?.email ||
        loggedInUser?.Email ||
        localStorage.getItem("email") ||
        localStorage.getItem("Email") ||
        "";

      const customerName =
        loggedInUser?.fullName ||
        loggedInUser?.name ||
        loggedInUser?.firstName ||
        "Customer";

      const paymentData = {
        amount: total,
        customer: {
          email: customerEmail,
          name: customerName,
        },
        subtotal,
        serviceFee: SERVICE_FEE,
        date: formattedDate,
        numberOfPeople: summaryItems.reduce(
          (sum, t) => sum + quantities[t.id],
          0,
        ),
        ticketDetails: summaryItems.map((t) => ({
          ticketType: t.id,
          quantity: quantities[t.id],
          price: t.price,
        })),
      };

      console.log("📄 Payment Data:", paymentData);

      // ✅ Try to initialize payment
      try {
        const paymentResponse = await dispatch(
          initializePayment({
            bookingId: bookingId,
            paymentData: paymentData,
          })
        ).unwrap();

        console.log("📄 FULL Payment Response:", JSON.stringify(paymentResponse, null, 2));
        console.log("📄 Payment Response Type:", typeof paymentResponse);
        console.log("📄 Payment Response Keys:", Object.keys(paymentResponse || {}));

        const bookingState = {
          bookingId: bookingId,
          amount: total,
          subtotal: subtotal,
          serviceFee: SERVICE_FEE,
          centreDetails: bookingData.centreDetails,
          packageDetails: bookingData.packageDetails,
          ticketDetails: summaryItems.map((t) => ({
            ticketType: t.id,
            quantity: quantities[t.id],
            price: t.price,
          })),
          numberOfPeople: summaryItems.reduce(
            (sum, t) => sum + quantities[t.id],
            0,
          ),
          date: formattedDate,
        };

        localStorage.setItem("pendingBookingState", JSON.stringify(bookingState));

        // ✅ Check multiple possible locations for the redirect URL
        const redirectUrl = 
          paymentResponse?.data?.redirect_url ||
          paymentResponse?.data?.url ||
          paymentResponse?.data?.paymentUrl ||
          paymentResponse?.data?.authorization_url ||
          paymentResponse?.data?.link ||
          paymentResponse?.redirect_url ||
          paymentResponse?.url ||
          paymentResponse?.paymentUrl ||
          paymentResponse?.authorization_url ||
          paymentResponse?.link;

        console.log("✅ Found redirect URL:", redirectUrl);

        if (redirectUrl && redirectUrl.startsWith('http')) {
          // ✅ Show payment redirect alert
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
          // ✅ No valid redirect URL found - show booking success with manual payment link
          console.error("❌ No valid redirect URL found in response:", paymentResponse);
          
          await Swal.fire({
            icon: "success",
            title: "Booking Created Successfully!",
            html: `
              <p>Your booking has been created with ID: <strong>${bookingId}</strong></p>
              <p>Total Amount: <strong>${formatNaira(total)}</strong></p>
              <p style="margin-top: 10px; color: #666; font-size: 14px;">
                Booking Reference: ${bookingResult?.booking?.bookingNumber || bookingResult?.data?.bookingNumber || 'N/A'}
              </p>
              <p style="margin-top: 15px;">
                <button onclick="window.location.href='/payment-checkout/${bookingId}'" 
                        style="background: #ff6b35; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px;">
                  Complete Payment
                </button>
              </p>
            `,
            confirmButtonColor: "#ff6b35",
            confirmButtonText: "View My Bookings",
          }).then(() => {
            navigate("/my-bookings");
          });
        }
      } catch (paymentError) {
        // ✅ Payment initialization failed but booking was created
        console.error("❌ Payment initialization failed:", paymentError);
        console.error("❌ Payment error details:", {
          message: paymentError.message,
          response: paymentError.response?.data,
          status: paymentError.response?.status
        });
        
        await Swal.fire({
          icon: "warning",
          title: "Booking Created but Payment Failed",
          html: `
            <p>Your booking was created successfully with ID: <strong>${bookingId}</strong></p>
            <p>Total Amount: <strong>${formatNaira(total)}</strong></p>
            <p style="color: #666; font-size: 14px;">Error: ${paymentError.message || 'Payment initialization failed'}</p>
            <p style="margin-top: 15px;">Please try to complete your payment later or contact support.</p>
          `,
          confirmButtonColor: "#ff6b35",
          confirmButtonText: "Go to My Bookings",
        }).then(() => {
          navigate("/my-bookings");
        });
      }
    } catch (error) {
      console.error("❌ Error:", error);
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });

      let errorMessage = "Unable to process your booking. Please try again.";

      if (error?.message === "Client not found") {
        errorMessage = "Your account was not found. Please log in again.";
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
                touristId: touristId,
                packageId: packageId,
                packageDetails: bookingData.packageDetails,
                centreDetails: bookingData.centreDetails,
              },
            },
          });
        });
        return;
      } else if (error?.message) {
        errorMessage = error.message;
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

  if (!bookingData.packageDetails) {
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

  return (
    <div className="bp-page">
      <div className="bp-header">
        <h1 className="bp-title">Complete Your Booking</h1>
        <p className="bp-subtitle">Just a few more steps to your booking</p>

        {bookingData.centreDetails && (
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
                {bookingData.centreDetails.centreName ||
                  bookingData.centreDetails.name}
              </strong>
              <span style={{ marginLeft: "16px", color: "#666" }}>
                {bookingData.centreDetails.city},{" "}
                {bookingData.centreDetails.state}
              </span>
            </div>
            <div>
              <span style={{ color: "#666" }}>
                Package: {bookingData.packageDetails.packageName}
              </span>
              <span
                style={{
                  marginLeft: "16px",
                  fontWeight: 600,
                  color: "#ff6b35",
                }}
              >
                ₦
                {bookingData.packageDetails.amount?.toLocaleString() ||
                  bookingData.packageDetails.price?.toLocaleString() ||
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
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </section>

          <section className="bp-section">
            <h2 className="bp-section-title">Select Ticket</h2>
            <div className="bp-tickets">
              {ticketTypes.map((ticket) => (
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
                      {quantities[ticket.id]}
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

          <div className="bp-summary-items">
            {summaryItems.map((t) => (
              <div key={t.id} className="bp-summary-row">
                <div className="bp-summary-item-info">
                  <span className="bp-summary-item-name">
                    {t.id === "family" ? "Family Pack" : t.label} x
                    {quantities[t.id]}
                  </span>
                  <span className="bp-summary-item-price-desc">
                    ₦{t.price.toLocaleString("en-NG")} each
                  </span>
                </div>
                <span className="bp-summary-item-total">
                  {formatNaira(t.price * quantities[t.id])}
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
            onClick={handleContinueToPayment}
            disabled={bookingLoading || isProcessing}
          >
            {bookingLoading || isProcessing
              ? "Processing..."
              : "Continue To Payment"}
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