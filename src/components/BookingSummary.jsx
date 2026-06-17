import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import "./css/BookingSummary.css";
import { createBooking } from "../redox/apiSlice";

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
  
  const { loggedInUser, userToken } = useSelector((state) => state.auth);
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

  console.log("📄 BookingSummaryPage - Mounted");
  console.log("📄 touristId:", touristId);
  console.log("📄 packageId:", packageId);
  console.log("📄 location.state:", location.state);

  useEffect(() => {
    if (!bookingData.packageDetails) {
      const pendingBooking = localStorage.getItem('pendingBooking');
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

  const increment = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));

  const decrement = (id) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] - 1),
    }));

  const subtotal = ticketTypes.reduce(
    (sum, t) => sum + t.price * quantities[t.id],
    0
  );
  const total = subtotal + SERVICE_FEE;

  const formatNaira = (amount) => `₦${amount.toLocaleString("en-NG")}`;

  const summaryItems = ticketTypes.filter((t) => quantities[t.id] > 0);

  // ✅ Helper function to create booking and navigate
  const createBookingAndNavigate = async (isInstallment = false) => {
    // Validate date
    if (!date) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Date',
        text: 'Please select a visit date.',
        confirmButtonColor: '#ff6b35',
      });
      return;
    }

    // Validate tickets
    if (summaryItems.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No Tickets Selected',
        text: 'Please select at least one ticket.',
        confirmButtonColor: '#ff6b35',
      });
      return;
    }

    try {
      // ✅ Send ONLY visitDate - the thunk will handle formatting and clientId
      const bookingDataPayload = {
        visitDate: date, // Will be formatted to MM/DD/YYYY in the thunk
      };

      console.log("📄 Booking Payload:", bookingDataPayload);
      console.log("📄 Tourist ID:", touristId);
      console.log("📄 Package ID:", packageId);

      const result = await dispatch(createBooking({
        touristId: touristId,
        packageId: packageId,
        bookingData: bookingDataPayload,
      })).unwrap();

      console.log("📄 Full API Response:", JSON.stringify(result, null, 2));

      if (!result) {
        throw new Error('No response from server');
      }

      // Extract booking ID from response
      const bookingId = result?.data?.id || 
                        result?.booking?.id || 
                        result?.id ||
                        result?.data?.bookingId ||
                        result?.bookingId;

      console.log("📄 Extracted Booking ID:", bookingId);

      if (!bookingId) {
        console.error("❌ No booking ID found in response:", JSON.stringify(result, null, 2));
        throw new Error('Could not retrieve booking ID from server response');
      }

      localStorage.removeItem('pendingBooking');

      // ✅ Prepare common state data
      const navigateState = {
        bookingId: bookingId,
        amount: total,
        subtotal: subtotal,
        serviceFee: SERVICE_FEE,
        centreDetails: bookingData.centreDetails,
        packageDetails: bookingData.packageDetails,
        ticketDetails: summaryItems.map(t => ({
          ticketType: t.id,
          quantity: quantities[t.id],
          price: t.price,
        })),
        numberOfPeople: summaryItems.reduce((sum, t) => sum + quantities[t.id], 0),
        date: date,
        bookingDetails: result,
      };

      // ✅ Navigate based on installment flag
      if (isInstallment) {
        navigate(`/payment-checkout/${bookingId}`, {
          state: {
            ...navigateState,
            isInstallment: true,
            autoInit: false,
          }
        });
      } else {
        // Show success message for regular payment
        await Swal.fire({
          icon: 'success',
          title: 'Booking Created!',
          text: 'Your booking has been created. Proceed to payment.',
          confirmButtonColor: '#ff6b35',
          confirmButtonText: 'Proceed to Payment'
        });

        navigate(`/payment-checkout/${bookingId}`, {
          state: {
            ...navigateState,
            isInstallment: false,
            autoInit: true,
          }
        });
      }

    } catch (error) {
      console.error("❌ Booking error:", error);
      
      let errorMessage = 'Unable to create booking. Please try again.';
      if (error === 'Client not found' || error?.message === 'Client not found') {
        errorMessage = 'Your account was not found. Please log in again.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: errorMessage,
        confirmButtonColor: '#ff6b35',
      });
    }
  };

  // ✅ Handle regular payment
  const handleContinueToPayment = () => {
    createBookingAndNavigate(false);
  };

  // ✅ Handle installment payment
  const handleInstallmentClick = () => {
    createBookingAndNavigate(true);
  };

  if (!bookingData.packageDetails) {
    return (
      <div className="bp-page">
        <div className="bp-header">
          <h1 className="bp-title">Complete Your Booking</h1>
          <p className="bp-subtitle">Just a few more steps to your booking</p>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>No Booking Data Found</h2>
          <p>Please select a package to book.</p>
          <button 
            onClick={() => navigate('/discover')}
            style={{
              background: '#ff6b35',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '16px'
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
          <div className="bp-booking-info" style={{ 
            background: '#f8f9fa', 
            padding: '16px 24px', 
            borderRadius: '12px',
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}>
            <div>
              <strong>{bookingData.centreDetails.centreName || bookingData.centreDetails.name}</strong>
              <span style={{ marginLeft: '16px', color: '#666' }}>
                {bookingData.centreDetails.city}, {bookingData.centreDetails.state}
              </span>
            </div>
            <div>
              <span style={{ color: '#666' }}>
                Package: {bookingData.packageDetails.packageName}
              </span>
              <span style={{ marginLeft: '16px', fontWeight: 600, color: '#ff6b35' }}>
                ₦{bookingData.packageDetails.amount?.toLocaleString() || bookingData.packageDetails.price?.toLocaleString() || '0'}
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
                min={new Date().toISOString().split('T')[0]}
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
            disabled={bookingLoading}
          >
            {bookingLoading ? 'Creating Booking...' : 'Continue To Payment'}
          </button>

          {bookingError && (
            <p className="bp-error" style={{ color: 'red', textAlign: 'center', marginTop: '12px' }}>
              {bookingError}
            </p>
          )}

          <p className="bp-installment">
            Or{" "}
            <span
              className="bp-installment-link"
              onClick={handleInstallmentClick}
              style={{ cursor: "pointer" }}
            >
              Pay Instalmentally
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}