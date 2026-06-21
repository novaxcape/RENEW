// Dashboard.jsx
import { useEffect } from "react";
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
} from "../redox/dashboardSlice";
import { logout } from "../redox/authSlice";
import "../Styles/Dashboard.css";


const API_URL = 'https://novaxcape.onrender.com/api/v1';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { openMobileMenu = () => {} } = useOutletContext() || {};
  

  const { stats, loading, error } = useSelector((state) => state.dashboard);
  const { userToken, isAuthenticated } = useSelector((state) => state.auth);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      // Check if user is authenticated
      if (!isAuthenticated || !userToken) {
        dispatch(fetchDashboardFail('Please login to view dashboard'));
        return;
      }

      // Set loading state
      dispatch(fetchDashboard());

      // Make API call using fetch with env URL
      const response = await fetch(`${API_URL}/vendor/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

    
      if (!response.ok) {
       
        if (response.status === 401) {
          dispatch(logout());
          dispatch(fetchDashboardFail('Session expired. Please login again.'));
          return;
        }
        
    
        if (response.status === 404) {
          dispatch(fetchDashboardFail('Vendor not found.'));
          return;
        }

    
        const errorData = await response.json();
        dispatch(fetchDashboardFail(errorData.message || 'Failed to fetch dashboard data'));
        return;
      }

   
      const data = await response.json();
      
   
      dispatch(fetchDashboardSuccess(data.data));

    } catch (error) {
      
      console.error('Dashboard fetch error:', error);
      dispatch(fetchDashboardFail(error.message || 'Network error. Please check your connection.'));
    }
  };


  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }


    return () => {
      dispatch(clearDashboardError());
    };
  }, [dispatch, isAuthenticated]);


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
        <div className="dashboard-loading">
          <p>Loading dashboard...</p>
        </div>
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
          <p style={{ color: 'red' }}>Error: {error}</p>
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
          value={stats.requests?.today || 0} 
          percent={calculatePercentage(stats.requests?.today, stats.requests?.yesterday)} 
          previous={`Yesterday: ${stats.requests?.yesterday || 0}`} 
          type="ticket" 
        />
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats.revenue?.today || 0)} 
          percent={calculatePercentage(stats.revenue?.today, stats.revenue?.yesterday)} 
          previous={`Yesterday: ${formatCurrency(stats.revenue?.yesterday || 0)}`} 
          type="revenue" 
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.bookings?.today || 0} 
          percent={calculatePercentage(stats.bookings?.today, stats.bookings?.yesterday)} 
          previous={`Yesterday: ${stats.bookings?.yesterday || 0}`} 
          type="booking" 
        />
        <StatCard 
          title="Average Rating" 
          value={stats.ratings?.average || stats.ratings?.count || 0} 
          percent={`${stats.ratings?.count || 0} reviews`} 
          previous={`Total: ${stats.ratings?.count || 0}`} 
          type="rating" 
        />
      </div>

      <div className="chart-section">
        <RevenueChart 
          data={stats.visitorStats?.map(item => ({
            day: item.date,
            revenue: item.visits
          })) || []}
          title="Visitor Revenue Trend"
          subtitle={`For ${stats.visitorStats?.length || 0} days`}
        />
        <TicketDonutChart 
          data={stats.ticketTypes?.breakdown || []}
          total={stats.ticketTypes?.total || 0}
        />
      </div>

      <RecentBookings bookings={stats.recentBookings || []} />

      <div className="bottom-section">
        <PerformanceInsight data={{
          revenue: stats.revenue,
          bookings: stats.bookings,
          ratings: stats.ratings,
        }} />
        <CapacityGoals 
          centreName={stats.vendorName || "Lekki Conservation"}
          capacity={stats.bookings?.total || 1200}
          filled={stats.bookings?.today || 0}
          percentage={stats.bookings?.total > 0 
            ? Math.round((stats.bookings.today / stats.bookings.total) * 100) 
            : 0
          }
        />
      </div>
    </>
  );
};

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