import React, { useState, useEffect } from "react";
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

const Discoversection = () => {
  const navigate = useNavigate();
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchState, setSearchState] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [touristCentres, setTouristCentres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get search params from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get("state");
    
    if (stateParam) {
      setSearchState(stateParam);
      setSearchSubmitted(true);
    }
  }, []);

  const handleBookNow = (centre) => {
    navigate(`/centre/${centre.id || centre._id}`, {
      state: { centre }
    });
  };

  const formatPrice = (price) => {
    if (!price) return "Contact";
    if (typeof price === "number") {
      return `₦${price.toLocaleString()}`;
    }
    return price;
  };

  const filterByCategory = (centers) => {
    if (activeCategory === "All") return centers;
    
    return centers.filter((center) => {
      const centreType = (center.centreType || center.type || "").toLowerCase();
      const category = activeCategory.toLowerCase();
      
      return centreType.includes(category) || category.includes(centreType);
    });
  };

  const renderPlace = (place, isStatic = false) => {
    const imageSrc = isStatic 
      ? place.image 
      : place.images?.[0] || place.image || "/novaxcape/placeholder.jpg";
    
    const title = isStatic 
      ? place.title 
      : place.centreName || place.name || "Tourist Centre";
    
    const location = isStatic
      ? place.location
      : [place.city, place.state].filter(Boolean).join(", ") || "Location not specified";
    
    const rating = isStatic
      ? place.rating
      : place.rating || place.averageRating || 4.0;
    
    const reviews = isStatic
      ? place.reviews
      : place.reviews || place.reviewCount || 0;
    
    const time = isStatic
      ? place.time
      : place.openingHours || "Hours not specified";
    
    const price = isStatic
      ? place.price
      : formatPrice(place.adultPrice || place.ticketPrice || place.price);

    return (
      <div className="attraction_card" key={isStatic ? place.id : place.id || place._id}>
        <img src={imageSrc} alt={title} onError={(e) => {
          e.target.src = "/novaxcape/placeholder.jpg";
        }} />

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

            <button onClick={() => handleBookNow(place)}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const displayCenters = searchSubmitted ? touristCentres : staticAttractions;
  const filteredCenters = filterByCategory(displayCenters);
  const hasActiveSearch = searchSubmitted && searchState;

  return (
    <section className="attractions">
      {/* Categories */}
      <div className="category_container">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category_btn ${
              activeCategory === category ? "active" : ""
            }`}
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
      {error && (
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button 
            className="try-again-btn"
            onClick={() => {
              setSearchSubmitted(false);
              setError(null);
            }}
          >
            Browse All Centres
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading amazing destinations...</p>
        </div>
      )}

      {/* No Results */}
      {!loading && hasActiveSearch && !error && filteredCenters.length === 0 && (
        <div className="no-results-container">
          <p className="no-results-text">
            No centres found in "{searchState}". Try a different state or check back later.
          </p>
          <button 
            className="browse-all-btn"
            onClick={() => {
              setSearchSubmitted(false);
              setSearchState("");
            }}
          >
            Browse All Centres
          </button>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && !error && (
        <div className="attractions_grid">
          {filteredCenters.map((place) => 
            renderPlace(place, !searchSubmitted)
          )}
        </div>
      )}
    </section>
  );
};

export default Discoversection;