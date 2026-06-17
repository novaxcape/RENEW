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
  const [isLoading, setIsLoading] = useState(true);

  const { selectedTouristCenter, touristCentresLoading, touristCentresError } =
    useSelector((state) => state.api);
  const { isAuthenticated, userToken, loggedInUser } = useSelector((state) => state.auth);

  // ✅ Debug logging
  console.log("🔍 ProductDetails - URL Params:", { id });
  console.log("🔍 ProductDetails - Location State:", location.state);
  console.log("🔍 ProductDetails - Selected Centre from API:", selectedTouristCenter);

  // ✅ Validate centre data
  const validateCentre = (data) => {
    if (!data) return false;
    // Check if it has required fields
    const hasName = data.centreName || data.name;
    const hasId = data.id || data._id;
    return !!(hasName && hasId);
  };

  // ✅ Get centre data from multiple sources
  const getCentreData = () => {
    // 1. Check location state first (passed from previous page)
    if (location.state?.centre) {
      console.log("✅ Using centre from location.state");
      return location.state.centre;
    }
    if (location.state?.centreDetails) {
      console.log("✅ Using centreDetails from location.state");
      return location.state.centreDetails;
    }

    // 2. Check Redux store
    if (selectedTouristCenter) {
      console.log("✅ Using centre from Redux store");
      // Handle different response formats
      return selectedTouristCenter?.data || 
             selectedTouristCenter?.tourist || 
             selectedTouristCenter;
    }

    // 3. Check localStorage for pending booking
    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking) {
      try {
        const parsed = JSON.parse(pendingBooking);
        if (parsed.centreDetails) {
          console.log("✅ Using centre from localStorage");
          return parsed.centreDetails;
        }
      } catch (e) {
        console.error("Error parsing pending booking:", e);
      }
    }

    console.log("❌ No centre data found");
    return null;
  };

  // ✅ Get packages from centre data
  const getPackages = (centre) => {
    if (!centre) return [];
    // Check different possible locations for packages
    return centre.packages || centre.Packages || centre.package || [];
  };

  // ✅ Centre data source
  const centre = getCentreData();
  const packages = getPackages(centre);

  console.log("📦 Packages found:", packages.length);
  console.log("📦 Packages data:", packages);

  // ✅ Fetch centre if not available
  useEffect(() => {
    if (!centre && id) {
      console.log("🔄 Fetching centre from API with ID:", id);
      dispatch(getTouristCenterById(id));
    }
    setIsLoading(false);
  }, [dispatch, id, centre]);

  // ✅ Handle loading state
  if (touristCentresLoading || isLoading) {
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

  // ✅ Handle error state
  if (touristCentresError && !centre) {
    return (
      <>
        <Header />
        <div className="error-container" style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2>Centre Not Found</h2>
          <p>{typeof touristCentresError === "string" ? touristCentresError : "Unable to load centre details"}</p>
          <button 
            onClick={() => navigate("/discover")} 
            className="back-btn" 
            style={{ 
              background: "#ff6b35", 
              color: "white", 
              border: "none", 
              padding: "10px 24px", 
              borderRadius: "8px", 
              cursor: "pointer",
              marginTop: "16px"
            }}
          >
            Back to Discover
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // ✅ Validate centre exists
  if (!centre) {
    return (
      <>
        <Header />
        <div className="error-container" style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2>No Centre Data</h2>
          <p>Unable to load centre information. Please try again.</p>
          <button 
            onClick={() => navigate("/discover")} 
            className="back-btn" 
            style={{ 
              background: "#ff6b35", 
              color: "white", 
              border: "none", 
              padding: "10px 24px", 
              borderRadius: "8px", 
              cursor: "pointer",
              marginTop: "16px"
            }}
          >
            Back to Discover
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // ✅ Extract centre data with validation
  const centreName = centre.centreName || centre.name || "Tourist Centre";
  const centreLocation = [centre.city, centre.state].filter(Boolean).join(", ") || "Location not specified";
  const openingHours = centre.openingHours || "Hours not specified";
  const rating = centre.rating || centre.averageRating || 4.5;
  const reviewCount = centre.reviews || centre.reviewCount || 0;
  const description = centre.description || "No description available";
  const facilities = centre.facilitiesAndAmenities?.split(", ") || centre.facilities || [];
  const images = centre.images || [];

  console.log("✅ Rendering centre:", centreName);
  console.log("✅ Available packages:", packages.length);

  const getPackagePrice = (pkg) => {
    return pkg.amount || pkg.price || 0;
  };

  // ✅ UPDATED: Handle Book Now with proper validation
  const handleBookNow = (pkg) => {
    console.log("🛒 handleBookNow called with package:", pkg);
    
    // ✅ Validate package
    if (!pkg) {
      console.error("❌ No package selected");
      Swal.fire({
        icon: "warning",
        title: "No Package Selected",
        text: "Please select a package to book.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    // ✅ Validate package has ID
    if (!pkg.id) {
      console.error("❌ Package missing ID:", pkg);
      Swal.fire({
        icon: "error",
        title: "Invalid Package",
        text: "The selected package is invalid. Please try again.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

    // ✅ Validate centre has ID
    const centreId = centre.id || centre._id || id;
    if (!centreId) {
      console.error("❌ Centre missing ID:", centre);
      Swal.fire({
        icon: "error",
        title: "Invalid Centre",
        text: "Unable to identify the centre. Please try again.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }
    
    setSelectedPackage(pkg);
    
    // ✅ Store booking details in localStorage
    const bookingData = {
      touristId: centreId,
      packageId: pkg.id,
      packageDetails: {
        id: pkg.id,
        packageName: pkg.packageName || pkg.name || "Package",
        amount: getPackagePrice(pkg),
        price: getPackagePrice(pkg),
        packageType: pkg.packageType || "Standard",
        numberOfPeople: pkg.numberOfPeople || 1,
        description: pkg.description || "",
      },
      centreDetails: {
        id: centreId,
        centreName: centreName,
        name: centreName,
        city: centre.city || "",
        state: centre.state || "",
        openingHours: openingHours,
        description: description,
        images: images,
      },
      centreId: centreId,
      centreName: centreName,
      returnUrl: `/booking-summary/${centreId}/${pkg.id}`
    };
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    console.log("💾 Booking saved to localStorage:", bookingData);

    // ✅ Check authentication
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    const isLoggedIn = !!token;
    
    console.log("🔐 Is logged in?", isLoggedIn);

    if (!isLoggedIn) {
      console.log("➡️ Not authenticated, redirecting to signin");
      navigate("/signin", { 
        state: { 
          from: `/centre/${centreId}`,
          bookingData: bookingData
        } 
      });
      return;
    }

    // ✅ If authenticated, navigate to booking summary
    console.log("✅ Authenticated, proceeding to booking summary");
    navigate(`/booking-summary/${centreId}/${pkg.id}`, {
      state: {
        touristId: centreId,
        packageId: pkg.id,
        packageDetails: bookingData.packageDetails,
        centreDetails: bookingData.centreDetails,
        centreId: centreId,
        centreName: centreName,
      },
    });
  };

  // ✅ Render stars
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

  // ✅ Get truncated description
  const getDescription = () => {
    if (showFullDescription || description.length <= 200) {
      return description;
    }
    return description.slice(0, 200) + "...";
  };

  // Sample reviews
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
                    console.log("📦 Available packages:", packages);
                    
                    // ✅ Validate packages exist
                    if (!packages || packages.length === 0) {
                      console.warn("❌ No packages available");
                      Swal.fire({
                        icon: "info",
                        title: "No Packages Available",
                        text: "This centre doesn't have any packages available at the moment. Please check back later.",
                        confirmButtonColor: "#ff6b35",
                        confirmButtonText: "OK"
                      });
                      return;
                    }
                    
                    // ✅ Validate first package
                    const firstPackage = packages[0];
                    if (!firstPackage.id) {
                      console.error("❌ First package missing ID:", firstPackage);
                      Swal.fire({
                        icon: "error",
                        title: "Invalid Package",
                        text: "The package data is invalid. Please try again later.",
                        confirmButtonColor: "#ff6b35",
                      });
                      return;
                    }
                    
                    handleBookNow(firstPackage);
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

          {/* ✅ REMOVED PACKAGES SECTION */}

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