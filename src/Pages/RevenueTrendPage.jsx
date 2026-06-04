import TopNavbar from "../components/TopNavbar";
import RevenueChart from "../components/RevenueChart";
import TicketDonutChart from "../components/TicketDonutChart";
import "../Styles/Dashboard.css";

const RevenueTrendPage = () => {
  return (
    <div className="dashboard-content">
      <div className="sticky-wrapper">
        <TopNavbar />
      </div>

      <div className="page-heading">
        <h1>Revenue Trend</h1>
        <p>Review your revenue performance and ticket mix.</p>
      </div>

      <div className="chart-section">
        <RevenueChart />
        <TicketDonutChart />
      </div>
    </div>
  );
};

export default RevenueTrendPage;
