import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import "../Styles/About.css";

const About = () => {
  return (
    <main className="about-page">
      <Header />
      <section className="page-section">
        <div className="page-content">
          <h1>About Us</h1>
          <p>
            Novaxcape connects travellers with unforgettable attractions and
            seamless bookings.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default About;
