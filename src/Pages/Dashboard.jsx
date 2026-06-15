import { useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="sticky-wrapper">
        <TopNavbar onMenuOpen={() => setMobileMenuOpen(true)} />
      </div>

      <WelcomeSection />

      <div className="stats-grid">
        <StatCard title="Total Tickets Today" value="510" percent="1.8%" previous="Yesterday: 180" type="ticket" />
        <StatCard title="Total Revenue" value="N968,900" percent="2.0%" previous="Yesterday: N764,600" type="revenue" />
        <StatCard title="Total Bookings" value="88" percent="0.5%" previous="Yesterday: 58" type="booking" />
        <StatCard title="Average Rating" value="338" percent="1.7%" previous="Yesterday: 123" type="rating" />
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
    </>
  );
};

export default Dashboard;
