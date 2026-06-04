import React from 'react'

const UserFeatures = () => {
  return (
    <>
       <section className="reviews-carousel-block">
          <h2 className="block-section-heading">View all Reviews</h2>
          <div className="reviews-cards-container">
            <div className="themed-review-card">
              <div className="user-profile-summary">
                <div className="avatar-placeholder">👤</div>
                <div>
                  <h4 className="user-fullname">Nnaneme O.</h4>
                  <div className="stars-row">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="review-body-text">
                Absolutely loved the canopy walkway! It was so long and the view
                from the top is breathtaking. A must visit for anyone in Lagos.
                Very well maintained.
              </p>
            </div>

            <div className="themed-review-card">
              <div className="user-profile-summary">
                <div className="avatar-placeholder">👤</div>
                <div>
                  <h4 className="user-fullname">Tunde S.</h4>
                  <div className="stars-row">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="review-body-text">
                Perfect for a family outing. My kids enjoyed the canopy walk and
                the playground area. The boardwalks are clean and safe. Highly
                recommended!
              </p>
            </div>

            <div className="themed-review-card">
              <div className="user-profile-summary">
                <div className="avatar-placeholder">👤</div>
                <div>
                  <h4 className="user-fullname">Salewa Ahmed</h4>
                  <div className="stars-row">⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="review-body-text">
                The place is beautiful and peaceful. Saw so many monkeys and
                birds. However, the ticket price is a bit high compared to other
                parks. Still worth it though.
              </p>
            </div>
          </div>

          <div className="carousel-navigation-arrows">
            <button className="nav-arrow">&lt;</button>
            <button className="nav-arrow active-arrow">&gt;</button>
          </div>
        </section>

     
        <section className="recommendations-container-section">
          <h2 className="block-section-heading">
            Destinations you may also like
          </h2>
          <div className="recommendations-cards-grid">
         
            <div className="themed-destination-card">
              <div className="destination-thumbnail">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80"
                  alt="Lekki Conservation Centre mini"
                />
              </div>
              <div className="destination-details-box">
                <h3 className="destination-name-title">
                  Lekki Conservation Centre
                </h3>
                <p className="destination-location-state">Lagos</p>
                <div className="destination-ratings-timetable">
                  <span className="star-rating-orange">
                    ⭐⭐⭐⭐⭐ <strong className="bold-rate-value">5.0</strong>{" "}
                    <span className="total-votes-count">(567)</span>
                  </span>
                  <span className="time-window-span">⏰ 8:30 AM - 5:00 PM</span>
                </div>
                <div className="destination-card-footer">
                  <span className="price-label-text">
                    From <br />
                    <strong className="currency-bold">2500</strong>
                  </span>
                  <img
                    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='orange'><path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/></svg>"
                    alt=""
                    className="footer-star-decor"
                  />
                  <button className="orange-card-book-btn">Book Now</button>
                </div>
              </div>
            </div>


            <div className="themed-destination-card">
              <div className="destination-thumbnail">
                <img
                  src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=400&q=80"
                  alt="Olumo Rock"
                />
              </div>
              <div className="destination-details-box">
                <h3 className="destination-name-title">Olumo Rock</h3>
                <p className="destination-location-state">Abeokuta</p>
                <div className="destination-ratings-timetable">
                  <span className="star-rating-orange">
                    ⭐⭐⭐⭐⭐ <strong className="bold-rate-value">4.0</strong>{" "}
                    <span className="total-votes-count">(89)</span>
                  </span>
                  <span className="time-window-span">⏰ 9:00 AM - 6:00 PM</span>
                </div>
                <div className="destination-card-footer">
                  <span className="price-label-text">
                    From <br />
                    <strong className="currency-bold">2000</strong>
                  </span>
                  <button className="orange-card-book-btn">Book Now</button>
                </div>
              </div>
            </div>

   
            <div className="themed-destination-card">
              <div className="destination-thumbnail">
                <img
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80"
                  alt="Mapo Hall"
                />
              </div>
              <div className="destination-details-box">
                <h3 className="destination-name-title">Mapo Hall</h3>
                <p className="destination-location-state">Ibadan</p>
                <div className="destination-ratings-timetable">
                  <span className="star-rating-orange">
                    ⭐⭐⭐⭐⭐ <strong className="bold-rate-value">4.9</strong>{" "}
                    <span className="total-votes-count">(76)</span>
                  </span>
                  <span className="time-window-span">⏰ 8:30 AM - 5:00 PM</span>
                </div>
                <div className="destination-card-footer">
                  <span className="price-label-text">
                    From <br />
                    <strong className="currency-bold">1500</strong>
                  </span>
                  <button className="orange-card-book-btn">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  )
}

export default UserFeatures
