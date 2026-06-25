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

const API_URL = 'https://novaxcape.onrender.com/api/v1';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { openMobileMenu = () => {} } = useOutletContext() || {};
  
  // ✅ Using specific selectors for better performance
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

  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated || !userToken) {
        dispatch(fetchDashboardFail('Please login to view dashboard'));
        return;
      }

      // Set loading state
      dispatch(fetchDashboard());

      // Make API call
      const response = await fetch(`${API_URL}/vendor/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          dispatch(logout());
          dispatch(fetchDashboardFail('Session expired. Please login again.'));
          return;
        }
        
        // Handle 404 Not Found
        if (response.status === 404) {
          dispatch(fetchDashboardFail('Vendor not found.'));
          return;
        }

        // Handle other errors
        const errorData = await response.json();
        dispatch(fetchDashboardFail(errorData.message || 'Failed to fetch dashboard data'));
        return;
      }

      // Parse the response
      const data = await response.json();
      
      // ✅ The API returns: { message, data: { vendorName, requests, revenue, ... } }
      // So we pass data.data to the success action
      dispatch(fetchDashboardSuccess(data.data));

    } catch (error) {
      console.error('Dashboard fetch error:', error);
      dispatch(fetchDashboardFail(error.message || 'Network error. Please check your connection.'));
    }
  }, [dispatch, isAuthenticated, userToken]);

  // Fetch dashboard data on mount and when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }

    // Cleanup error on unmount
    return () => {
      dispatch(clearDashboardError());
    };
  }, [dispatch, isAuthenticated, fetchDashboardData]);

  // Handle retry
  const handleRetry = () => {
    dispatch(clearDashboardError());
    fetchDashboardData();
  };

  // Loading state
  if (loading) {
    return (
      <>
        <div className="sticky-wrapper">
          <TopNavbar onMenuOpen={openMobileMenu} />
        </div>
        <div className="dashboard-loading">
          <p>Loading dashboard...</p>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <div className="sticky-wrapper">
          <TopNavbar onMenuOpen={openMobileMenu} />
        </div>
        <div className="dashboard-error">
          <p style={{ color: 'red' }}>Error: {error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      </>
    );
  }

  // No data state
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

  // ✅ Now stats contains: vendorName, requests, revenue, bookings, ticketTypes, visitorStats, ratings
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
          data={visitorStats?.map(item => ({
            day: item.date,
            revenue: item.visits
          })) || []}
          title="Visitor Revenue Trend"
          subtitle={`For ${visitorStats?.length || 0} days`}
        />
        <TicketDonutChart 
          data={ticketTypes?.breakdown || []}
          total={ticketTypes?.total || 0}
        />
      </div>

      <RecentBookings bookings={stats.recentBookings || []} />

      <div className="bottom-section">
        <PerformanceInsight data={{
          revenue: revenue,
          bookings: bookings,
          ratings: ratings,
        }} />
        <CapacityGoals 
          centreName={vendorName || "Lekki Conservation"}
          capacity={bookings?.total || 1200}
          filled={bookings?.today || 0}
          percentage={bookings?.total > 0 
            ? Math.round((bookings.today / bookings.total) * 100) 
            : 0
          }
        />
      </div>
    </>
  );
};

// Helper functions
const calculatePercentage = (current, previous) => {
  if (!previous || previous === 0) return '0%';
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default Dashboard;