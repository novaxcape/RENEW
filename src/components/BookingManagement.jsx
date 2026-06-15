import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./css/BookingManagement.css";
import { useDispatch, useSelector } from "react-redux";
import { getVendorBookings, getVendorTouristCenters } from "../redox/apiSlice";

const tabs = [
  { label: "All Booking", count: 0, active: true },
  { label: "New Booking", count: 0, active: false },
  { label: "Canceled", count: 0, active: false },
  { label: "In progress", count: 0, active: false },
  { label: "Instalment", count: 0, active: false },
  { label: "Delivered", count: 0, active: false },
];

// Static fallback data (for when no API data)
const staticBookings = [
  {
    id: "NOV - 00132",
    type: "Adult ticket",
    date: "May 15,2026",
    amount: "₦13,500",
    status: "In Progress",
  },
  {
    id: "NOV - 00134",
    type: "Total package",
    date: "may 20,2026",
    amount: "₦11,000",
    status: "Installment",
  },
  {
    id: "NOV - 00132",
    type: "Family pack",
    date: "May 10,2026",
    amount: "₦13,500",
    status: "Successful",
  },
  {
    id: "NOV - 00134",
    type: "Adult Ticket",
    date: "APR 28,2026",
    amount: "₦3,000",
    status: "Cancelled",
  },
  {
    id: "NOV - 00132",
    type: "Adult ticket",
    date: "May 04.2026",
    amount: "₦4,500",
    status: "Successful",
  },
  {
    id: "NOV - 00134",
    type: "Children Ticket",
    date: "Mar 28,2026",
    amount: "₦7,000",
    status: "Successful",
  },
  {
    id: "NOV - 00132",
    type: "Family Pack",
    date: "May 30,2026",
    amount: "₦13,200",
    status: "Successful",
  },
  {
    id: "NOV - 00134",
    type: "Family Pack",
    date: "Apr 28,2026",
    amount: "₦23,500",
    status: "Cancelled",
  },
];

export default function BookingManagement() {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("All Booking");
  
  const { vendorBookings, vendorCentres, bookingLoading } = useSelector((state) => state.api);
  const { vendorDetails } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch vendor's centres on load
  useEffect(() => {
    if (vendorDetails?.id) {
      dispatch(getVendorTouristCenters(vendorDetails.id));
    }
  }, [dispatch, vendorDetails]);

  // When centres are loaded, fetch bookings for the first centre and its first package
  useEffect(() => {
    if (vendorCentres && vendorCentres.length > 0) {
      const firstCentre = vendorCentres[0];
      if (firstCentre.packages && firstCentre.packages.length > 0) {
        const firstPackage = firstCentre.packages[0];
        dispatch(getVendorBookings({
          touristId: firstCentre.id,
          packageId: firstPackage.id
        }));
      }
    }
  }, [dispatch, vendorCentres]);

  // Map real data to match the expected format
  const mapRealBookings = () => {
    // If no API data, use static fallback
    if (!vendorBookings || vendorBookings.length === 0) {
      return staticBookings;
    }
    
    return vendorBookings.map((booking, index) => ({
      id: booking.bookingNumber || booking.ticketId || `NOV-${String(index + 1).padStart(5, '0')}`,
      type: booking.package?.packageName || booking.packageName || "Ticket",
      date: booking.visitDate ? new Date(booking.visitDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) : "Date TBD",
      amount: `₦${(booking.package?.amount || booking.amount || 0).toLocaleString()}`,
      status: booking.status === "cancelled" || booking.status === "camcelled" ? "Cancelled" : 
              booking.status === "pending" ? "In Progress" :
              booking.status === "confirmed" || booking.status === "completed" ? "Successful" : 
              booking.isInstallment ? "Installment" : "In Progress",
    }));
  };

  // Update tab counts based on real data
  const getTabCounts = () => {
    const realBookings = vendorBookings || [];
    if (realBookings.length === 0) {
      // Return default counts if no API data
      return {
        "All Booking": 124,
        "New Booking": 12,
        "Canceled": 8,
        "In progress": 24,
        "Instalment": 18,
        "Delivered": 62,
      };
    }
    
    return {
      "All Booking": realBookings.length,
      "New Booking": realBookings.filter(b => b.status === "pending").length,
      "Canceled": realBookings.filter(b => b.status === "cancelled" || b.status === "camcelled").length,
      "In progress": realBookings.filter(b => b.status === "in_progress" || b.status === "pending").length,
      "Instalment": realBookings.filter(b => b.isInstallment).length,
      "Delivered": realBookings.filter(b => b.status === "completed" || b.status === "confirmed").length,
    };
  };

  const tabCounts = getTabCounts();
  const displayBookings = mapRealBookings();

  // Filter bookings based on active tab
  const filteredBookings = displayBookings.filter((booking) => {
    if (activeTab === "All Booking") return true;
    if (activeTab === "New Booking") return booking.status === "In Progress";
    if (activeTab === "Canceled") return booking.status === "Cancelled";
    if (activeTab === "In progress") return booking.status === "In Progress";
    if (activeTab === "Instalment") return booking.status === "Installment";
    if (activeTab === "Delivered") return booking.status === "Successful";
    return true;
  });

  const statusClassMap = {
    "In Progress": "status-in-progress",
    Installment: "status-installment",
    Successful: "status-successful",
    Cancelled: "status-cancelled",
  };

  if (bookingLoading && vendorBookings?.length === 0) {
    return (
      <div className="booking-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Header */}
      <div className="booking-header">
        <div>
          <h1 className="booking-title">Booking Management</h1>
          <p className="booking-subtitle">
            Monitor and track customer most booked ticket in real time
          </p>
        </div>
        <button className="export-btn">Export Report</button>
      </div>

      {/* Tabs */}
      <div className="tabs-row">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className={`tab ${activeTab === tab.label ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab.label)}
          >
            <span className="tab-label">{tab.label}</span>
            <span
              className={`tab-count ${
                activeTab === tab.label ? "tab-count-active" : ""
              }`}
            >
              {tabCounts[tab.label] || 0}
            </span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="table-card">
        <div className="table-card-header">
          <h2 className="recent-activity-title">
            {isMobile ? "Recent Bookings" : "Recent Activity"}
          </h2>
          <button className="filter-btn">
            <img
              src="/novaxcape/filter.png"
              alt=""
              className="filter-icon"
            />
            Filter By
          </button>
        </div>

        {filteredBookings.length === 0 && !bookingLoading && (
          <div className="no-bookings-message">
            <p>No bookings found</p>
          </div>
        )}

        {filteredBookings.length > 0 && (
          <table className="booking-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input type="checkbox" className="row-checkbox" />
                </th>
                <th>{isMobile ? "Order ID" : "Ticket ID"}</th>
                <th>{isMobile ? "Order Type" : "Ticket Type"}</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b, i) => (
                <tr key={i}>
                  <td className="checkbox-col">
                    <input type="checkbox" className="row-checkbox" />
                  </td>
                  <td className="ticket-id">{b.id}</td>
                  <td className="ticket-type">{b.type}</td>
                  <td className="ticket-date">{b.date}</td>
                  <td className="ticket-amount">{b.amount}</td>
                  <td>
                    <span
                      className={`status-badge ${statusClassMap[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredBookings.length > 0 && (
        <div className="pagination-row">
          <span className="pagination-info">
            {isMobile ? "Showing Total Pages of 18" : `Total of ${filteredBookings.length} Bookings`}
          </span>
          <div className="pagination-controls">
            <button className="page-arrow page-arrow-text">
              {isMobile && <span className="page-arrow-label">Back</span>}
              <ChevronLeft size={16} />
            </button>
            <button className="page-btn page-btn-active">1</button>
            <button className="page-arrow page-arrow-text">
              <ChevronRight size={16} />
              {isMobile && <span className="page-arrow-label">Next</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}