import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/FeaturedAttractions.css";
import {
  FaStar,
  FaRegClock,
} from "react-icons/fa";

import lekki from "/novaxcape/lekki.png";
import olumo from "/novaxcape/olumo.png";
import mapo from "/novaxcape/mapo.png";
import greenLegacy from "/novaxcape/greenLegacy.png";
import yankari from "/novaxcape/yankari.png";
import obudu from "/novaxcape/obudu.png";
import millennium from "/novaxcape/millennium.png";
import nikeGallery from "/novaxcape/nikeGallery.png";
import agodi from "/novaxcape/agodi.png";

const attractions = [
  {
    id: "1",  // ✅ Changed to string
    image: lekki,
    title: "Lekki Conservation Centre",
    location: "Lagos",
    rating: 5.0,
    reviews: 567,
    time: "8:30 AM - 5:00 PM",
    price: 2500,
  },
  {
    id: "2",  // ✅ Changed to string
    image: olumo,
    title: "Olumo Rock",
    location: "Abeokuta",
    rating: 4.0,
    reviews: 66,
    time: "9:00 AM - 6:00 PM",
    price: 2000,
  },
  {
    id: "3",  // ✅ Changed to string
    image: mapo,
    title: "Mapo Hall",
    location: "Ibadan",
    rating: 4.9,
    reviews: 70,
    time: "8:30 AM - 5:00 PM",
    price: 1500,
  },
  {
    id: "4",  // ✅ Changed to string
    image: greenLegacy,
    title: "Green Legacy Resort",
    location: "Ogun State",
    rating: 4.0,
    reviews: 434,
    time: "8:30 AM - 10:00 PM",
    price: 1500,
  },
  {
    id: "5",  // ✅ Changed to string
    image: yankari,
    title: "Yankari National Park",
    location: "Bauchi",
    rating: 5.0,
    reviews: 70,
    time: "8:30 AM - 7:00 PM",
    price: 2000,
  },
  {
    id: "6",  // ✅ Changed to string
    image: obudu,
    title: "Obudu Mountain Resort",
    location: "Cross River",
    rating: 5.0,
    reviews: 90,
    time: "10:30 AM - 5:00 PM",
    price: 3000,
  },
  {
    id: "7",  // ✅ Changed to string
    image: millennium,
    title: "Millennium Park",
    location: "Abuja",
    rating: 5.0,
    reviews: 643,
    time: "8:30 AM - 8:30 PM",
    price: 2500,
  },
  {
    id: "8",  // ✅ Changed to string
    image: nikeGallery,
    title: "Nike Art Gallery",
    location: "Lagos",
    rating: 3.0,
    reviews: 567,
    time: "8:30 AM - 6:00 PM",
    price: 1500,
  },
  {
    id: "9",  // ✅ Changed to string
    image: agodi,
    title: "Agodi Garden and Zoo",
    location: "Ibadan",
    rating: 5.0,
    reviews: 567,
    time: "8:00 AM - 5:00 PM",
    price: 1500,
  },
];

const FeaturedAttractions = () => {
  const navigate = useNavigate();

  const handleBookNow = (place) => {
    console.log("Navigating to centre:", place.id);
    navigate(`/centre/${place.id}`, {
      state: { 
        centre: {
          id: place.id,
          centreName: place.title,
          city: place.location,
          state: place.location,
          description: `${place.title} is a popular tourist attraction in ${place.location}.`,
          images: [place.image],
          openingHours: place.time,
          rating: place.rating,
          reviews: place.reviews,
          packages: [
            {
              id: place.id,
              packageName: "Adult Ticket",
              packageType: "Adult",
              amount: place.price,
              numberOfPeople: "1"
            }
          ]
        }
      }
    });
  };

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
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
    <section className="attractions">
      <div className="featured-section-header">
        <h2 className="featured-section-title">Featured Attractions</h2>
      </div>
      
      <p className="featured-section-subtitle">
        Discover the most popular tourism centres across Nigeria
      </p>
      
      {/* Cards */}
      <div className="attractions_grid">
        {attractions.map((place) => (
          <div
            className="attraction_card"
            key={place.id}
            onClick={() => handleBookNow(place)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={place.image}
              alt={place.title}
            />

            <div className="card_content">
              <h3>{place.title}</h3>

              <h4>{place.location}</h4>

              <div className="card_details">
                <div className="rating">
                  {renderStars(place.rating)}
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
                  <h2>{formatPrice(place.price)}</h2>
                </div>

                <button onClick={(e) => {
                  e.stopPropagation();
                  handleBookNow(place);
                }}>
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