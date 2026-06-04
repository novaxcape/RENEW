
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaCheckCircle,
  FaHeart,
} from "react-icons/fa";

import "../Styles/Product.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductDetails = () => {
  return (
    <>
      <Header />

      <main className="product-page">
        <div className="container">

          {/* TITLE SECTION */}
          <section className="listing-header">
            <h1 className="title">Lekki Conservation Centre</h1>

            <div className="meta">
              <span>
                <FaMapMarkerAlt /> Lekki, Lagos State
              </span>

              <span>
                <FaClock /> Daily 8AM - 6PM
              </span>

              <span className="rating">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <strong>5.0</strong> (567)
              </span>
            </div>

            <div className="tags">
              <span>Nature Trails</span>
              <span>Picnic Areas</span>
              <span>Wildlife Viewing</span>
              <span>Canopy Walkway</span>
            </div>
          </section>

          {/* IMAGE GALLERY */}
          <section className="gallery">
            <div className="main-image">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                alt="Lekki Conservation Centre"
              />
            </div>

            <div className="side-images">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                alt=""
              />

              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
                alt=""
              />
            </div>
          </section>

          <hr className="divider" />

          {/* FEATURES */}
          <section className="features">
            <div className="feature">
              <FaCheckCircle className="feature-icon" />

              <div>
                <h4>Duration</h4>
                <p>1 Day</p>
              </div>
            </div>

            <div className="feature">
              <FaCheckCircle className="feature-icon" />

              <div>
                <h4>Activity Level</h4>
                <p>Topnotch</p>
              </div>
            </div>

            <div className="feature">
              <FaCheckCircle className="feature-icon" />

              <div>
                <h4>Includes</h4>
                <p>Ticket, Transportation, Equipment</p>
              </div>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="description-section">
            <div className="description">
              <h2>Description</h2>

              <p>
                Lekki Conservation Centre is nestled on the scenic Lekki
                Peninsula in Lagos. The centre is a beautiful conservation area
                dedicated to preserving Nigeria's rich biodiversity.
              </p>

              <p>
                The reserve is famous for Africa's longest canopy walkway,
                offering visitors a unique experience above the mangrove forest.
                Enjoy nature, wildlife viewing, and peaceful outdoor adventures.
              </p>

              <div className="actions">
                <button className="book-btn">Book Now</button>

                <button className="fav-btn">
                  Add to Favourite
                  <FaHeart />
                </button>
              </div>
            </div>

            <div className="map">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b"
                alt="Map"
              />
            </div>
          </section>

          {/* REVIEWS */}
          <section className="reviews">
            <h2>View all Reviews</h2>

            <div className="review-grid">
              <div className="review-card">
                <h4>Nnaneme D.</h4>

                <div className="review-stars">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>

                <p>
                  Absolutely loved the canopy walkway. The views were
                  breathtaking and the environment was well maintained.
                </p>
              </div>

              <div className="review-card">
                <h4>Tunde S.</h4>

                <div className="review-stars">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>

                <p>
                  Perfect destination for a family outing. Safe, clean and
                  highly recommended.
                </p>
              </div>

              <div className="review-card">
                <h4>Salewa Ahmed</h4>

                <div className="review-stars">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>

                <p>
                  Beautiful and peaceful. Saw several birds and monkeys during
                  the visit.
                </p>
              </div>
            </div>
          </section>

          {/* DESTINATIONS */}
          <section className="recommendations">
            <h2>Destinations you may also like</h2>

            <div className="destination-grid">

              <div className="destination-card">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                  alt=""
                />

                <div className="card-content">
                  <h4>Lekki Conservation Centre</h4>
                  <p>Lagos</p>

                  <div className="card-footer">
                    <span>From ₦2500</span>
                    <button>Book Now</button>
                  </div>
                </div>
              </div>

              <div className="destination-card">
                <img
                  src="https://images.unsplash.com/photo-1511497584788-876760111969"
                  alt=""
                />

                <div className="card-content">
                  <h4>Olumo Rock</h4>
                  <p>Abeokuta</p>

                  <div className="card-footer">
                    <span>From ₦2000</span>
                    <button>Book Now</button>
                  </div>
                </div>
              </div>

              <div className="destination-card">
                <img
                  src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2"
                  alt=""
                />

                <div className="card-content">
                  <h4>Mapo Hall</h4>
                  <p>Ibadan</p>

                  <div className="card-footer">
                    <span>From ₦1500</span>
                    <button>Book Now</button>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetails;
