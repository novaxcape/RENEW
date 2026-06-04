
import React from "react";
import Header from "../components/Header";
import { FaStar, FaClock } from "react-icons/fa";
import "../Styles/SavedAttractions.css";

const attractions = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "Lekki Conservation Centre",
    location: "Lagos",
    rating: "5.0",
    reviews: 567,
    time: "8:30 AM - 5:00 PM",
    price: "2500",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969",
    title: "Olumo Rock",
    location: "Abeokuta",
    rating: "4.0",
    reviews: 66,
    time: "9:00 AM - 6:00 PM",
    price: "2000",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2",
    title: "Mapo Hall",
    location: "Ibadan",
    rating: "4.9",
    reviews: 70,
    time: "8:30 AM - 5:00 PM",
    price: "1500",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    title: "Green Legacy Resort",
    location: "Ogun State",
    rating: "4.0",
    reviews: 434,
    time: "8:30 AM - 10:00 PM",
    price: "1500",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    title: "Yankari National Park",
    location: "Bauchi",
    rating: "5.0",
    reviews: 70,
    time: "8:30 AM - 7:00 PM",
    price: "2000",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    title: "Obudu Mountain Resort",
    location: "Cross River",
    rating: "5.0",
    reviews: 90,
    time: "10:30 AM - 5:00 PM",
    price: "3000",
  },
];

const WishList = () => {
  return (
    <>
      <Header />

      <section className="saved-attractions">
        <h2>Saved Attractions (6)</h2>

        <p className="subtitle">
          View and manage all your saved experiences in one place
        </p>

        <div className="attractions-grid">
          {attractions.map((item) => (
            <div className="attraction-card" key={item.id}>
              <img src={item.image} alt={item.title} />

              <div className="card-body">
                <h3>{item.title}</h3>

                <p className="location">{item.location}</p>

                <div className="rating-row">
                  <div>
                    {[...Array(5)].map((_, index) => (
                      <FaStar key={index} className="star" />
                    ))}

                    <span className="rating">
                      {item.rating} ({item.reviews})
                    </span>
                  </div>

                  <span className="time">
                    <FaClock />
                    {item.time}
                  </span>
                </div>

                <div className="bottom-row">
                  <div>
                    <small>From</small>
                    <h4>₦{item.price}</h4>
                  </div>

                  <button>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default WishList;

