// File: src/Pages/ProductDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import "../Styles/Product.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTouristCenterById, getAllPackages } from "../redox/apiSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isWishlist, setIsWishlist] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [centrePackages, setCentrePackages] = useState([]);

  const { selectedTouristCenter, touristCentresLoading, touristCentresError, packages, packagesLoading } =
    useSelector((state) => state.api);

  const getCentreData = () => {
    if (location.state?.centre) return location.state.centre;
    if (location.state?.centreDetails) return location.state.centreDetails;

    if (selectedTouristCenter) {
      return selectedTouristCenter?.data || 
             selectedTouristCenter?.tourist || 
             selectedTouristCenter;
    }

    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking) {
      try {
        const parsed = JSON.parse(pendingBooking);
        if (parsed.centreDetails) return parsed.centreDetails;
      } catch (e) {
        console.error("Error parsing pending booking:", e);
      }
    }
    return null;
  };

  const centre = getCentreData();

  // ✅ FIXED: Load wishlist from localStorage on component mount
  useEffect(() => {
    if (centre) {
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const centreId = id || centre?.id || centre?._id;
      const isSaved = savedWishlist.some(item => item.id === centreId || item._id === centreId);
      setIsWishlist(isSaved);
    }
  }, [id, centre]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!centre && id) {
          await dispatch(getTouristCenterById(id));
        }
        await dispatch(getAllPackages(id));
      } catch (error) {
        console.error("❌ Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id, centre]);

  useEffect(() => {
    if (!packages || packages.length === 0) {
      setCentrePackages([]);
      return;
    }
    setCentrePackages(packages);
  }, [packages]);

  // Handle Add to Wishlist / Favorite
  const handleWishlistToggle = () => {
    if (!centre) {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Centre data not available',
        confirmButtonColor: '#ff6b35'
      });
      return;
    }

    const centreId = centre.id || centre._id || id;
    
    // Get current wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Check if centre is already in wishlist
    const existingIndex = savedWishlist.findIndex(item => 
      item.id === centreId || item._id === centreId
    );

    let newWishlist;
    let message;
    let icon;

    if (existingIndex !== -1) {
      // Remove from wishlist
      newWishlist = savedWishlist.filter((_, index) => index !== existingIndex);
      message = `${centreName} removed from your favorites`;
      icon = 'success';
      setIsWishlist(false);
    } else {
      // Add to wishlist
      const wishlistItem = {
        id: centreId,
        _id: centreId,
        centreName: centreName,
        name: centreName,
        location: centreLocation,
        city: centre.city || '',
        state: centre.state || '',
        rating: rating,
        averageRating: rating,
        reviews: reviewCount,
        openingHours: openingHours,
        images: images,
        image: images[0],
        price: centrePackages[0]?.amount || centrePackages[0]?.price || 2500,
        description: description,
        facilities: facilities,
      };
      
      newWishlist = [...savedWishlist, wishlistItem];
      message = `${centreName} added to your favorites! ❤️`;
      icon = 'success';
      setIsWishlist(true);
    }

    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    
    // Show success message
    Swal.fire({
      icon: icon,
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    // Dispatch custom event to update wishlist count in header
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  // Show loading state
  if (touristCentresLoading || packagesLoading || isLoading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading centre details...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Show error state
  if ((touristCentresError && !centre) || !centre) {
    return (
      <>
        <Header />
        <div className="error-container">
          <h2>Centre Not Found</h2>
          <p>Unable to load centre details. Please try again.</p>
          <button onClick={() => navigate("/discover")} className="back-btn">
            Back to Discover
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Parse fields safely (only runs if centre exists)
  const centreName = centre.centreName || centre.name || "Tourist Centre";
  const centreLocation = centre.location || [centre.city, centre.state].filter(Boolean).join(", ") || "Location not specified";
  const openingHours = centre.openingHours || "Hours not specified";
  const rating = centre.rating || centre.averageRating || 5.0;
  const reviewCount = centre.reviews || centre.reviewCount || 567;
  const description = centre.description || "No description available";
  
  const facilities = typeof centre.facilitiesAndAmenities === "string"
    ? centre.facilitiesAndAmenities.split(", ")
    : Array.isArray(centre.facilitiesAndAmenities) 
    ? centre.facilitiesAndAmenities 
    : ["Nature trails", "Picnic Areas", "WildLife Viewing"];

  const rawImages = Array.isArray(centre.images)
    ? centre.images.map(img => (img && typeof img === "object" ? img.secureUrl : img))
    : Array.isArray(centre.imagesPublicUrl)
    ? centre.imagesPublicUrl
    : typeof centre.imagesPublicUrl === "string"
    ? [centre.imagesPublicUrl]
    : [];

  const images = [
    rawImages[0] || "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    rawImages[1] || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    rawImages[2] || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  ];

  const handleBookNow = (pkg) => {
    if (!pkg) {
      Swal.fire({ icon: "warning", title: "No Package Selected", text: "Please select a package.", confirmButtonColor: "#ff6b35" });
      return;
    }

    const centreId = centre.id || centre._id || id;
    setSelectedPackage(pkg);
    
    const bookingData = {
      touristId: centreId,
      packageId: pkg.id,
      packageDetails: {
        id: pkg.id,
        packageName: pkg.packageName || pkg.name || "Package",
        amount: pkg.amount || pkg.price || 0,
        price: pkg.amount || pkg.price || 0,
        packageType: pkg.packageType || "Standard",
        numberOfPeople: pkg.numberOfPeople || 1,
        description: pkg.description || "",
      },
      centreDetails: {
        id: centreId,
        centreName,
        city: centre.city || "",
        state: centre.state || "",
        openingHours,
        description,
        images,
      },
      returnUrl: `/booking-summary/${centreId}/${pkg.id}`
    };

    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');

    if (!token) {
      navigate("/signin", { state: { from: `/centre/${centreId}`, bookingData } });
      return;
    }

    navigate(`/booking-summary/${centreId}/${pkg.id}`, { state: bookingData });
  };

  const renderStars = (ratingValue) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} color="#ffb400" />);
    }
    while (stars.length < 5) {
      stars.push(<FaStar key={stars.length} color="#ddd" />);
    }
    return stars;
  };

  const getDescription = () => {
    if (showFullDescription || description.length <= 400) return description;
    return description.slice(0, 400) + "...";
  };

  const reviews = [
    { id: 1, name: "Nnaneme O.", rating: 5, comment: "Absolutely loved the canopy walkway! It was so long and the view from the top is breathtaking. A must visit for anyone in Lagos. Very well maintained." },
    { id: 2, name: "Tunde S.", rating: 5, comment: "Perfect for a family outing. My kids enjoyed the canopy walk and the playground area. The boardwalks are clean and safe. Highly recommended!" },
    { id: 3, name: "Salewa Ahmed", rating: 4, comment: "The place is beautiful and peaceful. Saw so many monkeys and birds. However, the ticket price is a bit high compared to other parks. Still worth it though." }
  ];

  return (
    <>
      <Header />
      <main className="product-page">
        <div className="container">
          
          {/* TITLE SECTION */}
          <section className="listing-header">
            <h1 className="title">{centreName}</h1>
            <div className="meta">
              <span><FaMapMarkerAlt /> {centreLocation}</span>
              <span><FaClock /> Timings below</span>
              <span className="rating">
                {renderStars(rating)}
                <strong>{rating.toFixed(1)}</strong> ({reviewCount})
              </span>
            </div>
            <div className="tags">
              {facilities.slice(0, 6).map((facility, index) => (
                <span key={index}>{facility}</span>
              ))}
            </div>
          </section>

          {/* IMAGE GALLERY */}
          <section className="gallery">
            <div className="main-image">
              <img
                src={images[0]}
                alt={centreName}
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb"; }}
              />
            </div>
            <div className="side-images">
              <img 
                src={images[1]} 
                alt="" 
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"; }}
              />
              <img 
                src={images[2]} 
                alt="" 
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"; }}
              />
            </div>
          </section>

          {/* SNAPSHOT SNAP BLOCK */}
          <section className="features">
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <div>
                <p className="feature-label">Capacity Limit</p>
                <h4>{centre.dailySlotCapacity || 50} Slots Daily</h4>
              </div>
            </div>
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <div>
                <p className="feature-label">Installment Payments</p>
                <h4>{centre.installmentPayment ? "Supported" : "Not Offered"}</h4>
              </div>
            </div>
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <div>
                <p className="feature-label">Includes</p>
                <h4>Ticket, Amenities Access</h4>
              </div>
            </div>
          </section>

          {/* DESCRIPTION & SCHEDULE WRAPPER */}
          <section className="content-split-wrapper">
            <div className="description-block">
              <h2>Description</h2>
              <p>
                {getDescription()}
                {description.length > 400 && (
                  <span className="readmore-btn" onClick={() => setShowFullDescription(!showFullDescription)}>
                    {showFullDescription ? " Read less" : " Read more"}
                  </span>
                )}
              </p>
              
              <div style={{ marginTop: '20px', fontSize: '13.5px', color: '#4a5568', background: '#f7fafc', padding: '15px', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '6px', color: '#112244' }}>🕒 Schedule Breakdown:</strong>
                {openingHours.split(" | ").map((day, i) => <div key={i} style={{ marginBottom: '3px' }}>{day}</div>)}
              </div>

              <div className="actions">
                <button 
                  className="book-btn" 
                  onClick={() => handleBookNow(centrePackages[0] || { id: "default", price: 2500 })}
                >
                  Book Now
                </button>
                <button 
                  className={`fav-btn ${isWishlist ? 'active' : ''}`} 
                  onClick={handleWishlistToggle}
                >
                  {isWishlist ? (
                    <>
                      <FaHeart style={{ color: '#ff6b35', marginRight: '8px' }} />
                      Remove from favorite
                    </>
                  ) : (
                    <>
                      <FaRegHeart style={{ marginRight: '8px' }} />
                      Add to favorite
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* MAP BLOCK */}
            <div className="map-block">
              <img 
                src="https://i.postimg.cc/N0F86Np4/map.jpg" 
                alt="Location Map" 
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
              />
            </div>
          </section>

          {/* REVIEWS */}
          {/* <section className="reviews-section">
            <h2>View all Reviews</h2>
            <div className="review-grid">
              {reviews.map((review) => (
                <div className="review-card" key={review.id}>
                  <div className="review-user-info">
                    <div className="avatar-placeholder"></div>
                    <div>
                      <h4>{review.name}</h4>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} color={i < review.rating ? "#ffb400" : "#ddd"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
            <div className="pagination-arrows">
              <button className="arrow-btn">‹</button>
              <button className="arrow-btn active">›</button>
            </div>
          </section> */}

          {/* DISCOVER RECOMMENDATIONS */}
          <section className="recommendations-section">
            <h2>Destinations you may also like</h2>
            <div className="destination-grid">
              <div className="destination-card">
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="" />
                <div className="card-content">
                  <h4>Lekki Conservation Centre</h4>
                  <p className="card-location">Lagos</p>
                  <div className="card-meta">⭐⭐⭐⭐⭐ 5.0 (567) <span>⏰ 8:30 AM - 5:00 PM</span></div>
                  <div className="card-footer">
                    <div className="price-tag"><span className="from-label">From</span> ₦2500</div>
                    <button className="book-now-small">Book Now</button>
                  </div>
                </div>
              </div>

              <div className="destination-card">
                <img src="https://images.unsplash.com/photo-1511497584788-876760111969" alt="" />
                <div className="card-content">
                  <h4>Olumo Rock</h4>
                  <p className="card-location">Abeokuta</p>
                  <div className="card-meta">⭐⭐⭐⭐ 4.0 (89) <span>⏰ 9:00 AM - 6:00 PM</span></div>
                  <div className="card-footer">
                    <div className="price-tag"><span className="from-label">From</span> ₦2000</div>
                    <button className="book-now-small">Book Now</button>
                  </div>
                </div>
              </div>

              <div className="destination-card">
                <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e" alt="" />
                <div className="card-content">
                  <h4>Mapo Hall</h4>
                  <p className="card-location">Ibadan</p>
                  <div className="card-meta">⭐⭐⭐⭐⭐ 4.9 (76) <span>⏰ 8:30 AM - 5:00 PM</span></div>
                  <div className="card-footer">
                    <div className="price-tag"><span className="from-label">From</span> ₦1500</div>
                    <button className="book-now-small">Book Now</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetails;