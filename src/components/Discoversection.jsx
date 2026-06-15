import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegClock } from "react-icons/fa";
import "../components/css/Discoversection.css";

// Static images
import lekki from "/novaxcape/lekki.png";
import olumo from "/novaxcape/olumo.png";
import mapo from "/novaxcape/mapo.png";
import greenLegacy from "/novaxcape/greenLegacy.png";
import yankari from "/novaxcape/yankari.png";
import obudu from "/novaxcape/obudu.png";
import millennium from "/novaxcape/millennium.png";
import nikeGallery from "/novaxcape/nikeGallery.png";
import agodi from "/novaxcape/agodi.png";

const categories = [
  "All",
  "Park & Recreation",
  "Art Gallery",
  "Beach",
  "Nature & Wildlife",
  "Adventure",
  "Museum",
];

// Static fallback data (used when no search is performed)
const staticAttractions = [
  {
    id: 1,
    image: lekki,
    title: "Lekki Conservation Centre",
    location: "Lagos",
    rating: 5.0,
    reviews: 567,
    time: "8:30 AM - 5:00 PM",
    price: "₦2,500",
  },
  {
    id: 2,
    image: olumo,
    title: "Olumo Rock",
    location: "Abeokuta",
    rating: 4.0,
    reviews: 66,
    time: "9:00 AM - 6:00 PM",
    price: "₦2,000",
  },
  {
    id: 3,
    image: mapo,
    title: "Mapo Hall",
    location: "Ibadan",
    rating: 4.9,
    reviews: 70,
    time: "8:30 AM - 5:00 PM",
    price: "₦1,500",
  },
  {
    id: 4,
    image: greenLegacy,
    title: "Green Legacy Resort",
    location: "Ogun State",
    rating: 4.0,
    reviews: 434,
    time: "8:30 AM - 10:00 PM",
    price: "₦1,500",
  },
  {
    id: 5,
    image: yankari,
    title: "Yankari National Park",
    location: "Bauchi",
    rating: 5.0,
    reviews: 70,
    time: "8:30 AM - 7:00 PM",
    price: "₦2,000",
  },
  {
    id: 6,
    image: obudu,
    title: "Obudu Mountain Resort",
    location: "Cross River",
    rating: 5.0,
    reviews: 90,
    time: "10:30 AM - 5:00 PM",
    price: "₦3,000",
  },
  {
    id: 7,
    image: millennium,
    title: "Millennium Park",
    location: "Abuja",
    rating: 5.0,
    reviews: 643,
    time: "8:30 AM - 8:30 PM",
    price: "₦2,500",
  },
  {
    id: 8,
    image: nikeGallery,
    title: "Nike Art Gallery",
    location: "Lagos",
    rating: 3.0,
    reviews: 567,
    time: "8:30 AM - 6:00 PM",
    price: "₦1,500",
  },
  {
    id: 9,
    image: agodi,
    title: "Agodi Garden and Zoo",
    location: "Ibadan",
    rating: 5.0,
    reviews: 567,
    time: "8:00 AM - 5:00 PM",
    price: "₦1,500",
  },
];

const Discoversection = ({
  searchState,
  searchSubmitted,
  touristCentres,
  loading,
  error,
}) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const handleBookNow = (centre) => {
    const centreId = centre.id || centre._id;
    navigate(`/centre/${centreId}`, {
      state: { centre },
    });
  };

  const formatPrice = (price) => {
    if (!price) return "Contact";
    if (typeof price === "number") {
      return `₦${price.toLocaleString()}`;
    }
    return price;
  };

  // Get price from tourist centre data
  const getCentrePrice = (centre) => {
    if (centre.packages && centre.packages.length > 0) {
      const adultPackage = centre.packages.find(pkg => pkg.packageType === 'Adult');
      if (adultPackage) return formatPrice(adultPackage.amount);
      return formatPrice(centre.packages[0].amount);
    }
    return formatPrice(centre.adultPrice || centre.ticketPrice);
  };

  const filterByCategory = (centers) => {
    if (activeCategory === "All") return centers;
    
    return centers.filter((center) => {
      const centreType = (center.centreType || center.type || center.category || "").toLowerCase();
      const category = activeCategory.toLowerCase();
      return centreType.includes(category) || category.includes(centreType);
    });
  };

  // Determine what to display
  const hasActiveSearch = searchSubmitted && searchState;
  const displayCenters = hasActiveSearch && touristCentres?.length > 0 ? touristCentres : staticAttractions;
  const filteredCenters = filterByCategory(displayCenters);

  return (
    <section className="attractions">
      {/* Categories */}
      <div className="category_container">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category_btn ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Results Header */}
      {hasActiveSearch && (
        <div className="search-results-header">
          <h2>
            {loading
              ? `Searching for "${searchState}"...`
              : `Search results for "${searchState}"`}
          </h2>
          {!loading && !error && (
            <p>{filteredCenters.length} centre(s) found</p>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && hasActiveSearch && (
        <div className="error-container">
          <p className="error-text">{typeof error === 'string' ? error : error.message || 'Failed to load centers'}</p>
          <button
            className="try-again-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && hasActiveSearch && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading amazing destinations...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && hasActiveSearch && !error && touristCentres?.length === 0 && (
        <div className="no-results-container">
          <p className="no-results-text">
            No centres found in "{searchState}". Try a different state or check back later.
          </p>
          <button
            className="browse-all-btn"
            onClick={() => window.location.reload()}
          >
            Browse All Centres
          </button>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && !error && (
        <div className="attractions_grid">
          {filteredCenters.map((place) => {
            // Check if this is static data (has title property) or API data
            const isStatic = place.title && !place.centreName;
            
            if (isStatic) {
              // Render static attraction
              return (
                <div className="attraction_card" key={place.id}>
                  <img src={place.image} alt={place.title} />
                  <div className="card_content">
                    <h3>{place.title}</h3>
                    <h4>{place.location}</h4>
                    <div className="card_details">
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} color={i < Math.floor(place.rating) ? "#ff6b35" : "#ddd"} />
                        ))}
                        <span>{place.rating}</span>
                        <small>({place.reviews} reviews)</small>
                      </div>
                      <div className="time">
                        <FaRegClock />
                        <span>{place.time}</span>
                      </div>
                    </div>
                    <div className="bottom_section">
                      <div>
                        <p>From</p>
                        <h2>{place.price}</h2>
                      </div>
                      <button onClick={() => handleBookNow(place)}>Book Now</button>
                    </div>
                  </div>
                </div>
              );
            } else {
              // Render API tourist centre
              const imageSrc = place.images?.[0] || place.image || "/novaxcape/placeholder.jpg";
              const title = place.centreName || place.name || "Tourist Centre";
              const location = [place.city, place.state].filter(Boolean).join(", ") || "Location not specified";
              const rating = place.rating || place.averageRating || 4.0;
              const reviews = place.reviews || place.reviewCount || 0;
              const time = place.openingHours || "Hours not specified";
              const price = getCentrePrice(place);
              
              return (
                <div className="attraction_card" key={place.id || place._id}>
                  <img
                    src={imageSrc}
                    alt={title}
                    onError={(e) => {
                      e.target.src = "/novaxcape/placeholder.jpg";
                    }}
                  />
                  <div className="card_content">
                    <h3>{title}</h3>
                    <h4>{location}</h4>
                    <div className="card_details">
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} color={i < Math.floor(rating) ? "#ff6b35" : "#ddd"} />
                        ))}
                        <span>{rating}</span>
                        <small>({reviews} reviews)</small>
                      </div>
                      <div className="time">
                        <FaRegClock />
                        <span>{time}</span>
                      </div>
                    </div>
                    <div className="bottom_section">
                      <div>
                        <p>From</p>
                        <h2>{price}</h2>
                      </div>
                      <button onClick={() => handleBookNow(place)}>Book Now</button>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </section>
  );
};

export default Discoversection;