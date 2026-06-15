import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./css/BookingHistory.css";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getAllClientBookings, clearApiError } from "../redox/apiSlice";

const BookingHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 5;

  const { clientBookings, bookingLoading, bookingError } = useSelector(
    (state) => state.api
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllClientBookings());
    }
    return () => {
      dispatch(clearApiError());
    };
  }, [dispatch, isAuthenticated]);

  // Filter and search bookings
  const filteredBookings = (clientBookings || []).filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.centreName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || booking.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: "badge-progress", text: "In Progress" },
      confirmed: { class: "badge-successful", text: "Successful" },
      completed: { class: "badge-successful", text: "Successful" },
      cancelled: { class: "badge-cancelled", text: "Cancelled" },
      installment: { class: "badge-installment", text: "Installment" },
      in_progress: { class: "badge-progress", text: "In Progress" },
      successful: { class: "badge-successful", text: "Successful" },
    };
    const defaultStatus = { class: "badge-progress", text: status || "Pending" };
    return statusMap[status?.toLowerCase()] || defaultStatus;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (!amount) return "₦0";
    return `₦${amount.toLocaleString()}`;
  };

  const handleViewDetails = (booking) => {
    navigate(`/booking/${booking.id}`, {
      state: { booking },
    });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusFilterOptions = () => {
    const statuses = [
      { value: "all", label: "All" },
      { value: "pending", label: "In Progress" },
      { value: "confirmed", label: "Successful" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
      { value: "installment", label: "Installment" },
    ];
    return statuses;
  };

  if (bookingLoading) {
    return (
      <div className="history-page-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (bookingError) {
    return (
      <div className="history-page-wrapper">
        <div className="error-container">
          <p className="error-text">{bookingError}</p>
          <button
            className="retry-btn"
            onClick={() => dispatch(getAllClientBookings())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page-wrapper">
      <div className="history-header-row">
        <div className="header-text-block">
          <h1 className="history-main-title">Booking History</h1>
          <p className="history-sub-caption">Review your past Bookings.</p>
        </div>
        <button className="back-home-redirect-btn" onClick={handleBackToHome}>
          Back To Home
        </button>
      </div>

      <div className="history-toolbar-card">
        <div className="search-input-wrapper">
          <div className="search-icon-square">
            <FiSearch className="toolbar-search-icon" />
          </div>
          <input
            type="text"
            placeholder="Search by Ticket ID, Centre, or Package"
            className="toolbar-text-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          className="filter-dropdown-trigger-btn"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          {getStatusFilterOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-bookings-container">
          <img src="/novaxcape/no-bookings.png" alt="No bookings" />
          <h3>No Bookings Found</h3>
          <p>
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria"
              : "You haven't made any bookings yet"}
          </p>
          {!searchTerm && filterStatus === "all" && (
            <button onClick={() => navigate("/discover")} className="explore-btn">
              Explore Centres
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="table-overflow-container">
            <table className="history-data-table">
              <thead>
                <tr>
                  <th className="th-checkbox-cell">
                    <div className="custom-table-checkbox"></div>
                  </th>
                  <th>Ticket ID</th>
                  <th>Package</th>
                  <th>Centre</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((booking, index) => {
                  const statusBadge = getStatusBadge(booking.status);
                  return (
                    <tr className="table-data-row" key={booking.id || index}>
                      <td className="td-checkbox-cell">
                        <div className="custom-table-checkbox"></div>
                      </td>
                      <td className="ticket-id-txt">
                        {booking.ticketId || booking.bookingReference || `NOV-${booking.id?.slice(-5)}`}
                      </td>
                      <td className="ticket-type-txt">
                        {booking.packageName || booking.package?.packageName || "Package"}
                      </td>
                      <td className="centre-name-txt">
                        {booking.centreName || booking.touristCentre?.centreName || "Centre"}
                      </td>
                      <td className="date-txt">{formatDate(booking.date || booking.createdAt)}</td>
                      <td className="amount-txt">{formatAmount(booking.amount || booking.totalAmount)}</td>
                      <td>
                        <span className={`status-badge ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td>
                        <button
                          className="view-details-btn"
                          onClick={() => handleViewDetails(booking)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="history-table-footer-row">
            <span className="pagination-count-summary-txt">
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
            </span>

            <div className="pagination-controls-wrapper">
              <button
                className={`pag-nav-btn ${currentPage === 1 ? "disabled-nav" : ""}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FiChevronLeft className="pag-arrow-icon" />
                Back
              </button>

              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                if (pageNum >= 1 && pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      className={`pag-num-btn ${currentPage === pageNum ? "active-num" : ""}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="pag-ellipsis-dots">...</span>
              )}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  className="pag-num-btn"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              )}

              <button
                className={`pag-nav-btn ${currentPage === totalPages ? "disabled-nav" : ""}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <FiChevronRight className="pag-arrow-icon" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingHistory;