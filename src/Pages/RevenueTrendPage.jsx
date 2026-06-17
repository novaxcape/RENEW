import { useOutletContext } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import RevenueChart from "../components/RevenueChart";
import TicketDonutChart from "../components/TicketDonutChart";
import "../Styles/Dashboard.css";

const RevenueTrendPage = () => {
  const { openMobileMenu = () => {} } = useOutletContext() || {};

  return (
    <>
      <div className="sticky-wrapper">
        <TopNavbar onMenuOpen={openMobileMenu} />
      </div>

      <div className="page-heading">
        <h1>Revenue Trend</h1>
        <p>Review your revenue performance and ticket mix.</p>
      </div>

      <div className="chart-section">
        <RevenueChart />
        <TicketDonutChart />
      </div>
    </>
  );
};

export default RevenueTrendPage;
