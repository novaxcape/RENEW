// Pages/VendorCenters.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getVendorAllCentres, deleteTouristCenter } from '../redox/apiSlice';
import '../Styles/VendorCenters.css';

const VendorCenters = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    userToken, 
    isVendor, 
    isAuthenticated 
  } = useSelector((state) => state.auth);
  
  const { 
    vendorCentres, 
    touristCentresLoading,
    touristCentresError 
  } = useSelector((state) => state.api);
  
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !isVendor || !userToken) {
      navigate('/vendor/login');
    }
  }, [isAuthenticated, isVendor, userToken, navigate]);

  useEffect(() => {
    if (vendorCentres && vendorCentres.length > 0) {
      console.log('✅ Using centres from Redux:', vendorCentres);
      setCenters(vendorCentres);
      localStorage.setItem("vendorCenterCount", vendorCentres.length);
      localStorage.setItem("hasCentre", "true");
      
      const firstCentre = vendorCentres[0];
      const centreId = firstCentre?.id || firstCentre?._id;
      if (centreId) {
        localStorage.setItem("centreId", centreId);
        localStorage.setItem("selectedCentreId", centreId);
      }
    }
  }, [vendorCentres]);

  useEffect(() => {
    if (isAuthenticated && isVendor && userToken) {
      if (!vendorCentres || vendorCentres.length === 0) {
        fetchVendorCenters();
      }
    }
  }, [userToken, vendorCentres]);

  const fetchVendorCenters = async () => {
    try {
      console.log('📄 Fetching vendor centers using GET /tourist/get-all...');
      const result = await dispatch(getVendorAllCentres()).unwrap();
      
      const centres = result?.data || [];
      setCenters(centres);
      localStorage.setItem("vendorCenterCount", centres.length);
      
      if (centres.length > 0) {
        localStorage.setItem("hasCentre", "true");
        const firstCentre = centres[0];
        const centreId = firstCentre?.id || firstCentre?._id;
        if (centreId) {
          localStorage.setItem("centreId", centreId);
          localStorage.setItem("selectedCentreId", centreId);
        }
      }
      
      console.log(`✅ Loaded ${centres.length} centers`);
    } catch (error) {
      console.error('❌ Error fetching centers:', error);
      
      if (error !== "No centres found. Create your first centre.") {
        Swal.fire({
          icon: 'error',
          title: 'Error Loading Centers',
          text: error || 'Failed to load your centers.',
          confirmButtonColor: '#ff6b35',
        });
      }
    }
  };

  const handleDeleteCenter = async (centerId, centerName) => {
    const result = await Swal.fire({
      title: 'Delete Center?',
      text: `Are you sure you want to delete "${centerName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteTouristCenter(centerId)).unwrap();
        await fetchVendorCenters();
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Center has been deleted successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: error || 'Failed to delete center.',
          confirmButtonColor: '#ff6b35',
        });
      }
    }
  };

  const handleRefresh = () => {
    fetchVendorCenters();
  };

  const handleSelectCentre = (center) => {
    const id = center.id || center._id;
    localStorage.setItem("selectedCentreId", id);
    localStorage.setItem("selectedCentreName", center.centreName || center.name || "");
    
    navigate("/vendor/dashboard", { 
      state: { 
        selectedCentre: center,
        centreId: id 
      } 
    });
  };

  if (touristCentresLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading your centers...</p>
      </div>
    );
  }

  if (touristCentresError && touristCentresError !== "No centres found. Create your first centre.") {
    return (
      <div className="error-container">
        <h3>Error Loading Centers</h3>
        <p>{touristCentresError}</p>
        <button onClick={handleRefresh} className="refresh-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="vendor-centers-container">
      <div className="centers-header">
        <div>
          <h1>My Tourist Centers</h1>
          {centers.length > 0 && (
            <p className="vendor-info">
              Showing {centers.length} center{centers.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="header-actions">
          <button 
            className="refresh-btn" 
            onClick={handleRefresh}
            disabled={touristCentresLoading}
          >
            🔄 Refresh
          </button>
          <button 
            className="create-center-btn"
            onClick={() => navigate('/add-centre')}
          >
            + Create New Center
          </button>
        </div>
      </div>

      {centers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏛️</div>
          <h3>No Centers Created Yet</h3>
          <p>Start by creating your first tourist center.</p>
          <button 
            className="create-center-btn"
            onClick={() => navigate('/add-centre')}
          >
            Create Your First Center
          </button>
        </div>
      ) : (
        <div className="centers-grid">
          {centers.map((center) => {
            const id = center.id || center._id;
            const name = center.centreName || center.name || "Unnamed Centre";
            const location = center.city || center.state || center.location || "";
            const imageUrl = center.images?.[0]?.secureUrl || center.imagesPublicUrl?.[0] || null;
            
            return (
              <div key={id} className="center-card">
                <div className="center-image">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={name}
                      onError={(e) => {
                        e.target.src = '/novaxcape/default-center.jpg';
                      }}
                    />
                  ) : (
                    <div className="no-image">📷 No Image</div>
                  )}
                </div>

                <div className="center-details">
                  <h3>{name}</h3>
                  {location && (
                    <p className="center-location">📍 {location}</p>
                  )}
                  <p className="center-description">
                    {center.description || 'No description available'}
                  </p>
                  
                  <div className="center-info">
                    {center.openingHours && (
                      <span className="info-item">🕐 {center.openingHours}</span>
                    )}
                    {center.dailySlotCapacity && (
                      <span className="info-item">👥 Capacity: {center.dailySlotCapacity}</span>
                    )}
                    {center.installmentPayment && (
                      <span className="info-item badge">💰 Installment Available</span>
                    )}
                  </div>

                  <div className="center-actions">
                    <button 
                      className="view-btn"
                      onClick={() => handleSelectCentre(center)}
                    >
                      Manage Centre
                    </button>
                    <button 
                      className="edit-btn"
                      onClick={() => navigate(`/vendor/edit-center/${id}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteCenter(id, name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorCenters;