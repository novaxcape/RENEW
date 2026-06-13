import React, { useState, useEffect } from "react";
import "../components/css/AboutUsHero.css";

const images = [
  "/novaxcape/abouthero.png",
  "/novaxcape/about2.jpg",
  "/novaxcape/about3.jpg",
];

const Aboutpagehero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="aboutHero"
      style={{
        backgroundImage: `url(${images[currentSlide]})`,
      }}
    >
      <div className="overlay"></div>

      <div className="aboutContent">
        <h2>About Us</h2>

        <p>
          We are Novaxcape — A platform dedicated to simplifying the discovery and
          booking of <br />
          tourism centres across Nigeria, so every traveler can enjoy
          seamless and memorable experiences
        </p>
      </div>

      <div className="sliderDots">
        {images.map((_, index) => (
          <span
            key={index}
            className={currentSlide === index ? "activeDot" : ""}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Aboutpagehero;