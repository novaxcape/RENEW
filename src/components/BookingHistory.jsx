import React, { useState } from "react";
import "./css/BookingHistory.css";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const rows = [
  { id: "row-0", ticketId: "NOV - 00132", type: "Adult ticket",     date: "May 15, 2026", amount: "₦13,500", status: "progress",     label: "In Progress" },
  { id: "row-1", ticketId: "NOV - 00134", type: "Children Ticket",  date: "May 20, 2026", amount: "₦11,000", status: "installment", label: "Installment" },
  { id: "row-2", ticketId: "NOV - 00132", type: "Family Pack",      date: "May 10, 2026", amount: "₦13,500", status: "successful",  label: "Successful" },
  { id: "row-3", ticketId: "NOV - 00134", type: "Adult Ticket",     date: "APR 28, 2026", amount: "₦3,000",  status: "cancelled",   label: "Cancelled" },
  { id: "row-4", ticketId: "NOV - 00132", type: "Adult ticket",     date: "May 04, 2026", amount: "₦4,500",  status: "successful",  label: "Successful" },
  { id: "row-5", ticketId: "NOV - 00134", type: "Children Ticket",  date: "Mar 28, 2026", amount: "₦7,000",  status: "successful",  label: "Successful" },
  { id: "row-6", ticketId: "NOV - 00132", type: "Family Pack",      date: "May 30, 2026", amount: "₦13,200", status: "successful",  label: "Successful" },
  { id: "row-7", ticketId: "NOV - 00134", type: "Family Pack",      date: "Apr 28, 2026", amount: "₦23,500", status: "cancelled",   label: "Cancelled" },
];

const BookingHistory = () => {
  const [checkedRows, setCheckedRows] = useState({});

  const allChecked = rows.every((r) => checkedRows[r.id]);

  const toggleRow = (id) =>
    setCheckedRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleAll = () => {
    if (allChecked) {
      setCheckedRows({});
    } else {
      const all = {};
      rows.forEach((r) => (all[r.id] = true));
      setCheckedRows(all);
    }
  };

  return (
    <div className="history-page-wrapper">
      <div className="history-header-row">
        <div className="header-text-block">
          <h1 className="history-main-title">Booking History</h1>
          <p className="history-sub-caption">Review your past Bookings.</p>
        </div>
        <button className="back-home-redirect-btn">Back</button>
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
          />
        </div>

        <button className="filter-dropdown-trigger-btn">
          <img
            src="/novaxcape/filter.png"
            alt="Filter"
            className="toolbar-filter-img"
          />
          Filter By
        </button>
      </div>

      <div className="table-overflow-container">
        <table className="history-data-table">
          <thead>
            <tr>
              <th className="th-checkbox-cell">
                <div
                  className={`custom-table-checkbox ${allChecked ? "checkbox-checked" : ""}`}
                  onClick={toggleAll}
                />
              </th>
              <th>Ticket ID</th>
              <th>Ticket Type</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="table-data-row" key={row.id}>
                <td className="td-checkbox-cell">
                  <div
                    className={`custom-table-checkbox ${checkedRows[row.id] ? "checkbox-checked" : ""}`}
                    onClick={() => toggleRow(row.id)}
                  />
                </td>
                <td className="ticket-id-txt">{row.ticketId}</td>
                <td className="ticket-type-txt">{row.type}</td>
                <td className="date-txt">{row.date}</td>
                <td className="amount-txt">{row.amount}</td>
                <td>
                  <span className={`status-badge badge-${row.status}`}>
                    {row.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="history-table-footer-row">
        <span className="pagination-count-summary-txt">
          Showing Total Pages of 5
        </span>

        <div className="pagination-controls-wrapper">
          <button className="pag-nav-btn disabled-nav">
            <FiChevronLeft className="pag-arrow-icon" />
            Back
          </button>

          <button className="pag-num-btn active-num">1</button>
          <button className="pag-num-btn">2</button>
          <button className="pag-num-btn">3</button>
          <span className="pag-ellipsis-dots">...</span>
          <button className="pag-num-btn">10</button>

          <button className="pag-nav-btn">
            Next
            <FiChevronRight className="pag-arrow-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;