import { useState } from "react";
import StatusBadge from "./StatusBadge";


const bookings = [
  { id: "NOV - 00132", ticket: "Adult ticket",    date: "May 15,2026", amount: "₦13,500", status: "In Progress" },
  { id: "NOV - 00134", ticket: "Children Ticket", date: "may 20,2026", amount: "₦11,000", status: "Installment" },
  { id: "NOV - 00132", ticket: "Family pack",     date: "May 10,2026", amount: "₦13,500", status: "Successful" },
  { id: "NOV - 00134", ticket: "Adult Ticket",    date: "APR 28,2026", amount: "₦3,000",  status: "Cancelled" },
  { id: "NOV - 00132", ticket: "Adult ticket",    date: "May 04,2026", amount: "₦4,500",  status: "Successful" },
  { id: "NOV - 00134", ticket: "Children Ticket", date: "Mar 28,2026", amount: "₦7,000",  status: "Successful" },
  { id: "NOV - 00132", ticket: "Family Pack",     date: "May 30,2026", amount: "₦13,200", status: "Successful" },
  { id: "NOV - 00134", ticket: "Family Pack",     date: "Apr 28,2026", amount: "₦23,500", status: "Cancelled" }
];

const RecentBookings = () => {
  const [checkedRows, setCheckedRows] = useState({});
  const [allChecked, setAllChecked] = useState(false);

  const toggleRow = (index) => {
    setCheckedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    const all = {};
    bookings.forEach((_, i) => (all[i] = next));
    setCheckedRows(all);
  };

  return (
    <div className="single-booking-container">
      <div className="booking-top-header">
        <h3>Recent Booking</h3>
        <button className="view-all-link">View all</button>
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
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td className="checkbox-col">
                  <input
                    type="checkbox"
                    className="orange-checkbox"
                    checked={!!checkedRows[index]}
                    onChange={() => toggleRow(index)}
                  />
                </td>
                <td className="ticket-id">{booking.id}</td>
                <td>{booking.ticket}</td>
                <td>{booking.date}</td>
                <td>{booking.amount}</td>
                <td>
                  <StatusBadge status={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;