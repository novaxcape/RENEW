import React from "react";
import { FaStar, FaRegClock } from "react-icons/fa";
import "./css/FeaturedAttractions.css";

const FeaturedAttractions = () => {
  return (
    <section className="attractions">
      <div className="featured-section-header">
        <h2 className="featured-section-title">Featured Attractions</h2>
      </div>
      <p className="featured-section-subtitle">
        Discover the most popular tourism centres across Nigeria
      </p>

      <div className="attractions_grid">
        <div className="attraction_card">
          <img src="/novaxcape/lekki.png" alt="Lekki Conservation Centre" />

          <div className="card_content">
            <h3>Lekki Conservation Centre</h3>
            <h4>Lagos</h4>

            <div className="card_details">
              <div className="rating">
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <span>5.0</span>
                <small>(567)</small>
              </div>

              <div className="time">
                <FaRegClock />
                <span>8:30 AM - 5:00 PM</span>
              </div>
            </div>

            <div className="bottom_section">
              <div>
                <p>From</p>
                <h2>₦2,500</h2>
              </div>

              <button>Book Now</button>
            </div>
          </div>
        </div>
        <div className="attraction_card">
          <img src="/novaxcape/olumo.png" alt="Olumo Rock" />

          <div className="card_content">
            <h3>Olumo Rock</h3>
            <h4>Abeokuta</h4>

            <div className="card_details">
              <div className="rating">
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ddd" />
                <span>4.0</span>
                <small>(66)</small>
              </div>

              <div className="time">
                <FaRegClock />
                <span>9:00 AM - 6:00 PM</span>
              </div>
            </div>

            <div className="bottom_section">
              <div>
                <p>From</p>
                <h2>₦2,000</h2>
              </div>

              <button>Book Now</button>
            </div>
          </div>
        </div>
        <div className="attraction_card">
          <img src="/novaxcape/mapo.png" alt="Mapo Hall" />

          <div className="card_content">
            <h3>Mapo Hall</h3>
            <h4>Ibadan</h4>

            <div className="card_details">
              <div className="rating">
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" opacity={0.5} />
                <span>4.9</span>
                <small>(70)</small>
              </div>

              <div className="time">
                <FaRegClock />
                <span>8:30 AM - 5:00 PM</span>
              </div>
            </div>

            <div className="bottom_section">
              <div>
                <p>From</p>
                <h2>₦1,500</h2>
              </div>

              <button>Book Now</button>
            </div>
          </div>
        </div>
        <div className="attraction_card">
          <img src="/novaxcape/greenLegacy.png" alt="Green Legacy Resort" />

          <div className="card_content">
            <h3>Green Legacy Resort</h3>
            <h4>Ogun State</h4>

            <div className="card_details">
              <div className="rating">
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ddd" />
                <span>4.0</span>
                <small>(434)</small>
              </div>

              <div className="time">
                <FaRegClock />
                <span>8:30 AM - 10:00 PM</span>
              </div>
            </div>

            <div className="bottom_section">
              <div>
                <p>From</p>
                <h2>₦1,500</h2>
              </div>

              <button>Book Now</button>
            </div>
          </div>
        </div>
        <div className="attraction_card">
          <img src="/novaxcape/yankari.png" alt="Yankari National Park" />

          <div className="card_content">
            <h3>Yankari National Park</h3>
            <h4>Bauchi</h4>

            <div className="card_details">
              <div className="rating">
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <span>5.0</span>
                <small>(70)</small>
              </div>

              <div className="time">
                <FaRegClock />
                <span>8:30 AM - 7:00 PM</span>
              </div>
            </div>

            <div className="bottom_section">
              <div>
                <p>From</p>
                <h2>₦2,000</h2>
              </div>

              <button>Book Now</button>
            </div>
          </div>
        </div>
        <div className="attraction_card">
          <img src="/novaxcape/obudu.png" alt="Obudu Mountain Resort" />

          <div className="card_content">
            <h3>Obudu Mountain Resort</h3>
            <h4>Cross River</h4>

            <div className="card_details">
              <div className="rating">
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <span>5.0</span>
                <small>(90)</small>
              </div>

              <div className="time">
                <FaRegClock />
                <span>10:30 AM - 5:00 PM</span>
              </div>
            </div>

            <div className="bottom_section">
              <div>
                <p>From</p>
                <h2>₦3,000</h2>
              </div>

              <button>Book Now</button>
            </div>
          </div>
        </div>
        <div className="attraction_card">
          <img src="/novaxcape/millennium.png" alt="Millennium Park" />

          <div className="card_content">
            <h3>Millennium Park</h3>
            <h4>Abuja</h4>

            <div className="card_details">
              <div className="rating">
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <span>5.0</span>
                <small>(643)</small>
              </div>

              <div className="time">
                <FaRegClock />
                <span>8:30 AM - 8:30 PM</span>
              </div>
            </div>

            <div className="bottom_section">
              <div>
                <p>From</p>
                <h2>₦2,500</h2>
              </div>

              <button>Book Now</button>
            </div>
          </div>
        </div>
        <div className="attraction_card">
          <img src="/novaxcape/nikeGallery.png" alt="Nike Art Gallery" />

          <div className="card_content">
            <h3>Nike Art Gallery</h3>
            <h4>Lagos</h4>

            <div className="card_details">
              <div className="rating">
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ddd" />
                <FaStar color="#ddd" />
                <span>3.0</span>
                <small>(567)</small>
              </div>

              <div className="time">
                <FaRegClock />
                <span>8:30 AM - 6:00 PM</span>
              </div>
            </div>

            <div className="bottom_section">
              <div>
                <p>From</p>
                <h2>₦1,500</h2>
              </div>

              <button>Book Now</button>
            </div>
          </div>
        </div>
        <div className="attraction_card">
          <img src="/novaxcape/agodi.png" alt="Agodi Garden and Zoo" />

          <div className="card_content">
            <h3>Agodi Garden and Zoo</h3>
            <h4>Ibadan</h4>

            <div className="card_details">
              <div className="rating">
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <FaStar color="#ff6b35" />
                <span>5.0</span>
                <small>(567)</small>
              </div>

              <div className="time">
                <FaRegClock />
                <span>8:00 AM - 5:00 PM</span>
              </div>
            </div>

            <div className="bottom_section">
              <div>
                <p>From</p>
                <h2>₦1,500</h2>
              </div>

              <button>Book Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAttractions;
