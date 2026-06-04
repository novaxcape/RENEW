import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/FeaturedAttractions.css";
import { FaStar, FaRegStar, FaStarHalfAlt, FaClock } from "react-icons/fa";

const FeaturedAttractions = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/product");
  };

  const attractions = [
    {
      id: 1,
      image: "/novaxcape/lekki.png",
      alt: "Lekki Conservation Centre",
      title: "Lekki Conservation Centre",
      location: "Lagos",
      rating: 5.0,
      reviews: 167,
      hours: "8:30 AM - 5:00 PM",
      price: 2500,
    },
    {
      id: 2,
      image: "/novaxcape/olumo.png",
      alt: "Olumo Rock",
      title: "Olumo Rock",
      location: "Abeokuta",
      rating: 4.0,
      reviews: 66,
      hours: "9:00 AM - 6:00 PM",
      price: 2000,
    },
    {
      id: 3,
      image: "/novaxcape/omu.png",
      alt: "Mapo Hall",
      title: "Mapo Hall",
      location: "Ibadan",
      rating: 4.9,
      reviews: 70,
      hours: "8:30 AM - 5:00 PM",
      price: 1500,
    },
    {
      id: 4,
      image: "/novaxcape/net.png",
      alt: "Green Legacy Resort",
      title: "Green Legacy Resort",
      location: "Ogun State",
      rating: 4.0,
      reviews: 434,
      hours: "8:30 AM - 10:00 PM",
      price: 1500,
    },
    {
      id: 5,
      image: "/novaxcape/yankari.png",
      alt: "Yankari National Park",
      title: "Yankari National Park",
      location: "Bauchi",
      rating: 5.0,
      reviews: 70,
      hours: "8:30 AM - 7:00 PM",
      price: 2000,
    },
    {
      id: 6,
      image: "/novaxcape/obudu.png",
      alt: "Obudu Mountain Resort",
      title: "Obudu Mountain Resort",
      location: "Cross River",
      rating: 5.0,
      reviews: 90,
      hours: "10:30 AM - 5:00 PM",
      price: 3000,
    },
    {
      id: 7,
      image: "/novaxcape/mil.png",
      alt: "Millennium Park",
      title: "Millennium Park",
      location: "Abuja",
      rating: 5.0,
      reviews: 643,
      hours: "8:30 AM - 8:30 PM",
      price: 2500,
    },
    {
      id: 8,
      image: "/novaxcape/nike.png",
      alt: "Nike Art Gallery",
      title: "Nike Art Gallery",
      location: "Lagos",
      rating: 3.0,
      reviews: 307,
      hours: "8:30 AM - 6:00 PM",
      price: 1500,
    },
    {
      id: 9,
      image: "/novaxcape/green.png",
      alt: "Agodi Garden and Zoo",
      title: "Agodi Garden and Zoo",
      location: "Ibadan",
      rating: 5.0,
      reviews: 167,
      hours: "8:00 AM - 5:00 PM",
      price: 1500,
    },
    {
      id: 10,
      image: "/novaxcape/ibadan.png",
      alt: "Ibadan City Tour",
      title: "Ibadan City Tour",
      location: "Ibadan",
      rating: 4.2,
      reviews: 88,
      hours: "10:00 AM - 6:00 PM",
      price: 1800,
    },
  ];

  const filteredAttractions = attractions.filter((item) => item.rating >= 4);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {Array.from({ length: fullStars }, (_, index) => (
          <FaStar className="star-icon filled" key={`full-${index}`} />
        ))}
        {hasHalfStar && (
          <FaStarHalfAlt className="star-icon filled" key="half" />
        )}
        {Array.from({ length: emptyStars }, (_, index) => (
          <FaRegStar className="star-icon empty" key={`empty-${index}`} />
        ))}
      </>
    );
  };

  return (
    <section className="featured-section">
      <div className="section-header">
        <h2 className="section-title">Featured Attractions</h2>
        <p className="section-subtitle">
          Discover the most popular tourism centres across Nigeria
        </p>
      </div>

      <div className="attractions-grid">
        {filteredAttractions.map((attraction) => (
          <div className="attraction-card" key={attraction.id}>
            <div className="card-image-wrapper">
              <img
                src={attraction.image}
                alt={attraction.alt}
                className="card-image"
              />
            </div>
            <div className="card-content">
              <h3 className="card-title">{attraction.title}</h3>
              <p className="card-location">{attraction.location}</p>
              <div className="card-meta">
                <div className="rating-container">
                  <div className="stars-wrapper">
                    {renderStars(attraction.rating)}
                  </div>
                  <span className="rating-text">
                    {attraction.rating.toFixed(1)}{" "}
                    <span className="reviews-count">
                      ({attraction.reviews})
                    </span>
                  </span>
                </div>
                <div className="time-container">
                  <FaClock className="time-icon" />
                  <span className="time-text">{attraction.hours}</span>
                </div>
              </div>
              <div className="card-footer">
                <div className="price-container">
                  <span className="price-label">From</span>
                  <span className="price-value">{attraction.price}</span>
                </div>
                <button className="book-now-btn" onClick={handleBookNow}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedAttractions;
