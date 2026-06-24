import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllClientBookings } from "../redox/apiSlice";import StatusBadge from "./StatusBadge";

const RecentBookings = ({ 
  title = "Recent Booking",
  viewAllText = "View all",
  onViewAll = () => {}
}) => {
  const dispatch = useDispatch();
  
  // Extract booking data and loading state from the api slice
  const { clientBookings, bookingLoading, bookingError } = useSelector((state) => state.api);

  const [checkedRows, setCheckedRows] = useState({});
  const [allChecked, setAllChecked] = useState(false);

  // Fetch bookings on component mount
  useEffect(() => {
    dispatch(getAllClientBookings());
  }, [dispatch]);

  const toggleRow = (index) => {
    setCheckedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    const all = {};
    clientBookings.forEach((_, i) => (all[i] = next));
    setCheckedRows(all);
  };

  return (
    <div className="single-booking-container">
      <div className="booking-top-header">
        <h3>{title}</h3>
        <button className="view-all-link" onClick={onViewAll}>
          {viewAllText}
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  className="orange-checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  disabled={clientBookings.length === 0}
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
            {bookingLoading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                  Loading bookings...
                </td>
              </tr>
            ) : bookingError ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#ef4444" }}>
                  Error loading data: {bookingError}
                </td>
              </tr>
            ) : clientBookings.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                  No bookings available
                </td>
              </tr>
            ) : (
              clientBookings.map((booking, index) => {
                // Formatting Date cleanly if it comes as an ISO string
                const bookingDate = booking.visitDate || booking.date || booking.createdAt || "N/A";
                const formattedDate = typeof bookingDate === "string" && bookingDate.includes("T") 
                  ? new Date(bookingDate).toLocaleDateString() 
                  : bookingDate;

                return (
                  <tr key={booking.id || booking._id || index}>
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        className="orange-checkbox"
                        checked={!!checkedRows[index]}
                        onChange={() => toggleRow(index)}
                      />
                    </td>
                    <td className="ticket-id">{booking.id || booking._id || booking.ticketId || "N/A"}</td>
                    {/* Maps back safely to backend key structures if nested */}
                    <td>{booking.ticketType || booking.package?.name || booking.ticket || "N/A"}</td>
                    <td>{formattedDate}</td>
                    <td>
                      {booking.totalAmount || booking.amount || booking.price 
                        ? `₦${Number(booking.totalAmount || booking.amount || booking.price).toLocaleString()}` 
                        : "N/A"}
                    </td>
                    <td>
                      <StatusBadge status={booking.status || "Pending"} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;