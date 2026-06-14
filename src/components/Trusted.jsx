// Trusted.jsx
import "./css/Trusted.css";
import React, { useState } from "react";
import { FaExternalLinkAlt, FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const testimonialSets = [
  [
    {
      name: "Tunde S.",
      image: "/novaxcape/tunde.png",
      rating: 5,
      text: "Finally an app that works well in Nigeria. I booked tickets easily and the instalment option was very helpful.",
    },
    {
      name: "Benita F.",
      image: "/novaxcape/benita.png",
      rating: 5,
      text: "NovaEscape saved me so much stress. I hate queues, now I just scan my ticket and enter. Great job!",
    },
  ],
  [
    {
      name: "Chidera N.",
      image: "/novaxcape/chidera.png",
      rating: 5,
      text: "Booking was so smooth! I paid with Paystack and got my Digital ticket immediately. No more stressful queues at the gate.",
    },
    {
      name: "Amodu Bello",
      image: "/novaxcape/amodu.png",
      rating: 5,
      text: "Best app for local tourism! Booked Ado-Awaye Hills from home and everything went perfect. Highly recommended.",
    },
  ],
  [
    {
      name: "Mina T.",
      image: "/novaxcape/mina.png",
      rating: 5,
      text: "Used it for Lekki Conservation Centre last weekend. Everything was clear — price, availability, and easy payment. Love it!",
    },
    {
      name: "Ebere S.",
      image: "/novaxcape/ebere.png",
      rating: 5,
      text: "Simple and straightforward. Booked Agodi Gardens in under 2 minutes. Just wish they had more centres listed.",
    },
  ],
];

const Trusted = () => {
  const [currentSet, setCurrentSet] = useState(0);

  const handlePrev = () => {
    if (currentSet > 0) setCurrentSet((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentSet < testimonialSets.length - 1) setCurrentSet((prev) => prev + 1);
  };

  const currentCards = testimonialSets[currentSet];
  const isPrevDisabled = currentSet === 0;
  const isNextDisabled = currentSet === testimonialSets.length - 1;

  return (
    <section className="trusted-section">
      <div className="trusted-left">
        <h2 className="trusted-heading">Trusted by Travelers Across Nigeria</h2>
        <p className="trusted-paragraph">
          See what people are saying about their experiences, seamless bookings, and unforgettable moments with us.
        </p>
        <button className="trusted-view-all-btn">
          View all <FaExternalLinkAlt size={14} />
        </button>
      </div>

      <div className="trusted-right">
        <div className="trusted-cards-row">
          {currentCards.map((card, index) => (
            <div className="trusted-card" key={`${currentSet}-${index}`}>
              <div className="trusted-card-header">
                <img
                  src={card.image}
                  alt={card.name}
                  className="trusted-avatar"
                />
                <div className="trusted-name-rating">
                  <h3 className="trusted-name">{card.name}</h3>
                  <div className="trusted-stars">
                    {Array.from({ length: card.rating }).map((_, i) => (
                      <FaStar key={i} className="trusted-star" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="trusted-text">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="trusted-nav">
          <button
            className={`trusted-nav-btn trusted-nav-prev ${isPrevDisabled ? "disabled" : ""}`}
            onClick={handlePrev}
            disabled={isPrevDisabled}
            aria-label="Previous testimonials"
          >
            <FaArrowLeft />
          </button>
          <button
            className={`trusted-nav-btn trusted-nav-next ${isNextDisabled ? "disabled" : ""}`}
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label="Next testimonials"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Trusted;