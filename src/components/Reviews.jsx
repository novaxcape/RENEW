// File: src/components/Reviews.jsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { PiSliders } from "react-icons/pi";
import { createReview } from "../redox/apiSlice";
import "./css/Reviews.css";

const reviewsData = [
  {
    id: 1,
    name: "Sunday Ebere",
    avatar: "/novaxcape/sun.png",
    date: "12/05/2026",
    rating: 5,
    text: "Absolutely loved the canopy walkway! It was so long and the view from the top is breathtaking. A must-visit for anyone in Lagos. Very well maintained.",
  },
  {
    id: 2,
    name: "Enejo Ernest",
    avatar: "/novaxcape/ene.png",
    date: "11/05/2026",
    rating: 5,
    text: "Perfect for a family outing. My kids enjoyed the canopy walk and the playground area. The boardwalks are clean and safe. Highly recommended!",
  },
  {
    id: 3,
    name: "Elton Ruth",
    avatar: "/novaxcape/elton.png",
    date: "13/05/2026",
    rating: 4,
    text: "The place is beautiful and peaceful. Saw so many monkeys and birds. However, the ticket price is a bit high compared to other parks. Still worth it though.",
  },
];

const StarDisplay = ({ rating, size = 20 }) => {
  return (
    <div className="reviews-stars" style={{ fontSize: `${size}px` }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`reviews-star ${star <= Math.round(rating) ? "reviews-star--filled" : "reviews-star--empty"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const StarInput = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="reviews-star-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`reviews-star-input__star ${
            star <= (hoverValue || value) ? "reviews-star-input__star--filled" : ""
          }`}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const Reviews = ({ touristCentreId: propTouristCentreId }) => {
  const dispatch = useDispatch();
  
  // Try to get ID from props first, then from URL params as fallback
  const params = useParams();
  const touristCentreId = propTouristCentreId || params.touristCentreId;
  
  const { reviewsLoading } = useSelector((state) => state.api);

  const overallRating = 4.8;
  const totalReviews = 110;

  const barData = [
    { star: 5, label: "5 Stars", percent: 99.5 },
    { star: 4, label: "4 Stars", percent: 80 },
    { star: 3, label: "3 Stars", percent: 60 },
    { star: 2, label: "2 Stars", percent: 40 },
    { star: 1, label: "1 Star", percent: 20 },
  ];

  const [formRating, setFormRating] = useState(0);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formReview, setFormReview] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMsg("");
    setSubmitError("");

    // Validate form
    if (!formRating || !formName.trim() || !formEmail.trim() || !formReview.trim()) {
      setSubmitError("Please fill in all fields and select a rating.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail.trim())) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    // Check if touristCentreId exists
    if (!touristCentreId) {
      setSubmitError("Error: Tourist centre ID is missing. Please go back and try again.");
      return;
    }

    try {
      console.log("📤 Submitting review for centre:", touristCentreId);
      console.log("📤 Form data:", {
        ratings: String(formRating),
        fullName: formName.trim(),
        email: formEmail.trim(),
        addYourReview: formReview.trim(),
      });

      // ✅ CORRECT: Pass touristCentreId and reviewData as an object
      await dispatch(
        createReview({
          touristCentreId: touristCentreId,
          reviewData: {
            ratings: String(formRating),
            fullName: formName.trim(),
            email: formEmail.trim(),
            addYourReview: formReview.trim(),
          }
        })
      ).unwrap();

      setSubmitMsg("Thank you! Your review has been submitted. 🎉");
      
      // Reset form
      setFormRating(0);
      setFormName("");
      setFormEmail("");
      setFormReview("");
      
    } catch (error) {
      console.error("❌ Review submission error:", error);
      setSubmitError(
        typeof error === "string"
          ? error
          : error?.message || "Failed to submit review. Please try again."
      );
    }
  };

  return (
    <div className="reviews-page">
      <h1 className="reviews-page__title">View all reviews and add yours</h1>

      <div className="reviews-overview">
        <div className="reviews-overview__summary">
          <h2 className="reviews-overview__heading">Overall Rating</h2>
          <div className="reviews-overview__score-row">
            <span className="reviews-overview__score">{overallRating.toFixed(1)}</span>
            <span className="reviews-overview__outof">out of 5</span>
          </div>
          <StarDisplay rating={overallRating} size={22} />
          <p className="reviews-overview__count">({totalReviews} Reviews)</p>
        </div>

        <div className="reviews-overview__bars">
          <h2 className="reviews-overview__heading">Overall Rating</h2>
          {barData.map((bar) => (
            <div className="reviews-bar-row" key={bar.star}>
              <span className="reviews-bar-row__label">{bar.label}</span>
              <div className="reviews-bar-row__track">
                <div
                  className="reviews-bar-row__fill"
                  style={{ width: `${bar.percent}%` }}
                />
              </div>
              <span className="reviews-bar-row__percent">
                {bar.percent % 1 === 0 ? bar.percent.toFixed(0) : bar.percent.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <button className="reviews-filter-btn">
        <PiSliders className="reviews-filter-btn__icon" />
        Filter Reviews By
      </button>

      <div className="reviews-content">
        <div className="reviews-feedback-col">
          <h2 className="reviews-section-heading">Recent Feedbacks</h2>
          <div className="reviews-feedback-list">
            {reviewsData.map((review) => (
              <div className="reviews-feedback-card" key={review.id}>
                <div className="reviews-feedback-card__header">
                  <div className="reviews-feedback-card__user">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="reviews-feedback-card__avatar"
                    />
                    <div className="reviews-feedback-card__user-info">
                      <p className="reviews-feedback-card__name">{review.name}</p>
                      <p className="reviews-feedback-card__date">{review.date}</p>
                    </div>
                  </div>
                  <StarDisplay rating={review.rating} size={16} />
                </div>
                <p className="reviews-feedback-card__text">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-form-col">
          <h2 className="reviews-section-heading">Add a review</h2>
          <form className="reviews-form" onSubmit={handleSubmit}>
            <label className="reviews-form__label">Add Your rating</label>
            <StarInput value={formRating} onChange={setFormRating} />

            <label className="reviews-form__label" htmlFor="reviews-name">
              Name
            </label>
            <input
              id="reviews-name"
              type="text"
              className="reviews-form__input"
              placeholder="Enter your Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              disabled={reviewsLoading}
            />

            <label className="reviews-form__label" htmlFor="reviews-email">
              Email Address
            </label>
            <input
              id="reviews-email"
              type="email"
              className="reviews-form__input"
              placeholder="Enter your Email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              disabled={reviewsLoading}
            />

            <label className="reviews-form__label" htmlFor="reviews-review">
              Add your Review
            </label>
            <textarea
              id="reviews-review"
              className="reviews-form__textarea"
              placeholder="Type here"
              value={formReview}
              onChange={(e) => setFormReview(e.target.value)}
              disabled={reviewsLoading}
            />

            {/* Success / Error Messages */}
            {submitMsg && (
              <p className="reviews-form__success">{submitMsg}</p>
            )}
            {submitError && (
              <p className="reviews-form__error">{submitError}</p>
            )}

            <button 
              type="submit" 
              className="reviews-form__submit"
              disabled={reviewsLoading}
            >
              {reviewsLoading ? "Submitting..." : "Add Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;