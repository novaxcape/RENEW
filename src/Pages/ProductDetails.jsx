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
  FaShareAlt,
} from "react-icons/fa";

import "../Styles/Product.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getTouristCenterById } from "../redox/apiSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isWishlist, setIsWishlist] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const { selectedTouristCenter, touristCentresLoading, touristCentresError } =
    useSelector((state) => state.api);
  const { isAuthenticated, userToken, loggedInUser } = useSelector((state) => state.auth);

  // ✅ Restore auth state from localStorage if Redux state is empty
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    const storedClientId = localStorage.getItem('clientId');
    
    // If Redux doesn't have auth but localStorage does, we're still authenticated
    if (token && !isAuthenticated) {
      console.log("🔐 Restoring auth state from localStorage");
      // You could dispatch an action here to restore the state
    }
  }, [isAuthenticated]);

  // Debug authentication state
  console.log("🔐 Auth State - isAuthenticated:", isAuthenticated);
  console.log("🔐 Auth State - userToken:", userToken);
  console.log("🔐 Auth State - loggedInUser:", loggedInUser);
  console.log("🔐 localStorage token:", localStorage.getItem('token'));

  // Get passed centre from navigation state
  const passedCentre = location.state?.centre || location.state?.centreDetails;

  console.log("ProductDetails Page Loaded");
  console.log("ID from URL:", id);
  console.log("Passed Centre:", passedCentre);

  useEffect(() => {
    if (!passedCentre && id) {
      console.log("Fetching centre from API with ID:", id);
      dispatch(getTouristCenterById(id));
    }
  }, [dispatch, id, passedCentre]);

  // Determine centre data source
  let centre = null;
  
  if (passedCentre) {
    centre = passedCentre;
    console.log("Using passed centre data");
  } else if (selectedTouristCenter) {
    centre = selectedTouristCenter?.data || selectedTouristCenter?.tourist || selectedTouristCenter;
    console.log("Using API centre data:", centre);
  }

  // Show loading state
  if (!passedCentre && touristCentresLoading) {
    return (
      <>
        <Header />
        <div className="loading-container" style={{ textAlign: "center", padding: "100px 20px" }}>
          <div className="spinner"></div>
          <p>Loading centre details...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Show error state
  if (!passedCentre && touristCentresError) {
    return (
      <>
        <Header />
        <div className="error-container" style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2>Centre Not Found</h2>
          <p>{typeof touristCentresError === "string" ? touristCentresError : "Unable to load centre details"}</p>
          <button onClick={() => navigate("/discover")} className="back-btn" style={{ background: "#ff6b35", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer" }}>
            Back to Discover
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Show not found if no centre
  if (!centre) {
    return (
      <>
        <Header />
        <div className="error-container" style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2>No Centre Data</h2>
          <p>Unable to load centre information. Please try again.</p>
          <button onClick={() => navigate("/discover")} className="back-btn" style={{ background: "#ff6b35", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer" }}>
            Back to Discover
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Extract centre data
  const centreName = centre.centreName || centre.name || "Tourist Centre";
  const centreLocation = [centre.city, centre.state].filter(Boolean).join(", ") || "Location not specified";
  const openingHours = centre.openingHours || "Hours not specified";
  const rating = centre.rating || centre.averageRating || 4.5;
  const reviewCount = centre.reviews || centre.reviewCount || 0;
  const description = centre.description || "No description available";
  const facilities = centre.facilitiesAndAmenities?.split(", ") || centre.facilities || [];
  const images = centre.images || [];
  const packages = centre.packages || [];

  console.log("Rendering centre:", centreName);
  console.log("Packages found:", packages.length);
  console.log("Packages data:", packages);

  const getPackagePrice = (pkg) => {
    return pkg.amount || pkg.price || 0;
  };

  // ✅ Updated handleBookNow - uses localStorage as primary auth check
  const handleBookNow = (pkg) => {
    console.log("🛒 handleBookNow called for package:", pkg);
    console.log("🔐 isAuthenticated (Redux):", isAuthenticated);
    console.log("🔐 userToken (Redux):", userToken);
    
    // Check if package is valid
    if (!pkg) {
      console.error("❌ No package selected");
      return;
    }
    
    setSelectedPackage(pkg);
    
    // Store booking details in localStorage for after login
    const bookingData = {
      touristId: id,
      packageId: pkg.id,
      packageDetails: pkg,
      centreDetails: centre,
      centreId: id,
      centreName: centreName,
      returnUrl: `/booking-summary/${id}/${pkg.id}`
    };
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    console.log("💾 Booking saved to localStorage:", bookingData);

    // ✅ PRIMARY AUTH CHECK: Check localStorage first (more reliable)
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    const isLoggedIn = !!token; // If token exists, user is logged in
    
    console.log("🔐 token from localStorage:", token);
    console.log("🔐 Is logged in (localStorage check)?", isLoggedIn);

    if (!isLoggedIn) {
      console.log("➡️ Not authenticated, redirecting to signin");
      navigate("/signin", { 
        state: { 
          from: `/centre/${id}`,
          bookingData: bookingData
        } 
      });
      return;
    }

    // If authenticated, proceed to booking summary
    console.log("✅ Authenticated, proceeding to booking summary");
    navigate(`/booking-summary/${id}/${pkg.id}`, {
      state: {
        touristId: id,
        packageDetails: pkg,
        centreDetails: centre,
      },
    });
  };

  const renderStars = (ratingValue) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} color="#ff6b35" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" color="#ff6b35" opacity={0.5} />);
    }
    while (stars.length < 5) {
      stars.push(<FaStar key={stars.length} color="#ddd" />);
    }
    return stars;
  };

  // Get truncated description
  const getDescription = () => {
    if (showFullDescription || description.length <= 200) {
      return description;
    }
    return description.slice(0, 200) + "...";
  };

  // Sample reviews (will be replaced with API data)
  const reviews = [
    {
      id: 1,
      name: "Nnaneme D.",
      rating: 5,
      comment: "Absolutely loved the canopy walkway! It was so long and the view from the top is breathtaking. A must-visit for anyone in Lagos. Very well maintained."
    },
    {
      id: 2,
      name: "Tunde S.",
      rating: 4,
      comment: "Perfect for a family outing. My kids enjoyed the canopy walk and the playground area. The boardwalks are clean and safe. Highly recommended!"
    },
    {
      id: 3,
      name: "Salewa Ahmed",
      rating: 4,
      comment: "The place is beautiful and peaceful. Saw so many monkeys and birds. However, the ticket price is a bit high compared to other parks. Still worth it though."
    }
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
              <span><FaClock /> {openingHours}</span>
              <span className="rating">
                {renderStars(rating)}
                <strong>{rating}</strong> ({reviewCount} reviews)
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
                src={images[0] || "https://images.unsplash.com/photo-1506744038136-46273834b3fb"}
                alt={centreName}
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb"; }}
              />
            </div>
            <div className="side-images">
              {images.slice(1, 3).map((img, index) => (
                <img
                  key={index}
                  src={img || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"}
                  alt=""
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"; }}
                />
              ))}
              {images.length < 2 && (
                <>
                  <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" alt="" />
                  <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e" alt="" />
                </>
              )}
            </div>
          </section>

          <hr className="divider" />

          {/* FEATURES */}
          <section className="features">
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <div>
                <h4>Duration</h4>
                <p>1 Day</p>
              </div>
            </div>
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <div>
                <h4>Activity Level</h4>
                <p>Topnotch</p>
              </div>
            </div>
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <div>
                <h4>Includes</h4>
                <p>Ticket, Transportation, Equipment</p>
              </div>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="description-section">
            <div className="description">
              <h2>Description</h2>
              <p>{getDescription()}</p>
              {description.length > 200 && (
                <button 
                  className="readmore-btn"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Read Less" : "Read More"}
                </button>
              )}
              <div className="actions">
                <button 
                  className="book-btn" 
                  onClick={() => {
                    console.log("📖 Main Book Now button clicked");
                    console.log("Packages available:", packages);
                    if (packages && packages.length > 0) {
                      handleBookNow(packages[0]);
                    } else {
                      console.warn("❌ No packages available");
                      Swal.fire({
                        icon: "info",
                        title: "No Packages Available",
                        text: "This centre doesn't have any packages available at the moment. Please check back later.",
                        confirmButtonColor: "#ff6b35",
                        confirmButtonText: "OK"
                      });
                    }
                  }}
                >
                  Book Now
                </button>
                <button className="fav-btn" onClick={() => setIsWishlist(!isWishlist)}>
                  {isWishlist ? "Remove from Favourite" : "Add to Favourite"}
                  {isWishlist ? <FaHeart color="#ff6b35" /> : <FaRegHeart />}
                </button>
              </div>
            </div>
          </section>

          {/* PACKAGES SECTION */}
          {packages && packages.length > 0 ? (
            <section className="packages-section">
              <h2>Available Packages</h2>
              <div className="packages-grid">
                {packages.map((pkg) => (
                  <div key={pkg.id || Math.random()} className="package-card">
                    <h3>{pkg.packageName || "Package"}</h3>
                    <p className="package-type">{pkg.packageType || "Standard"}</p>
                    <p className="package-people">Up to {pkg.numberOfPeople || 1} people</p>
                    <p className="package-price">₦{getPackagePrice(pkg).toLocaleString()}</p>
                    <button 
                      className="book-now-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("📦 Package Book Now clicked for:", pkg.packageName);
                        handleBookNow(pkg);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="packages-section">
              <h2>Available Packages</h2>
              <div className="no-packages-message" style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                <p>No packages available for this centre at the moment.</p>
                <p style={{ fontSize: "14px", marginTop: "10px" }}>Please check back later.</p>
              </div>
            </section>
          )}

          {/* REVIEWS */}
          <section className="reviews">
            <h2>View all Reviews</h2>
            <div className="review-grid">
              {reviews.map((review) => (
                <div className="review-card" key={review.id}>
                  <h4>{review.name}</h4>
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        color={i < review.rating ? "#ff6b35" : "#ddd"} 
                      />
                    ))}
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </section>

          {/* DESTINATIONS YOU MAY ALSO LIKE */}
          <section className="recommendations">
            <h2>Destinations you may also like</h2>
            <div className="destination-grid">
              <div className="destination-card">
                <img src="https://images.unsplash.com/photo-1511497584788-876760111969" alt="" />
                <div className="card-content">
                  <h4>Olumo Rock</h4>
                  <p>Abeokuta</p>
                  <div className="card-footer">
                    <span>From ₦2,000</span>
                    <button>Book Now</button>
                  </div>
                </div>
              </div>
              <div className="destination-card">
                <img src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2" alt="" />
                <div className="card-content">
                  <h4>Mapo Hall</h4>
                  <p>Ibadan</p>
                  <div className="card-footer">
                    <span>From ₦1,500</span>
                    <button>Book Now</button>
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