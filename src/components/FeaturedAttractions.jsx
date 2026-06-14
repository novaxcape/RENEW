import React, { useState } from "react";
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
    id: 1,
    image: lekki,
    title: "Lekki Conservation Centre",
    location: "Lagos",
    rating: 5.0,
    reviews: 567,
    time: "8:30 AM - 5:00 PM",
    price: 2500,
  },
  {
    id: 2,
    image: olumo,
    title: "Olumo Rock",
    location: "Abeokuta",
    rating: 4.0,
    reviews: 66,
    time: "9:00 AM - 6:00 PM",
    price: 2000,
  },
  {
    id: 3,
    image: mapo,
    title: "Mapo Hall",
    location: "Ibadan",
    rating: 4.9,
    reviews: 70,
    time: "8:30 AM - 5:00 PM",
    price: 1500,
  },
  {
    id: 4,
    image: greenLegacy,
    title: "Green Legacy Resort",
    location: "Ogun State",
    rating: 4.0,
    reviews: 434,
    time: "8:30 AM - 10:00 PM",
    price: 1500,
  },
  {
    id: 5,
    image: yankari,
    title: "Yankari National Park",
    location: "Bauchi",
    rating: 5.0,
    reviews: 70,
    time: "8:30 AM - 7:00 PM",
    price: 2000,
  },
  {
    id: 6,
    image: obudu,
    title: "Obudu Mountain Resort",
    location: "Cross River",
    rating: 5.0,
    reviews: 90,
    time: "10:30 AM - 5:00 PM",
    price: 3000,
  },
  {
    id: 7,
    image: millennium,
    title: "Millennium Park",
    location: "Abuja",
    rating: 5.0,
    reviews: 643,
    time: "8:30 AM - 8:30 PM",
    price: 2500,
  },
  {
    id: 8,
    image: nikeGallery,
    title: "Nike Art Gallery",
    location: "Lagos",
    rating: 3.0,
    reviews: 567,
    time: "8:30 AM - 6:00 PM",
    price: 1500,
  },
  {
    id: 9,
    image: agodi,
    title: "Agodi Garden and Zoo",
    location: "Ibadan",
    rating: 5.0,
    reviews: 567,
    time: "8:00 AM - 5:00 PM",
    price: 1500,
  },
];

const FeaturedAttractions= () => {
  

  return (
    <section className="attractions">
      <div className="section-header">
        <h2 className="section-title">Featured Attractions</h2>
        
      </div>
      
          <p className="section-subtitle">
          Discover the most popular tourism centres across Nigeria
        </p>
      {/* Cards */}

      <div className="attractions_grid">
        {attractions.map((place) => (
          <div
            className="attraction_card"
            key={place.id}
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
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}

                  <span>
                    {place.rating}
                  </span>

                  <small>
                    ({place.reviews})
                  </small>
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

                <button>
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