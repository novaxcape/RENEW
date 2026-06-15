import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { id } = useParams(); // Get centre ID from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isWishlist, setIsWishlist] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const { selectedTouristCenter, touristCentresLoading, touristCentresError } =
    useSelector((state) => state.api);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getTouristCenterById(id));
    }
  }, [dispatch, id]);

  // Get centre data from API response
  const centre = selectedTouristCenter?.data || selectedTouristCenter?.tourist || selectedTouristCenter;

  if (touristCentresLoading) {
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

  if (touristCentresError || !centre) {
    return (
      <>
        <Header />
        <div className="error-container">
          <h2>Centre Not Found</h2>
          <p>{touristCentresError || "Unable to load centre details"}</p>
          <button onClick={() => navigate("/discover")} className="back-btn">
            Back to Discover
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Extract centre data
  const centreName = centre.centreName || centre.name || "Tourist Centre";
  const location = [centre.city, centre.state].filter(Boolean).join(", ") || "Location not specified";
  const openingHours = centre.openingHours || "Hours not specified";
  const rating = centre.rating || centre.averageRating || 4.5;
  const reviewCount = centre.reviews || centre.reviewCount || 0;
  const description = centre.description || "No description available";
  const facilities = centre.facilitiesAndAmenities?.split(", ") || centre.facilities || [];
  const images = centre.images || [];
  const packages = centre.packages || [];

  // Get price from packages
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

  const handleWishlistToggle = () => {
    setIsWishlist(!isWishlist);
    // TODO: Add to wishlist API call
  };

  // Render stars based on rating
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
              <span>
                <FaMapMarkerAlt /> {location}
              </span>

              <span>
                <FaClock /> {openingHours}
              </span>

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
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
                }}
              />
            </div>

            <div className="side-images">
              {images.slice(1, 3).map((img, index) => (
                <img
                  key={index}
                  src={img || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"}
                  alt=""
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
                  }}
                />
              ))}
              {images.length < 2 && (
                <>
                  <img
                    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                    alt=""
                  />
                  <img
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
                    alt=""
                  />
                </>
              )}
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
                    <button
                      className="book-now-btn"
                      onClick={() => handleBookNow(pkg)}
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FEATURES */}
          <section className="features">
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <div>
                <h4>Duration</h4>
                <p>Full Day</p>
              </div>
            </div>

            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <div>
                <h4>Activity Level</h4>
                <p>Moderate</p>
              </div>
            </div>

            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <div>
                <h4>Includes</h4>
                <p>Entry Ticket, Guide Access</p>
              </div>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="description-section">
            <div className="description">
              <h2>Description</h2>
              <p>{description}</p>

              <div className="actions">
                <button
                  className="book-btn"
                  onClick={() => {
                    if (packages.length > 0) {
                      handleBookNow(packages[0]);
                    } else {
                      alert("No packages available for this centre");
                    }
                  }}
                >
                  Book Now
                </button>

                <button className="fav-btn" onClick={handleWishlistToggle}>
                  {isWishlist ? "Remove from Favourite" : "Add to Favourite"}
                  {isWishlist ? <FaHeart color="#ff6b35" /> : <FaRegHeart />}
                </button>
              </div>
            </div>

            <div className="map">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b"
                alt="Map location"
              />
              <div className="map-placeholder">
                <p>📍 {location}</p>
                <small>View on Google Maps</small>
              </div>
            </div>
          </section>

          {/* REVIEWS */}
          <section className="reviews">
            <h2>View all Reviews</h2>
            <div className="review-grid">
              {/* Sample reviews - replace with API data */}
              <div className="review-card">
                <h4>Nnaneme D.</h4>
                <div className="review-stars">{renderStars(5)}</div>
                <p>Absolutely loved the experience! The place was amazing and well maintained.</p>
              </div>

              <div className="review-card">
                <h4>Tunde S.</h4>
                <div className="review-stars">{renderStars(4)}</div>
                <p>Perfect destination for a family outing. Safe, clean and highly recommended.</p>
              </div>

              <div className="review-card">
                <h4>Salewa Ahmed</h4>
                <div className="review-stars">{renderStars(5)}</div>
                <p>Beautiful and peaceful. Saw several birds and monkeys during the visit.</p>
              </div>
            </div>
          </section>

          {/* DESTINATIONS YOU MAY ALSO LIKE */}
          <section className="recommendations">
            <h2>Destinations you may also like</h2>
            <div className="destination-grid">
              {/* This will be populated with related centres */}
              <div className="destination-card">
                <img
                  src="https://images.unsplash.com/photo-1511497584788-876760111969"
                  alt=""
                />
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
                <img
                  src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2"
                  alt=""
                />
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