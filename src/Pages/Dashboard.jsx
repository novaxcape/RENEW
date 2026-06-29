// Dashboard.jsx
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import WelcomeSection from "../components/WelcomeSection";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import TicketDonutChart from "../components/TicketDonutChart";
import RecentBookings from "../components/RecentBookings";
import PerformanceInsight from "../components/PerformanceInsight";
import CapacityGoals from "../components/CapacityGoals";
import {
  fetchDashboard,
  fetchDashboardSuccess,
  fetchDashboardFail,
  clearDashboardError,
  selectStats,
  selectLoading,
  selectError,
  selectVendorName,
  selectRequests,
  selectRevenue,
  selectBookings,
  selectTicketTypes,
  selectVisitorStats,
  selectRatings,
} from "../redox/dashboardSlice";
import { logout } from "../redox/authSlice";
import "../Styles/Dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://novaxcape.onrender.com/api/v1";

const getAuthToken = (reduxToken) =>
  localStorage.getItem("vendorToken") ||
  reduxToken ||
  localStorage.getItem("userToken") ||
  localStorage.getItem("token");

const DashboardLoadingState = () => (
  <main className="dashboard-loading-shell" aria-busy="true">
    <section className="dashboard-loading-welcome">
      <div>
        <span className="dashboard-skeleton dashboard-skeleton-title" />
        <span className="dashboard-skeleton dashboard-skeleton-text" />
      </div>
      <span className="dashboard-skeleton dashboard-skeleton-button" />
    </section>

    <section className="dashboard-stats-grid dashboard-stats-grid--loading">
      {Array.from({ length: 4 }).map((_, index) => (
        <article className="dashboard-stat-card dashboard-stat-card--loading" key={index}>
          <div className="stat-header">
            <span className="dashboard-skeleton dashboard-skeleton-stat-title" />
            <span className="dashboard-skeleton dashboard-skeleton-icon" />
          </div>
          <div className="stat-value-row">
            <span className="dashboard-skeleton dashboard-skeleton-stat-value" />
            <span className="dashboard-skeleton dashboard-skeleton-pill" />
          </div>
          <span className="dashboard-skeleton dashboard-skeleton-stat-foot" />
        </article>
      ))}
    </section>

    <section className="chart-section chart-section--loading">
      <div className="chart-card dashboard-chart-card--loading">
        <span className="dashboard-skeleton dashboard-skeleton-chart-title" />
        <span className="dashboard-skeleton dashboard-skeleton-chart-subtitle" />
        <div className="dashboard-skeleton-chart">
          {Array.from({ length: 7 }).map((_, index) => (
            <span
              className="dashboard-skeleton-bar"
              key={index}
              style={{ height: `${36 + index * 8}%` }}
            />
          ))}
        </div>
      </div>

      <div className="ticket-chart dashboard-ticket-chart--loading">
        <span className="dashboard-skeleton dashboard-skeleton-chart-title" />
        <div className="dashboard-skeleton-donut-wrap">
          <span className="dashboard-skeleton-donut" />
          <div className="dashboard-skeleton-legend">
            {Array.from({ length: 4 }).map((_, index) => (
              <span className="dashboard-skeleton dashboard-skeleton-legend-line" key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="single-booking-container dashboard-bookings--loading">
      <div className="booking-top-header">
        <span className="dashboard-skeleton dashboard-skeleton-table-title" />
        <span className="dashboard-skeleton dashboard-skeleton-table-link" />
      </div>
      <div className="dashboard-skeleton-table">
        {Array.from({ length: 5 }).map((_, index) => (
          <span className="dashboard-skeleton dashboard-skeleton-table-row" key={index} />
        ))}
      </div>
    </section>
  </main>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { openMobileMenu = () => {} } = useOutletContext() || {};

  const stats = useSelector(selectStats);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const vendorName = useSelector(selectVendorName);
  const requests = useSelector(selectRequests);
  const revenue = useSelector(selectRevenue);
  const bookings = useSelector(selectBookings);
  const ticketTypes = useSelector(selectTicketTypes);
  const visitorStats = useSelector(selectVisitorStats);
  const ratings = useSelector(selectRatings);

  const { userToken, isAuthenticated } = useSelector((state) => state.auth);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = getAuthToken(userToken);

      if (!isAuthenticated || !token) {
        dispatch(fetchDashboardFail("Please login to view dashboard"));
        return;
      }

      dispatch(fetchDashboard());

      const response = await fetch(`${API_URL}/vendor/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          dispatch(logout());
          dispatch(fetchDashboardFail("Session expired. Please login again."));
          return;
        }

        if (response.status === 404) {
          dispatch(fetchDashboardFail("Vendor not found."));
          return;
        }

        const errorData = await response.json();
        dispatch(
          fetchDashboardFail(
            errorData.message || "Failed to fetch dashboard data",
          ),
        );
        return;
      }

      const data = await response.json();

      const dashboardData = {
        ...data.data,
        recentBookings: data.data.recentBookings || [], 
      };

      dispatch(fetchDashboardSuccess(dashboardData));
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      dispatch(
        fetchDashboardFail(
          error.message || "Network error. Please check your connection.",
        ),
      );
    }
  }, [dispatch, isAuthenticated, userToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();

      // Optional: Auto-refresh every 5 minutes
      const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
      return () => {
        clearInterval(interval);
        dispatch(clearDashboardError());
      };
    }
  }, [dispatch, isAuthenticated, fetchDashboardData]);

  const handleRetry = () => {
    dispatch(clearDashboardError());
    fetchDashboardData();
  };

  if (loading) {
    return (
      <>
        <div className="sticky-wrapper">
          <TopNavbar onMenuOpen={openMobileMenu} />
        </div>
        <DashboardLoadingState />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="sticky-wrapper">
          <TopNavbar onMenuOpen={openMobileMenu} />
        </div>
        <div className="dashboard-error">
          <p style={{ color: "red" }}>Error: {error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <div className="sticky-wrapper">
          <TopNavbar onMenuOpen={openMobileMenu} />
        </div>
        <div className="dashboard-empty">
          <p>No dashboard data available</p>
          <button onClick={handleRetry}>Load Data</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sticky-wrapper">
        <TopNavbar onMenuOpen={openMobileMenu} />
      </div>

      <WelcomeSection />

      <div className="dashboard-stats-grid">
        <StatCard
          title="Total Tickets Today"
          value={requests?.today || 0}
          percent={calculatePercentage(requests?.today, requests?.yesterday)}
          previous={`Yesterday: ${requests?.yesterday || 0}`}
          type="ticket"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(revenue?.today || 0)}
          percent={calculatePercentage(revenue?.today, revenue?.yesterday)}
          previous={`Yesterday: ${formatCurrency(revenue?.yesterday || 0)}`}
          type="revenue"
        />
        <StatCard
          title="Total Bookings"
          value={bookings?.today || 0}
          percent={calculatePercentage(bookings?.today, bookings?.yesterday)}
          previous={`Yesterday: ${bookings?.yesterday || 0}`}
          type="booking"
        />
        <StatCard
          title="Average Rating"
          value={ratings?.average || 0}
          percent={`${ratings?.count || 0} reviews`}
          previous={`Total reviews: ${ratings?.count || 0}`}
          type="rating"
        />
      </div>

      <div className="chart-section">
        <RevenueChart
          data={
            visitorStats?.map((item) => ({
              day: item.date,
              revenue: item.visits,
            })) || []
          }
          title="Visitor Revenue Trend"
          subtitle={`For ${visitorStats?.length || 0} days`}
        />
        <TicketDonutChart
          data={ticketTypes?.breakdown || []}
          total={ticketTypes?.total || 0}
        />
      </div>

      {/* ✅ Fixed: Added fallback for recentBookings */}
      <RecentBookings bookings={stats.recentBookings || []} />

      <div className="bottom-section">
        <PerformanceInsight
          data={{
            revenue: revenue,
            bookings: bookings,
            ratings: ratings,
          }}
        />
        <CapacityGoals
          centreName={vendorName || "Lekki Conservation"}
          capacity={bookings?.total || 1200}
          filled={bookings?.today || 0}
          percentage={
            bookings?.total > 0
              ? Math.round((bookings.today / bookings.total) * 100)
              : 0
          }
        />
      </div>
    </>
  );
};

const calculatePercentage = (current, previous) => {
  if (!previous || previous === 0) return "0%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default Dashboard;
