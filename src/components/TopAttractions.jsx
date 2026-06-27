// File: src/components/TopAttractions.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { IoIosTrendingUp } from "react-icons/io";
import { FiTrendingUp } from "react-icons/fi";
import { getTouristCentersByState } from "../redox/apiSlice";
import "../components/css/TopAttractions.css";

// ── Fallback static data (used when API returns nothing or not enough) ──
const FALLBACK_CENTRES = [
  {
    id: "static-1",
    centreName: "Lekki Conservation Centre",
    city: "Lagos",
    imagesPublicUrl: ["/novaxcape/lekki.png"],
    trending: true,
    rating: 5.0,
    reviews: 567,
  },
  {
    id: "static-2",
    centreName: "Yankari National Park",
    city: "Bauchi",
    imagesPublicUrl: ["/novaxcape/yankari.png"],
    trending: true,
    rating: 4.0,
    reviews: 213,
  },
  {
    id: "static-3",
    centreName: "Olumo Rock",
    city: "Abeokuta",
    imagesPublicUrl: ["/novaxcape/olumo.png"],
    trending: false,
    rating: 5.0,
    reviews: 400,
  },
  {
    id: "static-4",
    centreName: "Obudu Mountain Resort",
    city: "Cross River",
    imagesPublicUrl: ["/novaxcape/obudu.png"],
    trending: true,
    rating: 4.5,
    reviews: 200,
  },
  {
    id: "static-5",
    centreName: "Green Legacy Resort",
    city: "Abeokuta",
    imagesPublicUrl: ["/novaxcape/greenLegacy.png"],
    trending: false,
    rating: 4.0,
    reviews: 122,
  },
  {
    id: "static-6",
    centreName: "Omu Resort",
    city: "Lagos",
    imagesPublicUrl: ["/novaxcape/omu.png"],
    trending: true,
    rating: 5.0,
    reviews: 567,
  },
];

// Hardcoded ratings/trending cycled by index for API results
const STATIC_RATINGS = [
  { rating: 5.0, reviews: 567, trending: true },
  { rating: 4.0, reviews: 213, trending: true },
  { rating: 5.0, reviews: 400, trending: false },
  { rating: 4.5, reviews: 200, trending: true },
  { rating: 4.0, reviews: 122, trending: false },
  { rating: 5.0, reviews: 567, trending: true },
];

const STATES_TO_FETCH = ["Lagos", "Bauchi", "Ogun", "Cross River"];

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <>
      {Array.from({ length: fullStars }).map((_, i) => (
        <FaStar key={`full-${i}`} className="star star--full" />
      ))}
      {hasHalf && <FaStarHalfAlt className="star star--half" />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="star star--empty" />
      ))}
    </>
  );
};

export default function TopAttractions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { touristCentres, touristCentresLoading } = useSelector(
    (state) => state.api
  );

  // State to store combined centres from all states
  const [allCentres, setAllCentres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch centres for each state
    STATES_TO_FETCH.forEach((state) => {
      dispatch(getTouristCentersByState(state));
    });
  }, [dispatch]);

  // Combine all centres from different states when they load
  useEffect(() => {
    if (!touristCentresLoading) {
      let finalCentres = [];
      
      if (touristCentres.length > 0) {
        // Get unique centres by ID to avoid duplicates
        const uniqueCentres = [];
        const seenIds = new Set();
        
        touristCentres.forEach(centre => {
          const id = centre.id || centre._id;
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            uniqueCentres.push(centre);
          }
        });
        
        // Take up to 6 centres from API
        const apiCentres = uniqueCentres.slice(0, 6);
        
        // If we have less than 6, pad with fallback data
        if (apiCentres.length < 6) {
          const needed = 6 - apiCentres.length;
          const fallbackToUse = FALLBACK_CENTRES.slice(0, needed);
          finalCentres = [...apiCentres, ...fallbackToUse];
        } else {
          finalCentres = apiCentres;
        }
      } else {
        // No API data, use all fallback
        finalCentres = FALLBACK_CENTRES;
      }
      
      setAllCentres(finalCentres);
      setIsLoading(false);
    }
  }, [touristCentres, touristCentresLoading]);

  const handleCardClick = (centre) => {
    navigate(`/centre/${centre.id || centre._id}`, { state: { centre } });
  };

  // Show loading skeleton
  if (isLoading || touristCentresLoading) {
    return (
      <section className="top-attractions">
        <div className="section-header">
          <div className="header-title-row">
            <IoIosTrendingUp className="header-arrow" />
            <h2 className="header-title">Top Attractions</h2>
          </div>
        </div>
        <p className="header-subtitle">
          Most visited and highly rated tourism centres this month
        </p>
        <div className="attractions-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="attraction-card attraction-card--skeleton">
              <div className="card-image-wrapper skeleton-img" />
              <div className="card-info">
                <div className="skeleton-line skeleton-line--name" />
                <div className="skeleton-line skeleton-line--city" />
                <div className="skeleton-line skeleton-line--rating" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="top-attractions">
      <div className="section-header">
        <div className="header-title-row">
          <IoIosTrendingUp className="header-arrow" />
          <h2 className="header-title">Top Attractions</h2>
        </div>
      </div>
      <p className="header-subtitle">
        Most visited and highly rated tourism centres this month
      </p>

      {/* Cards — API + Fallback (always shows 6) */}
      <div className="attractions-grid">
        {allCentres.map((centre, index) => {
          // Determine if this is a fallback centre
          const isFallback = centre.id?.startsWith("static-");
          
          // Get rating and review data
          let rating, reviews, trending;
          
          if (isFallback) {
            // Use data from fallback object
            rating = centre.rating;
            reviews = centre.reviews;
            trending = centre.trending;
          } else {
            // Use static ratings cycled by index for API data
            const staticData = STATIC_RATINGS[index % STATIC_RATINGS.length];
            rating = centre.rating || centre.averageRating || staticData.rating;
            reviews = centre.reviews || centre.reviewCount || staticData.reviews;
            trending = centre.trending !== undefined ? centre.trending : staticData.trending;
          }

          // Get image URL
          const imageUrl =
            centre.imagesPublicUrl?.[0] ||
            centre.images?.[0]?.secureUrl ||
            centre.image ||
            "/novaxcape/placeholder.png";

          return (
            <div
              key={centre.id || centre._id || index}
              className="attraction-card"
              onClick={() => handleCardClick(centre)}
            >
              <div className="card-image-wrapper">
                <img
                  src={imageUrl}
                  alt={centre.centreName || centre.name || "Attraction"}
                  className="card-image"
                  onError={(e) => {
                    e.target.src = "/novaxcape/placeholder.png";
                  }}
                />
                {trending && (
                  <span className="trending-badge">
                    <FiTrendingUp className="badge-icon" /> Trending
                  </span>
                )}
              </div>
              <div className="card-info">
                <p className="card-name">{centre.centreName || centre.name}</p>
                <p className="card-city">{centre.city || centre.state || "Location"}</p>
                <div className="card-rating">
                  <StarRating rating={rating} />
                  <span className="rating-number">{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
                  <span className="review-count">({reviews || 0})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
