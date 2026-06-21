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

// Normalizes various backend status spellings/values to the four display statuses
const normalizeStatus = (booking) => {
  const status = (booking.status || "").toLowerCase();

  if (status === "cancelled" || status === "camcelled") return "Cancelled";
  if (status === "confirmed" || status === "completed") return "Successful";
  if (booking.isInstallment) return "Installment";
  if (status === "pending" || status === "in_progress") return "In Progress";

  return "In Progress";
};

export default function BookingManagement() {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("All Booking");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    vendorBookings,
    vendorCentres,
    vendorBookingPagination,
    bookingLoading,
  } = useSelector((state) => state.api);
  const { vendorDetails } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch vendor's centres on load
  useEffect(() => {
    console.log("🔍 [BookingManagement] vendorDetails:", vendorDetails);
    if (vendorDetails?.id) {
      console.log(
        "🔍 [BookingManagement] dispatching getVendorTouristCenters for vendorId:",
        vendorDetails.id,
      );
      dispatch(getVendorTouristCenters(vendorDetails.id));
    } else {
      console.warn(
        "⚠️ [BookingManagement] No vendorDetails.id found — getVendorTouristCenters NOT dispatched. Check state.auth.vendorDetails shape (maybe it's _id instead of id?).",
      );
    }
  }, [dispatch, vendorDetails]);

  // When centres are loaded, fetch bookings for the first centre
  // GET /api/v1/booking/get-all/{touristId}
  useEffect(() => {
    console.log("🔍 [BookingManagement] vendorCentres:", vendorCentres);
    if (vendorCentres && vendorCentres.length > 0) {
      const firstCentre = vendorCentres[0];
      console.log(
        "🔍 [BookingManagement] dispatching getVendorBookings for touristId:",
        firstCentre.id,
      );
      dispatch(
        getVendorBookings({
          touristId: firstCentre.id,
          pageNumber: currentPage,
          pageSize,
        }),
      );
    } else {
      console.warn(
        "⚠️ [BookingManagement] vendorCentres is empty — getVendorBookings NOT dispatched.",
      );
    }
  }, [dispatch, vendorCentres, currentPage]);

  // Map real API booking objects to the table row shape
  const mapRealBookings = () => {
    if (!vendorBookings || vendorBookings.length === 0) {
      return [];
    }

    return vendorBookings.map((booking, index) => ({
      id:
        booking.bookingNumber ||
        booking.id ||
        `NOV-${String(index + 1).padStart(5, "0")}`,
      type: booking.package?.packageName || booking.packageName || "Ticket",
      centreName: booking.tourist?.centreName || "",
      date: booking.visitDate
        ? new Date(booking.visitDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Date TBD",
      amount: `₦${Number(
        booking.package?.amount || booking.amount || 0,
      ).toLocaleString()}`,
      status: normalizeStatus(booking),
      passcode: booking.passcode || "",
    }));
  };

  // Update tab counts based on real data
  const getTabCounts = () => {
    const realBookings = vendorBookings || [];
    if (realBookings.length === 0) {
      return {
        "All Booking": 0,
        "New Booking": 0,
        Canceled: 0,
        "In progress": 0,
        Instalment: 0,
        Delivered: 0,
      };
    }

    const normalized = realBookings.map(normalizeStatus);

    return {
      "All Booking": realBookings.length,
      "New Booking": normalized.filter((s) => s === "In Progress").length,
      Canceled: normalized.filter((s) => s === "Cancelled").length,
      "In progress": normalized.filter((s) => s === "In Progress").length,
      Instalment: normalized.filter((s) => s === "Installment").length,
      Delivered: normalized.filter((s) => s === "Successful").length,
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

  // Pull pagination directly from the API response shape:
  // { pageNumber, pageSize, totalDocument, totalDocuments, totalPages, hasNextPage, hasPreviousPage }
  const totalBookings =
    vendorBookingPagination?.totalDocuments ??
    vendorBookingPagination?.totalDocument ??
    vendorBookings?.length ??
    0;

  const totalPages =
    vendorBookingPagination?.totalPages ??
    Math.max(1, Math.ceil(totalBookings / pageSize));

  const hasNextPage =
    vendorBookingPagination?.hasNextPage ?? currentPage < totalPages;
  const hasPreviousPage =
    vendorBookingPagination?.hasPreviousPage ?? currentPage > 1;

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
            <img src="/novaxcape/filter.png" alt="" className="filter-icon" />
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
            {isMobile
              ? `Page ${currentPage} of ${totalPages}`
              : `Total of ${totalBookings} Bookings`}
          </span>
          <div className="pagination-controls">
            <button
              className="page-arrow page-arrow-text"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={!hasPreviousPage}
            >
              {isMobile && <span className="page-arrow-label">Back</span>}
              <ChevronLeft size={16} />
            </button>
            <button className="page-btn page-btn-active">{currentPage}</button>
            <button
              className="page-arrow page-arrow-text"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={!hasNextPage}
            >
              <ChevronRight size={16} />
              {isMobile && <span className="page-arrow-label">Next</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}