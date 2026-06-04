import React from 'react';
import './css/BookingHistory.css';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const BookingHistory = () => {
  return (
    <div className="history-page-wrapper">
      
      <div className="history-header-row">
        <div className="header-text-block">
          <h1 className="history-main-title">Booking History</h1>
          <p className="history-sub-caption">Review your past Bookings.</p>
        </div>
        <button className="back-home-redirect-btn">Back To Home</button>
      </div>

      <div className="history-toolbar-card">
        <div className="search-input-wrapper">
          <div className="search-icon-square">
            <FiSearch className="toolbar-search-icon" />
          </div>
          <input type="text" placeholder="Type here" className="toolbar-text-input" />
        </div>
        
        <button className="filter-dropdown-trigger-btn">
          <img 
            src="/src/assets/filter.png" 
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
            
            <tr className="table-data-row">
              <td className="td-checkbox-cell">
                <div className="custom-table-checkbox"></div>
              </td>
              <td className="ticket-id-txt">NOV - 00132</td>
              <td className="ticket-type-txt">Adult ticket</td>
              <td className="date-txt">May 15,2026</td>
              <td className="amount-txt">₦13,500</td>
              <td>
                <span className="status-badge badge-progress">In Progress</span>
              </td>
            </tr>

            <tr className="table-data-row">
              <td className="td-checkbox-cell">
                <div className="custom-table-checkbox"></div>
              </td>
              <td className="ticket-id-txt">NOV - 00134</td>
              <td className="ticket-type-txt">Children Ticket</td>
              <td className="date-txt">may 20,2026</td>
              <td className="amount-txt">₦11,000</td>
              <td>
                <span className="status-badge badge-installment">Installment</span>
              </td>
            </tr>

            <tr className="table-data-row">
              <td className="td-checkbox-cell">
                <div className="custom-table-checkbox"></div>
              </td>
              <td className="ticket-id-txt">NOV - 00132</td>
              <td className="ticket-type-txt">Family pack</td>
              <td className="date-txt">May 10,2026</td>
              <td className="amount-txt">₦13,500</td>
              <td>
                <span className="status-badge badge-successful">Successful</span>
              </td>
            </tr>

            <tr className="table-data-row">
              <td className="td-checkbox-cell">
                <div className="custom-table-checkbox"></div>
              </td>
              <td className="ticket-id-txt">NOV - 00134</td>
              <td className="ticket-type-txt">Adult Ticket</td>
              <td className="date-txt">APR 28,2026</td>
              <td className="amount-txt">₦3,000</td>
              <td>
                <span className="status-badge badge-cancelled">Cancelled</span>
              </td>
            </tr>

            <tr className="table-data-row">
              <td className="td-checkbox-cell">
                <div className="custom-table-checkbox"></div>
              </td>
              <td className="ticket-id-txt">NOV - 00132</td>
              <td className="ticket-type-txt">Adult ticket</td>
              <td className="date-txt">May 04,2026</td>
              <td className="amount-txt">₦4,500</td>
              <td>
                <span className="status-badge badge-successful">Successful</span>
              </td>
            </tr>

            <tr className="table-data-row">
              <td className="td-checkbox-cell">
                <div className="custom-table-checkbox"></div>
              </td>
              <td className="ticket-id-txt">NOV - 00134</td>
              <td className="ticket-type-txt">Children Ticket</td>
              <td className="date-txt">Mar 28,2026</td>
              <td className="amount-txt">₦7,000</td>
              <td>
                <span className="status-badge badge-successful">Successful</span>
              </td>
            </tr>

            <tr className="table-data-row">
              <td className="td-checkbox-cell">
                <div className="custom-table-checkbox"></div>
              </td>
              <td className="ticket-id-txt">NOV - 00132</td>
              <td className="ticket-type-txt">Family Pack</td>
              <td className="date-txt">May 30,2026</td>
              <td className="amount-txt">₦13,200</td>
              <td>
                <span className="status-badge badge-successful">Successful</span>
              </td>
            </tr>

            <tr className="table-data-row">
              <td className="td-checkbox-cell">
                <div className="custom-table-checkbox"></div>
              </td>
              <td className="ticket-id-txt">NOV - 00134</td>
              <td className="ticket-type-txt">Family Pack</td>
              <td className="date-txt">Apr 28,2026</td>
              <td className="amount-txt">₦23,500</td>
              <td>
                <span className="status-badge badge-cancelled">Cancelled</span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <div className="history-table-footer-row">
        <span className="pagination-count-summary-txt">Showing Total Pages of 5</span>
        
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
