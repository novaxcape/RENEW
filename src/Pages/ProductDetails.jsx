import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { getTouristCenterById } from "../redox/apiSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isWishlist, setIsWishlist] = useState(false);

  const { selectedTouristCenter, touristCentresLoading, touristCentresError } =
    useSelector((state) => state.api);
  const { isAuthenticated } = useSelector((state) => state.auth);

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
  console.log("Packages:", packages);

  const getPackagePrice = (pkg) => {
    return pkg.amount || pkg.price || 0;
  };

  const handleBookNow = (pkg) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/centre/${id}` } });
      return;
    }
    navigate(`/booking/${id}/${pkg.id}`, {
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
          </section>

          <hr className="divider" />

          {/* PACKAGES SECTION */}
          {packages.length > 0 && (
            <section className="packages-section">
              <h2>Available Packages</h2>
              <div className="packages-grid">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="package-card">
                    <h3>{pkg.packageName}</h3>
                    <p className="package-type">{pkg.packageType}</p>
                    <p className="package-people">Up to {pkg.numberOfPeople} people</p>
                    <p className="package-price">₦{getPackagePrice(pkg).toLocaleString()}</p>
                    <button className="book-now-btn" onClick={() => handleBookNow(pkg)}>
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DESCRIPTION */}
          <section className="description-section">
            <div className="description">
              <h2>Description</h2>
              <p>{description}</p>
              <div className="actions">
                <button className="book-btn" onClick={() => packages.length > 0 && handleBookNow(packages[0])}>
                  Book Now
                </button>
                <button className="fav-btn" onClick={() => setIsWishlist(!isWishlist)}>
                  {isWishlist ? "Remove from Favourite" : "Add to Favourite"}
                  {isWishlist ? <FaHeart color="#ff6b35" /> : <FaRegHeart />}
                </button>
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