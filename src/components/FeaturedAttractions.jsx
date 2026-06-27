// File: src/components/FeaturedAttractions.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../components/css/FeaturedAttractions.css";
import { FaStar, FaRegClock } from "react-icons/fa";
import { getTouristCentersByState } from "../redox/apiSlice";

import lekki from "/novaxcape/lekki.png";
import olumo from "/novaxcape/olumo.png";
import mapo from "/novaxcape/mapo.png";
import greenLegacy from "/novaxcape/greenLegacy.png";
import yankari from "/novaxcape/yankari.png";
import obudu from "/novaxcape/obudu.png";
import millennium from "/novaxcape/millennium.png";
import nikeGallery from "/novaxcape/nikeGallery.png";
import agodi from "/novaxcape/agodi.png";

// ── Fallback static data ──
const FALLBACK_ATTRACTIONS = [
  {
    id: "1",
    image: lekki,
    centreName: "Lekki Conservation Centre",
    city: "Lagos",
    rating: 5.0,
    reviews: 567,
    openingHours: "8:30 AM - 5:00 PM",
    price: 2500,
  },
  {
    id: "2",
    image: olumo,
    centreName: "Olumo Rock",
    city: "Abeokuta",
    rating: 4.0,
    reviews: 66,
    openingHours: "9:00 AM - 6:00 PM",
    price: 2000,
  },
  {
    id: "3",
    image: mapo,
    centreName: "Mapo Hall",
    city: "Ibadan",
    rating: 4.9,
    reviews: 70,
    openingHours: "8:30 AM - 5:00 PM",
    price: 1500,
  },
  {
    id: "4",
    image: greenLegacy,
    centreName: "Green Legacy Resort",
    city: "Ogun State",
    rating: 4.0,
    reviews: 434,
    openingHours: "8:30 AM - 10:00 PM",
    price: 1500,
  },
  {
    id: "5",
    image: yankari,
    centreName: "Yankari National Park",
    city: "Bauchi",
    rating: 5.0,
    reviews: 70,
    openingHours: "8:30 AM - 7:00 PM",
    price: 2000,
  },
  {
    id: "6",
    image: obudu,
    centreName: "Obudu Mountain Resort",
    city: "Cross River",
    rating: 5.0,
    reviews: 90,
    openingHours: "10:30 AM - 5:00 PM",
    price: 3000,
  },
  {
    id: "7",
    image: millennium,
    centreName: "Millennium Park",
    city: "Abuja",
    rating: 5.0,
    reviews: 643,
    openingHours: "8:30 AM - 8:30 PM",
    price: 2500,
  },
  {
    id: "8",
    image: nikeGallery,
    centreName: "Nike Art Gallery",
    city: "Lagos",
    rating: 3.0,
    reviews: 567,
    openingHours: "8:30 AM - 6:00 PM",
    price: 1500,
  },
  {
    id: "9",
    image: agodi,
    centreName: "Agodi Garden and Zoo",
    city: "Ibadan",
    rating: 5.0,
    reviews: 567,
    openingHours: "8:00 AM - 5:00 PM",
    price: 1500,
  },
];

// Hardcoded meta cycled by index for API results
const STATIC_META = [
  { rating: 5.0, reviews: 567, openingHours: "8:30 AM - 5:00 PM", price: 2500 },
  { rating: 4.0, reviews: 66,  openingHours: "9:00 AM - 6:00 PM", price: 2000 },
  { rating: 4.9, reviews: 70,  openingHours: "8:30 AM - 5:00 PM", price: 1500 },
  { rating: 4.0, reviews: 434, openingHours: "8:30 AM - 10:00 PM", price: 1500 },
  { rating: 5.0, reviews: 70,  openingHours: "8:30 AM - 7:00 PM", price: 2000 },
  { rating: 5.0, reviews: 90,  openingHours: "10:30 AM - 5:00 PM", price: 3000 },
  { rating: 5.0, reviews: 643, openingHours: "8:30 AM - 8:30 PM", price: 2500 },
  { rating: 3.0, reviews: 567, openingHours: "8:30 AM - 6:00 PM", price: 1500 },
  { rating: 5.0, reviews: 567, openingHours: "8:00 AM - 5:00 PM", price: 1500 },
];

const STATES_TO_FETCH = ["Lagos", "Bauchi", "Ogun", "Cross River", "Abuja", "Oyo"];

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`f-${i}`} color="#ff6b35" />);
  }
  if (hasHalf) {
    stars.push(<FaStar key="half" color="#ff6b35" opacity={0.5} />);
  }
  while (stars.length < 5) {
    stars.push(<FaStar key={`e-${stars.length}`} color="#ddd" />);
  }
  return stars;
};

const formatPrice = (price) => `₦${Number(price).toLocaleString()}`;

const FeaturedAttractions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { touristCentres, touristCentresLoading } = useSelector(
    (state) => state.api
  );

  // State to store combined centres from all states
  const [allCentres, setAllCentres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        
        // Take up to 9 centres from API
        const apiCentres = uniqueCentres.slice(0, 9);
        
        // If we have less than 9, pad with fallback data
        if (apiCentres.length < 9) {
          const needed = 9 - apiCentres.length;
          const fallbackToUse = FALLBACK_ATTRACTIONS.slice(0, needed);
          finalCentres = [...apiCentres, ...fallbackToUse];
        } else {
          finalCentres = apiCentres;
        }
      } else {
        // No API data, use all fallback
        finalCentres = FALLBACK_ATTRACTIONS;
      }
      
      setAllCentres(finalCentres);
      setIsLoading(false);
    }
  }, [touristCentres, touristCentresLoading]);

  const handleCardClick = (centre, meta) => {
    const centreId = centre.id || centre._id;
    navigate(`/centre/${centreId}`, {
      state: {
        centre: {
          id: centreId,
          centreName: centre.centreName || centre.name,
          city: centre.city || centre.state,
          state: centre.state || centre.city,
          description:
            centre.description ||
            `${centre.centreName || centre.name} is a popular tourist attraction in ${centre.city || centre.state}.`,
          images: centre.imagesPublicUrl ||
            centre.images?.map((img) => img.secureUrl) ||
            [centre.image],
          openingHours: centre.openingHours || meta.openingHours,
          rating: meta.rating,
          reviews: meta.reviews,
          packages: [
            {
              id: centreId,
              packageName: "Adult Ticket",
              packageType: "Adult",
              amount: centre.price || meta.price,
              numberOfPeople: "1",
            },
          ],
        },
      },
    });
  };

  // Show loading skeleton
  if (isLoading || touristCentresLoading) {
    return (
      <section className="attractions">
        <div className="featured-section-header">
          <h2 className="featured-section-title">Featured Attractions</h2>
        </div>
        <p className="featured-section-subtitle">
          Discover the most popular tourism centres across Nigeria
        </p>
        <div className="attractions_grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div className="attraction_card attraction_card--skeleton" key={i}>
              <div className="skeleton-img" />
              <div className="card_content">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line skeleton-line--location" />
                <div className="skeleton-line skeleton-line--rating" />
                <div className="skeleton-line skeleton-line--price" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="attractions">
      <div className="featured-section-header">
        <h2 className="featured-section-title">Featured Attractions</h2>
      </div>
      <p className="featured-section-subtitle">
        Discover the most popular tourism centres across Nigeria
      </p>

      {/* Cards — API + Fallback (always shows 9) */}
      <div className="attractions_grid">
        {allCentres.map((centre, index) => {
          // Determine if this is a fallback centre
          const isFallback = centre.id?.startsWith("static-") || 
                            (typeof centre.id === 'string' && !isNaN(centre.id)) ||
                            !!centre.image;
          
          // Get meta data
          let meta;
          if (isFallback) {
            meta = {
              rating: centre.rating || 4.0,
              reviews: centre.reviews || 0,
              openingHours: centre.openingHours || "8:30 AM - 5:00 PM",
              price: centre.price || 1500
            };
          } else {
            // Use static meta cycled by index for API data
            const staticData = STATIC_META[index % STATIC_META.length];
            meta = {
              rating: centre.rating || centre.averageRating || staticData.rating,
              reviews: centre.reviews || centre.reviewCount || staticData.reviews,
              openingHours: centre.openingHours || staticData.openingHours,
              price: centre.price || centre.amount || staticData.price
            };
          }

          // Get image URL
          const imageUrl =
            centre.image ||
            centre.imagesPublicUrl?.[0] ||
            centre.images?.[0]?.secureUrl ||
            "/novaxcape/placeholder.png";

          // Get centre name and location
          const centreName = centre.centreName || centre.name || "Attraction";
          const location = centre.city || centre.state || "Location";

          return (
            <div
              className="attraction_card"
              key={centre.id || centre._id || index}
              onClick={() => handleCardClick(centre, meta)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={imageUrl}
                alt={centreName}
                onError={(e) => { e.target.src = "/novaxcape/placeholder.png"; }}
              />

              <div className="card_content">
                <h3>{centreName}</h3>
                <h4>{location}</h4>

                <div className="card_details">
                  <div className="rating">
                    {renderStars(meta.rating)}
                    <span>{typeof meta.rating === 'number' ? meta.rating.toFixed(1) : meta.rating}</span>
                    <small>({meta.reviews || 0})</small>
                  </div>

                  <div className="time">
                    <FaRegClock />
                    <span>{meta.openingHours}</span>
                  </div>
                </div>

                {/* ✅ Added Price and Book Now Button */}
                <div className="bottom_section">
                  <div>
                    <p>From</p>
                    <h2>{formatPrice(meta.price)}</h2>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(centre, meta);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
 
export default FeaturedAttractions;