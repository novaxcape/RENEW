import TopNavbar from "../components/TopNavbar";
import WelcomeSection from "../components/WelcomeSection";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import TicketDonutChart from "../components/TicketDonutChart";
import RecentBookings from "../components/RecentBookings";
import PerformanceInsight from "../components/PerformanceInsight";
import CapacityGoals from "../components/CapacityGoals";

import "../Styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-content">
      <div className="sticky-wrapper">
        <TopNavbar />
      </div>

      <WelcomeSection />

      <div className="stats-grid">
        <StatCard
          title="Total Tickets Today"
          value="510"
          percent="+183%"
          previous="Yesterday: 180"
          type="ticket"
        />
        <StatCard
          title="Total Revenue"
          value="₱968,900"
          percent="+26.7%"
          previous="Yesterday: ₱764,600"
          type="revenue"
        />
        <StatCard
          title="Total Bookings"
          value="88"
          percent="+51.7%"
          previous="Yesterday: 58"
          type="booking"
        />
        <StatCard
          title="Average Rating"
          value="4.8"
          percent="+11.6%"
          previous="Yesterday: 4.3"
          type="rating"
        />
      </div>

      <div className="chart-section">
        <RevenueChart />
        <TicketDonutChart />
      </div>

      <RecentBookings />

      <div className="bottom-section">
        <PerformanceInsight />
        <CapacityGoals />
      </div>
    </div>
  );
};

export default Dashboard;
