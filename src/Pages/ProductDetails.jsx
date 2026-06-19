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
import { getTouristCenterById, getAllPackages, getPackageById } from "../redox/apiSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isWishlist, setIsWishlist] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [centrePackages, setCentrePackages] = useState([]);

  const { selectedTouristCenter, touristCentresLoading, touristCentresError, packages, packagesLoading } =
    useSelector((state) => state.api);
  const { isAuthenticated, userToken, loggedInUser } = useSelector((state) => state.auth);
  console.log(selectedTouristCenter)

  // ✅ Get centre data from multiple sources
  const getCentreData = () => {
    // 1. Check location state
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
      return selectedTouristCenter?.data || 
             selectedTouristCenter?.tourist || 
             selectedTouristCenter;
    }

    // 3. Check localStorage
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

    return null;
  };

  const centre = getCentreData();

  // ✅ Fetch centre and packages
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch centre if not available
      if (!centre && id) {
        console.log("🔄 Fetching centre from API with ID:", id);
        await dispatch(getTouristCenterById(id));
        console.log(getTouristCenterById(id))
      }

      // Fetch all packages
      console.log("🔄 Fetching all packages");
      await dispatch(getAllPackages());
      
      setIsLoading(false);
    };

    fetchData();
  }, [dispatch, id, centre]);

  // ✅ Filter packages for this centre
  useEffect(() => {
    if (packages && packages.length > 0 && centre) {
      const centreId = centre.id || centre._id || id;
      
      // Try different ways to match packages to this centre
      const filtered = packages.filter(pkg => {
        // Check if package belongs to this centre
        const pkgCentreId = pkg.touristId || pkg.centreId || pkg.tourist?._id || pkg.tourist?.id;
        return pkgCentreId === centreId || pkgCentreId === centre._id || pkgCentreId === centre.id;
      });
      
      console.log(`📦 Found ${filtered.length} packages for centre ${centreId}`);
      setCentrePackages(filtered);
    }
  }, [packages, centre, id]);

  // ✅ Handle loading state
  if (touristCentresLoading || packagesLoading || isLoading) {
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

  // ✅ Extract centre data
  const centreName = centre.centreName || centre.name || "Tourist Centre";
  const centreLocation = [centre.city, centre.state].filter(Boolean).join(", ") || "Location not specified";
  const openingHours = centre.openingHours || "Hours not specified";
  const rating = centre.rating || centre.averageRating || 4.5;
  const reviewCount = centre.reviews || centre.reviewCount || 0;
  const description = centre.description || "No description available";
  const facilities = centre.facilitiesAndAmenities?.split(", ") || centre.facilities || [];
  const images = centre.images || [];

  console.log("✅ Rendering centre:", centreName);
  console.log("✅ Available packages:", centrePackages.length);

  // ✅ Handle Book Now
  const handleBookNow = (pkg) => {
    console.log("🛒 handleBookNow called with packages:", pkg);
    
    if (!pkg) {
      Swal.fire({
        icon: "warning",
        title: "No Package Selected",
        text: "Please select a package to book.",
        confirmButtonColor: "#ff6b35",
      });
      return;
    }

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

    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    const isLoggedIn = !!token;

    if (!isLoggedIn) {
      navigate("/signin", { 
        state: { 
          from: `/centre/${centreId}`,
          bookingData: bookingData
        } 
      });
      return;
    }

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
      comment: "Absolutely loved the canopy walkway! It was so long and the view from the top is breathtaking."
    },
    {
      id: 2,
      name: "Tunde S.",
      rating: 4,
      comment: "Perfect for a family outing. My kids enjoyed the canopy walk and the playground area."
    },
    {
      id: 3,
      name: "Salewa Ahmed",
      rating: 4,
      comment: "The place is beautiful and peaceful. Saw so many monkeys and birds."
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
                    if (centrePackages.length === 0) {
                      Swal.fire({
                        icon: "info",
                        title: "No Packages Available",
                        text: "This centre doesn't have any packages available at the moment.",
                        confirmButtonColor: "#ff6b35",
                      });
                      return;
                    }
                    handleBookNow(centrePackages[0]);
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

          {/* ✅ PACKAGES SECTION - NOW DISPLAYS ACTUAL PACKAGES */}
          {centrePackages.length > 0 && (
            <section className="packages-section">
              <h2>Available Packages</h2>
              <div className="packages-grid">
                {centrePackages.map((pkg) => (
                  <div className="package-card" key={pkg.id}>
                    <h3>{pkg.packageName || pkg.name || "Package"}</h3>
                    <p className="package-price">₦{pkg.amount || pkg.price || 0}</p>
                    <p className="package-desc">{pkg.description || "No description"}</p>
                    <p className="package-type">{pkg.packageType || "Standard"}</p>
                    <button 
                      className="book-package-btn"
                      onClick={() => handleBookNow(pkg)}
                    >
                      Book This Package
                    </button>
                  </div>
                ))}
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

          {/* RECOMMENDATIONS */}
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