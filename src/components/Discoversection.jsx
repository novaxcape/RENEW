import React, { useState, useCallback, useMemo, memo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegClock } from "react-icons/fa";
import "./css/Discoversection.css";

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

// Static fallback data
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

// ✅ Helper function to get image URL with better debugging
const getImageUrl = (place) => {
  console.log("🔍 Getting image for place:", place?.centreName || place?.title);
  
  // ✅ Check if place has imagesPublicUrl (array)
  if (place.imagesPublicUrl && Array.isArray(place.imagesPublicUrl) && place.imagesPublicUrl.length > 0) {
    const url = place.imagesPublicUrl[0];
    console.log("✅ Found imagesPublicUrl[0]:", url);
    return url;
  }
  
  // ✅ Check if place has images (array) with objects containing publicUrl
  if (place.images && Array.isArray(place.images) && place.images.length > 0) {
    if (place.images[0]?.publicUrl) {
      console.log("✅ Found images[0].publicUrl:", place.images[0].publicUrl);
      return place.images[0].publicUrl;
    }
    if (typeof place.images[0] === 'string') {
      console.log("✅ Found images[0] (string):", place.images[0]);
      return place.images[0];
    }
  }
  
  // ✅ Check for single imagePublicUrl field
  if (place.imagePublicUrl) {
    console.log("✅ Found imagePublicUrl:", place.imagePublicUrl);
    return place.imagePublicUrl;
  }
  
  // ✅ Check for single image field
  if (place.image) {
    console.log("✅ Found image:", place.image);
    return place.image;
  }
  
  // ✅ Check for coverImage
  if (place.coverImage) {
    console.log("✅ Found coverImage:", place.coverImage);
    return place.coverImage;
  }
  
  // ✅ Check for photo or photos
  if (place.photo) {
    console.log("✅ Found photo:", place.photo);
    return place.photo;
  }
  
  if (place.photos && Array.isArray(place.photos) && place.photos.length > 0) {
    console.log("✅ Found photos[0]:", place.photos[0]);
    return place.photos[0];
  }
  
  console.log("❌ No image found, using placeholder");
  return "/novaxcape/placeholder.jpg";
};

// ✅ Image component with caching and stable rendering
const CachedImage = memo(({ src, alt, className, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // ✅ Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = useCallback(() => {
    console.log("✅ Image loaded:", currentSrc);
    setIsLoaded(true);
  }, [currentSrc]);

  const handleError = useCallback((e) => {
    console.log("❌ Image failed to load:", currentSrc);
    setHasError(true);
    if (onError) onError(e);
  }, [currentSrc, onError]);

  // ✅ If there's an error or no src, show placeholder
  const displaySrc = hasError ? '/novaxcape/placeholder.jpg' : currentSrc;

  return (
    <div className="image-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
      {!isLoaded && !hasError && (
        <div className="image-placeholder" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="image-loader" style={{
            width: '30px',
            height: '30px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #ff6b35',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      )}
      <img
        src={displaySrc}
        alt={alt || "Attraction"}
        className={className}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: (isLoaded || hasError) ? 'block' : 'none',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
});

CachedImage.displayName = 'CachedImage';

// ✅ Create a memoized card component
const AttractionCard = memo(({ 
  place, 
  isStatic, 
  onViewDetails, 
  onBookNow,
  getPrice 
}) => {
  // ✅ Memoize all computed values
  const imageSrc = useMemo(() => {
    if (isStatic) {
      return place.image;
    }
    return getImageUrl(place);
  }, [place, isStatic]);

  // ✅ Log the image source for debugging
  useEffect(() => {
    if (!isStatic) {
      console.log(`📸 Image for ${place.centreName || place.name}:`, imageSrc);
    }
  }, [imageSrc, place, isStatic]);

  const title = useMemo(() => {
    return isStatic ? place.title : (place.centreName || place.name || "Tourist Centre");
  }, [place, isStatic]);

  const location = useMemo(() => {
    return isStatic ? place.location : ([place.city, place.state].filter(Boolean).join(", ") || "Location not specified");
  }, [place, isStatic]);

  const rating = useMemo(() => {
    return isStatic ? place.rating : (place.rating || place.averageRating || 4.0);
  }, [place, isStatic]);

  const reviews = useMemo(() => {
    return isStatic ? place.reviews : (place.reviews || place.reviewCount || 0);
  }, [place, isStatic]);

  const time = useMemo(() => {
    return isStatic ? place.time : (place.openingHours || "Hours not specified");
  }, [place, isStatic]);

  const price = useMemo(() => {
    if (isStatic) {
      return place.price;
    }
    return getPrice(place);
  }, [place, isStatic, getPrice]);

  const handleCardClick = useCallback(() => {
    onViewDetails(place);
  }, [onViewDetails, place]);

  const handleBookClick = useCallback((e) => {
    onBookNow(e, place);
  }, [onBookNow, place]);

  return (
    <div
      className="card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <CachedImage 
        src={imageSrc} 
        alt={title} 
        className="card-image"
      />
      <div className="card-content">
        <h3>{title}</h3>
        <p>{location}</p>
        <div className="info-row">
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={i < Math.floor(rating) ? "#ff6b35" : "#ddd"}
              />
            ))}
            <span>{rating}</span>
            <small>({reviews} reviews)</small>
          </div>
          <div className="time">
            <FaRegClock />
            <span>{time}</span>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <div>
          <p>From</p>
          <h2>{price}</h2>
        </div>
        <button
          className="book-btn"
          onClick={handleBookClick}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.place?.id === nextProps.place?.id &&
    prevProps.place?._id === nextProps.place?._id &&
    prevProps.isStatic === nextProps.isStatic
  );
});

AttractionCard.displayName = 'AttractionCard';

const Discoversection = ({
  searchState = "",
  searchSubmitted = false,
  touristCentres = [],
  loading = false,
  error = null,
  onClearSearch,
}) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  
  const getValidCentres = useCallback((centres) => {
    if (!centres || !Array.isArray(centres)) return [];
    return centres.filter((centre) => {
      if (!centre) return false;
      const hasKeys = Object.keys(centre).length > 0;
      const hasData =
        centre.centreName ||
        centre.name ||
        centre.title ||
        centre.id ||
        centre._id ||
        centre.centreId ||
        centre.city ||
        centre.state ||
        centre.location;
      return hasKeys && hasData;
    });
  }, []);

  const validTouristCentres = useMemo(() => {
    return getValidCentres(touristCentres);
  }, [touristCentres, getValidCentres]);

  const hasValidCentres = validTouristCentres.length > 0;

  const handleViewDetails = useCallback((centre) => {
    const centreId = centre.id || centre._id || centre.centreId;
    if (!centreId) return;
    navigate(`/centre/${centreId}`, {
      state: { centre },
    });
  }, [navigate]);

  const handleBookNow = useCallback((e, centre) => {
    e.stopPropagation();
    const centreId = centre.id || centre._id || centre.centreId;
    if (!centreId) return;
    localStorage.setItem("centreId", centreId);
    navigate(`/centre/${centreId}`, {
      state: { centre },
    });
  }, [navigate]);

  const formatPrice = useCallback((price) => {
    if (!price) return "Contact";
    if (typeof price === "number") {
      return `₦${price.toLocaleString()}`;
    }
    return price;
  }, []);

  const getCentrePrice = useCallback((centre) => {
    if (centre.packages && centre.packages.length > 0) {
      const adultPackage = centre.packages.find(
        (pkg) => pkg.packageType === "Adult",
      );
      if (adultPackage) return formatPrice(adultPackage.amount);
      return formatPrice(centre.packages[0].amount);
    }
    return formatPrice(centre.adultPrice || centre.ticketPrice);
  }, [formatPrice]);

  const displayCenters = useMemo(() => {
    const hasActiveSearch = searchSubmitted && searchState;
    if (hasActiveSearch) {
      return hasValidCentres ? validTouristCentres : [];
    }
    return staticAttractions;
  }, [searchSubmitted, searchState, hasValidCentres, validTouristCentres]);

  const filteredCenters = useMemo(() => {
    if (activeCategory === "All") return displayCenters;
    return displayCenters.filter((center) => {
      const centreType = (
        center.centreType ||
        center.type ||
        center.category ||
        ""
      ).toLowerCase();
      const category = activeCategory.toLowerCase();
      return centreType.includes(category) || category.includes(centreType);
    });
  }, [activeCategory, displayCenters]);

  const hasActiveSearch = searchSubmitted && searchState;

  const handleCategoryClick = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const cardProps = useMemo(() => ({
    onViewDetails: handleViewDetails,
    onBookNow: handleBookNow,
    getPrice: getCentrePrice,
  }), [handleViewDetails, handleBookNow, getCentrePrice]);

  // ✅ Log the data for debugging
  useEffect(() => {
    if (touristCentres && touristCentres.length > 0) {
      console.log("📊 Tourist centres data:", touristCentres);
      console.log("📊 First centre images:", touristCentres[0]?.imagesPublicUrl);
    }
  }, [touristCentres]);

  if (loading && hasActiveSearch) {
    return (
      <section className="discover">
        <div className="category-container">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading amazing destinations...</p>
        </div>
      </section>
    );
  }

  if (error && hasActiveSearch) {
    return (
      <section className="discover">
        <div className="category-container">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="error-container">
          <p className="error-text">
            {typeof error === "string"
              ? error
              : error.message || "Failed to load centers"}
          </p>
          <button
            className="try-again-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="discover">
      <div className="category-container">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? "active" : ""}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {hasActiveSearch && (
        <div className="search-results-header">
          <h2>Search results for "{searchState}"</h2>
          {!loading && !error && (
            <p>{filteredCenters.length} centre(s) found</p>
          )}
        </div>
      )}

      {!loading && hasActiveSearch && !error && !hasValidCentres && (
        <div className="no-results-container">
          <p className="no-results-text">
            No centres found in "{searchState}". Try a different state or check
            back later.
          </p>
          <button className="browse-all-btn" onClick={onClearSearch}>
            Browse All Centres
          </button>
        </div>
      )}

      {!loading && !error && filteredCenters.length > 0 && (
        <div className="card-grid">
          {filteredCenters.map((place, index) => {
            const isStatic = place.title && !place.centreName;
            const key = place.id || place._id || `card-${index}`;
            
            return (
              <AttractionCard
                key={key}
                place={place}
                isStatic={isStatic}
                {...cardProps}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default memo(Discoversection);