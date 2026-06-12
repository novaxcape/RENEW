import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import WelcomeSection from "../components/WelcomeSection";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import TicketDonutChart from "../components/TicketDonutChart";
import RecentBookings from "../components/RecentBookings";
import PerformanceInsight from "../components/PerformanceInsight";
import CapacityGoals from "../components/CapacityGoals";
import { getVendorTouristCenters } from "../redox/apiSlice";
import "../Styles/Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get data from Redux state
  const { vendorDetails } = useSelector((state) => state.auth);
  const { vendorCentres, loading } = useSelector((state) => state.api);
  
  // Check for recently added centre
  const [recentCentre, setRecentCentre] = useState(null);
  
  // Calculate stats
  const pendingCentres = vendorCentres?.filter(centre => 
    centre.kycStatus === 'pending' || !centre.kycStatus
  ) || [];
  
  const approvedCentres = vendorCentres?.filter(centre => 
    centre.kycStatus === 'approved'
  ) || [];

  // Fetch vendor data on mount
  useEffect(() => {
    const vendorId = vendorDetails?.id || localStorage.getItem('vendorId');
    
    if (vendorId) {
      dispatch(getVendorTouristCenters(vendorId));
    }
    
    // Check for recently added centre from localStorage
    const lastAdded = localStorage.getItem('lastAddedCentre');
    if (lastAdded) {
      setRecentCentre(JSON.parse(lastAdded));
      setTimeout(() => {
        localStorage.removeItem('lastAddedCentre');
      }, 5000);
    }
  }, [dispatch, vendorDetails]);

  const handleAddCentre = () => {
    navigate('/addcentre');
  };

  const handleViewCentre = (centreId) => {
    navigate(`/vendor/centre/${centreId}`);
  };

  const handleKycStatus = () => {
    navigate('/kyc-status');
  };

  // If loading, show loading state
  if (loading && !vendorCentres) {
    return (
      <div className="dashboard-content">
        <div className="sticky-wrapper">
          <TopNavbar onMenuOpen={() => setMobileMenuOpen(true)} />
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="sticky-wrapper">
        <TopNavbar onMenuOpen={() => setMobileMenuOpen(true)} />
      </div>

      {/* Success Message for New Centre */}
      {recentCentre && (
        <div className="success-banner">
          <div className="success-icon">✅</div>
          <div className="success-message">
            <strong>Centre Submitted Successfully!</strong>
            <p>"{recentCentre.centreName}" has been submitted for KYC verification.</p>
          </div>
          <button className="close-banner" onClick={() => setRecentCentre(null)}>×</button>
        </div>
      )}

      {/* KYC Pending Banner */}
      {pendingCentres.length > 0 && (
        <div className="kyc-pending-banner">
          <div className="banner-icon">⏳</div>
          <div className="banner-content">
            <strong>KYC Verification In Progress</strong>
            <p>You have {pendingCentres.length} centre(s) waiting for verification.</p>
            <button onClick={handleKycStatus} className="kyc-status-link">
              Check Status →
            </button>
          </div>
        </div>
      )}

      <WelcomeSection 
        vendorName={vendorDetails?.centreName || vendorDetails?.name || "Vendor"}
        centreCount={vendorCentres?.length || 0}
      />

      <div className="stats-grid">
        <StatCard 
          title="Total Centres" 
          value={vendorCentres?.length || "0"} 
          percent={`${approvedCentres.length} Active`}
          previous={`${pendingCentres.length} Pending`} 
          type="ticket" 
        />
        <StatCard 
          title="Total Revenue" 
          value="₦0" 
          percent="0%" 
          previous="This month" 
          type="revenue" 
        />
        <StatCard 
          title="Total Bookings" 
          value="0" 
          percent="0%" 
          previous="All time" 
          type="booking" 
        />
        <StatCard 
          title="Average Rating" 
          value="0.0" 
          percent="0" 
          previous="⭐ 0 reviews" 
          type="rating" 
        />
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions">
        <button className="add-centre-btn" onClick={handleAddCentre}>
          + Add New Centre
        </button>
      </div>

      {/* My Centres Section */}
      {vendorCentres?.length > 0 && (
        <div className="centres-section">
          <h2>My Tourism Centres</h2>
          <div className="centres-grid">
            {vendorCentres.map((centre) => (
              <div key={centre.id || centre._id} className="centre-card">
                <div className="centre-header">
                  <h3>{centre.centreName || centre.name}</h3>
                  {/* ✅ FIXED: changed from 'status-badge' to 'centre-status-badge' */}
                  <span className={`centre-status-badge ${centre.kycStatus === 'approved' ? 'approved' : 'pending'}`}>
                    {centre.kycStatus === 'approved' ? '✅ Active' : '⏳ Pending'}
                  </span>
                </div>
                <div className="centre-details">
                  <p>📍 {centre.city}, {centre.state}</p>
                  <p>📅 Created: {new Date(centre.createdAt).toLocaleDateString()}</p>
                </div>
                <button 
                  className="view-centre-btn"
                  onClick={() => handleViewCentre(centre.id || centre._id)}
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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