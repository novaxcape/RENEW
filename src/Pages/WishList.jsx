// File: src/Pages/WishList.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaStar, FaClock, FaHeart, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "../Styles/SavedAttractions.css";

const WishList = () => {
  const navigate = useNavigate();
  const [attractions, setAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    loadWishlist();
  }, []);

  // Listen for wishlist updates from other components
  useEffect(() => {
    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    // Also listen for storage changes (if multiple tabs open)
    window.addEventListener('storage', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('storage', handleWishlistUpdate);
    };
  }, []);

  const loadWishlist = () => {
    setIsLoading(true);
    try {
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      console.log("📋 Loaded wishlist:", savedWishlist);
      setAttractions(savedWishlist);
    } catch (error) {
      console.error("❌ Error loading wishlist:", error);
      setAttractions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove from wishlist
  const handleRemove = (id) => {
    Swal.fire({
      title: 'Remove from favorites?',
      text: 'Are you sure you want to remove this attraction from your wishlist?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ff6b35',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedWishlist = attractions.filter(item => 
          (item.id !== id && item._id !== id)
        );
        
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setAttractions(updatedWishlist);
        
        // Dispatch event to update other components
        window.dispatchEvent(new Event('wishlistUpdated'));
        
        Swal.fire({
          icon: 'success',
          title: 'Removed from favorites',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  // Handle clear all wishlist
  const handleClearAll = () => {
    if (attractions.length === 0) return;

    Swal.fire({
      title: 'Clear all favorites?',
      text: 'This will remove all attractions from your wishlist.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, clear all',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem('wishlist', JSON.stringify([]));
        setAttractions([]);
        window.dispatchEvent(new Event('wishlistUpdated'));
        
        Swal.fire({
          icon: 'success',
          title: 'Wishlist cleared',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  // Handle navigation to centre details
  const handleViewCentre = (attraction) => {
    const centreId = attraction.id || attraction._id;
    if (centreId) {
      navigate(`/centre/${centreId}`, { 
        state: { centre: attraction } 
      });
    }
  };

  // Handle book now
  const handleBookNow = (attraction) => {
    const centreId = attraction.id || attraction._id;
    if (centreId) {
      navigate(`/centre/${centreId}`, { 
        state: { centre: attraction } 
      });
    }
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numRating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star" />);
    }
    for (let i = fullStars; i < 5; i++) {
      stars.push(<FaStar key={i} className="star" style={{ color: '#ddd' }} />);
    }
    return stars;
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="saved-attractions">
        <div className="wishlist-header">
          <div>
            <h2>Saved Attractions ({attractions.length})</h2>
            <p className="subtitle">
              View and manage all your saved experiences in one place
            </p>
          </div>
          {attractions.length > 0 && (
            <button 
              className="clear-all-btn"
              onClick={handleClearAll}
            >
              <FaTrash /> Clear All
            </button>
          )}
        </div>

        {attractions.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-content">
              <FaHeart className="empty-heart-icon" />
              <h3>Your wishlist is empty</h3>
              <p>Start exploring and save your favorite attractions!</p>
              <button 
                className="explore-btn"
                onClick={() => navigate('/discover')}
              >
                Explore Attractions
              </button>
            </div>
          </div>
        ) : (
          <div className="attractions-grid">
            {attractions.map((item) => {
              // Get the image URL
              const imageUrl = item.image || 
                              (item.images && item.images[0]) || 
                              (item.imagesPublicUrl && item.imagesPublicUrl[0]) ||
                              "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
              
              // Get the price
              const price = item.price || item.amount || 2500;
              
              // Get the rating
              const rating = item.rating || item.averageRating || 4.5;
              
              // Get the review count
              const reviewCount = item.reviews || item.reviewCount || 0;

              return (
                <div className="attraction-card" key={item.id || item._id}>
                  <img 
                    src={imageUrl} 
                    alt={item.centreName || item.name || "Attraction"} 
                    onClick={() => handleViewCentre(item)}
                    style={{ cursor: 'pointer' }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
                    }}
                  />

                  <div className="card-body">
                    <div className="card-header">
                      <h3 
                        onClick={() => handleViewCentre(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        {item.centreName || item.name || "Attraction"}
                      </h3>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemove(item.id || item._id)}
                        title="Remove from wishlist"
                      >
                        <FaHeart style={{ color: '#ff6b35' }} />
                      </button>
                    </div>

                    <p className="location">
                      {item.city && item.state 
                        ? `${item.city}, ${item.state}`
                        : item.location || item.city || item.state || "Location not specified"}
                    </p>

                    <div className="rating-row">
                      <div>
                        {renderStars(rating)}
                        <span className="rating">
                          {typeof rating === 'number' ? rating.toFixed(1) : rating} ({reviewCount})
                        </span>
                      </div>

                      <span className="time">
                        <FaClock />
                        {item.openingHours || "8:30 AM - 5:00 PM"}
                      </span>
                    </div>

                    <div className="bottom-row">
                      <div>
                        <small>From</small>
                        <h4>₦{typeof price === 'number' ? price.toLocaleString() : price}</h4>
                      </div>

                      <button 
                        onClick={() => handleBookNow(item)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
};

export default WishList;