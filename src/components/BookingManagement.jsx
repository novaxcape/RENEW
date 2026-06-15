import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./css/BookingManagement.css";
import { useDispatch, useSelector } from "react-redux";
import { getVendorBookings } from "../redox/apiSlice";

const tabs = [
  { label: "All Booking", count: 124, active: true },
  { label: "New Booking", count: 12, active: false },
  { label: "Canceled", count: 8, active: false },
  { label: "In progress", count: 24, active: false },
  { label: "Instalment", count: 18, active: false },
  { label: "Delivered", count: 62, active: false },
];

export default function BookingManagement() {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("All Booking");
  
  const { vendorBookings, vendorCentres, bookingLoading } = useSelector((state) => state.api);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch real bookings
  useEffect(() => {
    if (vendorCentres && vendorCentres.length > 0) {
      vendorCentres.forEach((centre) => {
        if (centre.packages && centre.packages.length > 0) {
          centre.packages.forEach((pkg) => {
            dispatch(getVendorBookings({ 
              touristId: centre.id, 
              packageId: pkg.id 
            }));
          });
        }
      });
    }
  }, [dispatch, vendorCentres]);

  // Map real data to match the expected format
  const mapRealBookings = () => {
    if (!vendorBookings || vendorBookings.length === 0) return bookings; // fallback to static
    
    return vendorBookings.map((booking, index) => ({
      id: booking.ticketId || booking.bookingReference || `NOV - ${String(index + 1).padStart(5, '0')}`,
      type: booking.packageName || booking.package?.packageName || "Adult ticket",
      date: booking.date ? new Date(booking.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).replace(/,/g, ',') : "May 15,2026",
      amount: `₦${(booking.amount || booking.totalAmount || 0).toLocaleString()}`,
      status: booking.isInstallment ? "Installment" : 
              booking.status === "pending" ? "In Progress" :
              booking.status === "completed" ? "Successful" :
              booking.status === "cancelled" ? "Cancelled" : "In Progress",
    }));
  };

  // Update tab counts based on real data
  const getTabCounts = () => {
    const realBookings = vendorBookings || [];
    return {
      "All Booking": realBookings.length,
      "New Booking": realBookings.filter(b => b.status === "pending").length,
      "Canceled": realBookings.filter(b => b.status === "cancelled").length,
      "In progress": realBookings.filter(b => b.status === "in_progress" || b.status === "pending").length,
      "Instalment": realBookings.filter(b => b.isInstallment).length,
      "Delivered": realBookings.filter(b => b.status === "completed").length,
    };
  };

  const tabCounts = getTabCounts();
  const displayBookings = mapRealBookings();

  // Filter bookings based on active tab
  const filteredBookings = displayBookings.filter((booking) => {
    if (activeTab === "All Booking") return true;
    return booking.status === activeTab;
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
              {tabCounts[tab.label] || tab.count}
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
      </div>

      {/* Pagination */}
      <div className="pagination-row">
        <span className="pagination-info">
          {isMobile ? "Showing Total Pages of 18" : "Total of 124 Pages"}
        </span>
        <div className="pagination-controls">
          <button className="page-arrow page-arrow-text">
            {isMobile && <span className="page-arrow-label">Back</span>}
            <ChevronLeft size={16} />
          </button>
          <button className={`page-btn ${isMobile ? "page-btn-active" : ""}`}>
            1
          </button>
          <button className="page-btn">2</button>
          <button
            className={`page-btn ${!isMobile ? "page-btn-active" : ""}`}
          >
            3
          </button>
          {!isMobile && <button className="page-btn">4</button>}
          <span className="page-dots">...</span>
          <button className="page-btn">{isMobile ? "18" : "200"}</button>
          <button className="page-arrow page-arrow-text">
            <ChevronRight size={16} />
            {isMobile && <span className="page-arrow-label">Next</span>}
          </button>
        </div>
      </div>
    </div>
  );
}