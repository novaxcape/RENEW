import StatusBadge from "./StatusBadge";
// import "./css/Booking.css";
const bookings = [
  {
  id: "NOV-00132",
  ticket: "Adult Ticket",
  date: "May 15, 2026",
  amount: "₦13,500",
  status: "In Progress"
},
  {
    id: "NOV-00133",
    ticket: "Family Pack",
    amount: "₦20,000",
    status: "Installment",
  },
  {
    id: "NOV-00134",
    ticket: "Children Ticket",
    amount: "₦8,000",
    status: "Successful",
  },
  {
    id: "NOV-00135",
    ticket: "VIP Ticket",
    amount: "₦30,000",
    status: "Cancelled",
  },
];

const RecentBookings = () => {
  return (
    <div className="bookings-card">

      <div className="booking-header">
        <h3>Recent Bookings</h3>
        <button>View All</button>
      </div>

      <table>

        <thead>
          <tr>
            <th>Date</th>
            <th>Ticket ID</th>
            <th>Ticket Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
                <td>{booking.date}</td>
              <td>{booking.ticket}</td>
              <td>{booking.amount}</td>

              <td>
                <StatusBadge
                  status={booking.status}
                />
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default RecentBookings;