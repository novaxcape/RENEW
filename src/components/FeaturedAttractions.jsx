import React, { useEffect } from "react";
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

  useEffect(() => {
    STATES_TO_FETCH.forEach((state) => {
      dispatch(getTouristCentersByState(state));
    });
  }, [dispatch]);

  // Use API data if available, otherwise fall back to static
  const apiCentres = touristCentres.slice(0, 9);
  const usingFallback = !touristCentresLoading && apiCentres.length === 0;
  const displayCentres = usingFallback ? FALLBACK_ATTRACTIONS : apiCentres;

  const handleCardClick = (centre, meta) => {
    navigate(`/centre/${centre.id}`, {
      state: {
        centre: {
          id: centre.id,
          centreName: centre.centreName,
          city: centre.city || centre.state,
          state: centre.state || centre.city,
          description:
            centre.description ||
            `${centre.centreName} is a popular tourist attraction in ${centre.city || centre.state}.`,
          images: centre.imagesPublicUrl ||
            centre.images?.map((img) => img.secureUrl) ||
            [centre.image],
          openingHours: centre.openingHours || meta.openingHours,
          rating: meta.rating,
          reviews: meta.reviews,
          packages: [
            {
              id: centre.id,
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

  return (
    <section className="attractions">
      <div className="featured-section-header">
        <h2 className="featured-section-title">Featured Attractions</h2>
      </div>
      <p className="featured-section-subtitle">
        Discover the most popular tourism centres across Nigeria
      </p>

      {/* Loading skeleton */}
      {touristCentresLoading && apiCentres.length === 0 && (
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
      )}

      {/* Cards — API or fallback */}
      {!touristCentresLoading && (
        <div className="attractions_grid">
          {displayCentres.map((centre, index) => {
            const isFallback = centre.id?.startsWith("static-") || !!centre.image;
            const meta = isFallback
              ? { rating: centre.rating, reviews: centre.reviews, openingHours: centre.openingHours, price: centre.price }
              : STATIC_META[index % STATIC_META.length];

            const imageUrl =
              centre.image ||
              centre.imagesPublicUrl?.[0] ||
              centre.images?.[0]?.secureUrl ||
              "/novaxcape/placeholder.png";

            return (
              <div
                className="attraction_card"
                key={centre.id || index}
                onClick={() => handleCardClick(centre, meta)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={imageUrl}
                  alt={centre.centreName}
                  onError={(e) => { e.target.src = "/novaxcape/placeholder.png"; }}
                />

                <div className="card_content">
                  <h3>{centre.centreName}</h3>
                  <h4>{centre.city || centre.state}</h4>

                  <div className="card_details">
                    <div className="rating">
                      {renderStars(meta.rating)}
                      <span>{meta.rating}</span>
                      <small>({meta.reviews} reviews)</small>
                    </div>

                    <div className="time">
                      <FaRegClock />
                      <span>{centre.openingHours || meta.openingHours}</span>
                    </div>
                  </div>

                  <div className="bottom_section">
                    <div>
                      <p>From</p>
                      <h2>{formatPrice(centre.price || meta.price)}</h2>
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
      )}
    </section>
  );
};

export default FeaturedAttractions;
