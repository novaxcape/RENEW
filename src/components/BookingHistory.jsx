import React, { useEffect, useState } from "react";
import "./css/BookingHistory.css";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserBookings } from "../redox/apiSlice"; // adjust path if needed

const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case "inprogress": return "badge-progress";
    case "installment": return "badge-installment";
    case "delivered": return "badge-successful";
    case "camcelled":
    case "cancelled": return "badge-cancelled";
    default: return "badge-progress";
  }
};

const getStatusLabel = (status) => {
  switch (status?.toLowerCase()) {
    case "inprogress": return "In Progress";
    case "installment": return "Installment";
    case "delivered": return "Successful";
    case "camcelled":
    case "cancelled": return "Cancelled";
    default: return status;
  }
};

const ITEMS_PER_PAGE = 8;

const BookingHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const userBookings = useSelector((state) => state.api.userBookings);
  const isLoading = useSelector((state) => state.api.bookingLoading);
  const error = useSelector((state) => state.api.bookingError);
  const loggedInUser = useSelector((state) => state.auth.loggedInUser);

  useEffect(() => {
    if (loggedInUser?.id) {
      dispatch(getUserBookings(loggedInUser.id));
    }
  }, [dispatch, loggedInUser]);

  // Filter by search
  const filtered = userBookings.filter((booking) =>
    booking?.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="history-page-wrapper">
      <div className="history-header-row">
        <div className="header-text-block">
          <h1 className="history-main-title">Booking History</h1>
          <p className="history-sub-caption">Review your past Bookings.</p>
        </div>
        <button className="back-home-redirect-btn" onClick={() => navigate("/")}>
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
            placeholder="Type here"
            className="toolbar-text-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <button className="filter-dropdown-trigger-btn">
          <img src="/novaxcape/filter.png" alt="Filter" className="toolbar-filter-img" />
          Filter By
        </button>
      </div>

      <div className="table-overflow-container">
        <table className="history-data-table">
          <thead>
            <tr>
              <th className="th-checkbox-cell">
                <div className="custom-table-checkbox"></div>
              </th>
              <th>Ticket ID</th>
              <th>Ticket Type</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                  Loading bookings...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "red" }}>
                  {error}
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                  No bookings found.
                </td>
              </tr>
            ) : (
              paginated.map((booking) => (
                <tr key={booking.id} className="table-data-row">
                  <td className="td-checkbox-cell">
                    <div className="custom-table-checkbox"></div>
                  </td>
                  <td className="ticket-id-txt">{booking.bookingNumber}</td>
                  <td className="ticket-type-txt">{booking.packageId}</td>
                  <td className="date-txt">
                    {booking.visitDate
                      ? new Date(booking.visitDate).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="amount-txt">-</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="history-table-footer-row">
        <span className="pagination-count-summary-txt">
          Showing Total Pages of {totalPages || 1}
        </span>

        <div className="pagination-controls-wrapper">
          <button
            className={`pag-nav-btn ${currentPage === 1 ? "disabled-nav" : ""}`}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft className="pag-arrow-icon" />
            Back
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pag-num-btn ${currentPage === page ? "active-num" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={`pag-nav-btn ${currentPage === totalPages ? "disabled-nav" : ""}`}
            onClick={() => setCurrentPage((p) => Math.min(p + totalPages, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <FiChevronRight className="pag-arrow-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;