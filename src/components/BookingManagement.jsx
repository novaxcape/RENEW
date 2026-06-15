import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./css/BookingManagement.css";

const tabs = [
  { label: "All Booking", count: 124, active: true },
  { label: "New Booking", count: 12, active: false },
  { label: "Canceled", count: 8, active: false },
  { label: "In progress", count: 24, active: false },
  { label: "Instalment", count: 18, active: false },
  { label: "Delivered", count: 62, active: false },
];

const bookings = [
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

const statusClassMap = {
  "In Progress": "status-in-progress",
  Installment: "status-installment",
  Successful: "status-successful",
  Cancelled: "status-cancelled",
};

export default function BookingManagement() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
            className={`tab ${tab.active ? "tab-active" : ""}`}
          >
            <span className="tab-label">{tab.label}</span>
            <span
              className={`tab-count ${
                tab.active ? "tab-count-active" : ""
              }`}
            >
              {tab.count}
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
            {bookings.map((b, i) => (
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